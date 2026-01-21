<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use App\Models\Signature;

class SignatureController extends Controller
{
    public function uploadPhoto(Request $request)
    {
        // Rate limiting: 3 uploads per minute per user
        $key = 'upload-photo:' . $request->user()->id;

        if (RateLimiter::tooManyAttempts($key, 3)) {
            $seconds = RateLimiter::availableIn($key);
            return response()->json([
                'success' => false,
                'message' => 'Demasiados intentos. Por favor espera ' . ceil($seconds / 60) . ' minuto(s).'
            ], 429);
        }

        // Validation (sin límite de tamaño, solo tipo y dimensiones mínimas)
        $request->validate([
            'photo' => [
                'required',
                'image',
                'mimes:jpeg,png,jpg',
                'dimensions:min_width=50,min_height=50', // Solo mínimo, sin máximo
                'max:2048' // Límite de 2MB
            ],
        ], [
            'photo.required' => 'La foto es obligatoria.',
            'photo.image' => 'El archivo debe ser una imagen.',
            'photo.mimes' => 'Solo se permiten imágenes JPEG, PNG o JPG.',
            'photo.dimensions' => 'La imagen debe tener al menos 50x50 píxeles.',
            'photo.max' => 'La imagen no debe pesar más de 2MB.',
        ]);

        if ($request->hasFile('photo')) {
            $file = $request->file('photo');

            // Sanitize filename to prevent directory traversal
            $extension = $file->getClientOriginalExtension();
            $filename = Str::random(40) . '.' . $extension;

            // Store in public/signatures directory (backup)
            $path = $file->storeAs('signatures', $filename, 'public');

            // Read image and convert to base64 Data URL
            $imageData = file_get_contents($file->getRealPath());
            $base64 = base64_encode($imageData);
            $mimeType = $file->getMimeType();

            // Create Data URL (works everywhere: local, cloud, email)
            $dataUrl = "data:{$mimeType};base64,{$base64}";

            // Generate backup cloud URL (for reference)
            $cloudUrl = asset('storage/' . $path);

            // Save to database
            $signature = Signature::create([
                'user_id' => $request->user()->id,
                'filename' => $filename,
                'file_path' => $path,
                'cloud_url' => $dataUrl,  // Store base64 URL
                'file_size' => $file->getSize(),
                'mime_type' => $file->getMimeType(),
            ]);

            // Hit rate limiter
            RateLimiter::hit($key, 60);

            // Return the base64 Data URL (works without server running)
            return response()->json([
                'success' => true,
                'url' => $signature->cloud_url,  // Base64 Data URL
                'backup_url' => $cloudUrl,  // Server URL (only if server is running)
                'signature_id' => $signature->id
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'No se recibió ningún archivo.'
        ], 400);
    }
}
