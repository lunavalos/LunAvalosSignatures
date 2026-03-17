<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Company;
use Illuminate\Support\Facades\File;
use Illuminate\Support\Facades\Http;
use ZipArchive;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Get user's company with all its data
        $userCompany = $user->company_id ? Company::find($user->company_id) : null;

        // Get all companies for admin users
        $companies = Company::all();

        return Inertia::render('Dashboard', [
            'userCompany' => $userCompany,
            'companies' => $companies,
        ]);
    }

    public function downloadOutlookSignature(Request $request)
    {
        $request->validate([
            'html' => 'required|string',
            'name' => 'nullable|string',
            'position' => 'nullable|string',
            'phone' => 'nullable|string',
            'email' => 'nullable|string',
        ]);

        $html = $request->input('html');
        // Use default values if fields are empty
        $userName = $request->input('name') ?: 'Nombre del Usuario';
        $position = $request->input('position') ?: 'Puesto / Cargo';
        $phone = $request->input('phone');
        $email = $request->input('email');

        // Clean user name for filename: "José Pérez" -> "Jose_Perez"
        $safeName = \Illuminate\Support\Str::slug($userName, '_');
        $zipFileName = "Firma_Outlook_{$safeName}.zip";

        // Define dynamic base name for signature files
        $sigBaseName = $safeName;
        $filesFolderName = "{$sigBaseName}_files";

        // Temporary directory for ZIP contents
        $tempDir = storage_path('app/temp_signature_' . uniqid());
        File::makeDirectory($tempDir);
        File::makeDirectory($tempDir . '/' . $filesFolderName);

        // Regex to find images
        preg_match_all('/<img[^>]+src="([^">]+)"/i', $html, $matches);
        $images = array_unique($matches[1]);

        $imageMap = [];
        // Increase execution time for large downloads, suppress if disabled in hosting
        @set_time_limit(120);

        foreach ($images as $index => $imgUrl) {
            $extension = pathinfo(parse_url($imgUrl, PHP_URL_PATH), PATHINFO_EXTENSION) ?: 'png';
            $localName = "image" . ($index + 1) . "." . $extension;

            try {
                // If it's a data URL, extract base64 and save as file
                if (str_starts_with($imgUrl, 'data:image')) {
                    preg_match('/^data:image\/(\w+);base64,/', $imgUrl, $typeMatch);
                    if (!empty($typeMatch)) {
                        $extension = $typeMatch[1];
                        if ($extension === 'jpeg')
                            $extension = 'jpg';
                        $localName = "image" . ($index + 1) . "." . $extension;

                        $dataStr = substr($imgUrl, strpos($imgUrl, ',') + 1);
                        $data = base64_decode($dataStr);

                        if ($data) {
                            File::put($tempDir . '/' . $filesFolderName . '/' . $localName, $data);
                            $imageMap[$imgUrl] = $filesFolderName . "/" . $localName;
                        }
                    }
                    continue;
                }

                // Check if the URL is local to the application
                $appUrl = config('app.url'); // e.g., http://localhost
                $basePath = parse_url($imgUrl, PHP_URL_PATH);

                if (empty($basePath) || strlen($basePath) > 500) {
                    continue; // Skip very long or invalid paths
                }

                // Check if it's a local file in public directory
                if (file_exists(public_path($basePath))) {
                    $path = public_path($basePath);
                    File::copy($path, $tempDir . '/' . $filesFolderName . '/' . $localName);
                    $imageMap[$imgUrl] = $filesFolderName . "/" . $localName;
                }
                // Fallback for full URLs that point to this server
                else if (str_starts_with($imgUrl, $appUrl)) {
                    $relativePath = str_replace($appUrl, '', $imgUrl);
                    if (file_exists(public_path($relativePath))) {
                        $path = public_path($relativePath);
                        File::copy($path, $tempDir . '/' . $filesFolderName . '/' . $localName);
                        $imageMap[$imgUrl] = $filesFolderName . "/" . $localName;
                    }
                }
                // External URL
                else if (str_starts_with($imgUrl, 'http')) {
                    $response = Http::timeout(5)->get($imgUrl);
                    if ($response->successful()) {
                        File::put($tempDir . '/' . $filesFolderName . '/' . $localName, $response->body());
                        $imageMap[$imgUrl] = $filesFolderName . "/" . $localName;
                    }
                }
            } catch (\Exception $e) {
                // Skip if image download fails, log if possible
            }
        }

        // Replace image URLs in HTML
        foreach ($imageMap as $oldUrl => $newPath) {
            $html = str_replace($oldUrl, $newPath, $html);
        }

        // Ensure UTF-8 with BOM for .htm (Outlook likes this)
        // Ensure UTF-8 with BOM for .htm (Outlook likes this)
        $htmContent = "\xEF\xBB\xBF" . $html;
        File::put($tempDir . "/{$sigBaseName}.htm", $htmContent);

        // Simple TXT version
        $txtContent = "{$userName}\n{$position}\n";
        if ($phone)
            $txtContent .= "Tel: {$phone}\n";
        if ($email)
            $txtContent .= "Email: {$email}\n";
        File::put($tempDir . "/{$sigBaseName}.txt", $txtContent);

        // Basic RTF version
        $rtfContent = "{\\rtf1\\ansi\\deff0 {\\fonttbl {\\f0 Arial;}} \\f0 \\fs24 {$userName}\\line {$position}";
        if ($phone)
            $rtfContent .= "\\line Tel: {$phone}";
        if ($email)
            $rtfContent .= "\\line Email: {$email}";
        $rtfContent .= "}";
        File::put($tempDir . "/{$sigBaseName}.rtf", $rtfContent);

        // .bat script
        $batContent = "@echo off\r\n";
        $batContent .= "title Instalador de Firma Outlook\r\n";
        $batContent .= "cd /d \"%~dp0\"\r\n";

        $batContent .= "echo Verificando si Outlook esta abierto...\r\n";
        $batContent .= "tasklist /FI \"IMAGENAME eq outlook.exe\" 2>NUL | find /I /N \"outlook.exe\">NUL\r\n";
        $batContent .= "if \"%ERRORLEVEL%\"==\"0\" (\r\n";
        $batContent .= "    echo.\r\n";
        $batContent .= "    echo ADVERTENCIA: Outlook esta abierto.\r\n";
        $batContent .= "    echo Para que los cambios surtan efecto correctamente, se recomienda cerrarlo.\r\n";
        $batContent .= "    echo Por favor cierre Outlook y presione cualquier tecla para continuar.\r\n";
        $batContent .= "    pause >nul\r\n";
        $batContent .= ")\r\n";

        $batContent .= "set \"SIG_PATH=%APPDATA%\\Microsoft\\Signatures\"\r\n";
        $batContent .= "if not exist \"%SIG_PATH%\" mkdir \"%SIG_PATH%\"\r\n";

        $batContent .= "echo Copiando archivos de firma...\r\n";
        $batContent .= "copy /y \"{$sigBaseName}.htm\" \"%SIG_PATH%\\{$sigBaseName}.htm\"\r\n";
        $batContent .= "copy /y \"{$sigBaseName}.rtf\" \"%SIG_PATH%\\{$sigBaseName}.rtf\"\r\n";
        $batContent .= "copy /y \"{$sigBaseName}.txt\" \"%SIG_PATH%\\{$sigBaseName}.txt\"\r\n";
        $batContent .= "xcopy /s /e /y /I \"{$filesFolderName}\" \"%SIG_PATH%\\{$filesFolderName}\\\"\r\n";

        $batContent .= "echo.\r\n";
        $batContent .= "echo ========================================================\r\n";
        $batContent .= "echo  Firma instalada CORRECTAMENTE: {$userName}\r\n";
        $batContent .= "echo ========================================================\r\n";
        $batContent .= "echo.\r\n";
        $batContent .= "echo IMPORTANTE:\r\n";
        $batContent .= "echo 1. Si Outlook estaba abierto, por favor reinicielo.\r\n";
        $batContent .= "echo 2. Abra Outlook y vaya a: Archivo > Opciones > Correo > Firmas\r\n";
        $batContent .= "echo 3. Seleccione su nueva firma de la lista.\r\n";
        $batContent .= "echo.\r\n";
        $batContent .= "pause\r\n";
        File::put($tempDir . '/instalar_firma.bat', $batContent);

        // Generate ZIP
        $zip = new ZipArchive;
        $zipPath = storage_path('app/' . $zipFileName);

        \Illuminate\Support\Facades\Log::info("Starting ZIP generation: $zipPath");

        if ($zip->open($zipPath, ZipArchive::CREATE | ZipArchive::OVERWRITE) === TRUE) {
            $files = File::allFiles($tempDir);

            \Illuminate\Support\Facades\Log::info("Found files to zip: " . count($files));

            foreach ($files as $file) {
                // Determine relative path for ZIP using replace
                // Ensure we handle both backslashes (Windows) and forward slashes
                $filePath = $file->getRealPath();
                $relativePath = substr($filePath, strlen($tempDir) + 1); // +1 for the separator

                \Illuminate\Support\Facades\Log::info("Adding file: $relativePath");
                $zip->addFile($filePath, $relativePath);
            }
            $zip->close();

            if (file_exists($zipPath)) {
                \Illuminate\Support\Facades\Log::info("ZIP created successfully. Size: " . filesize($zipPath));
            } else {
                \Illuminate\Support\Facades\Log::error("ZIP file was not created.");
            }
        } else {
            \Illuminate\Support\Facades\Log::error("Failed to open ZIP archive.");
        }

        // Cleanup temp dir
        File::deleteDirectory($tempDir);

        return response()->download($zipPath)->deleteFileAfterSend(true);
    }
}
