<?php

/**
 * ASISTENTE DE DESPLIEGUE (Estructura Dividida) - VERSIÓN MEJORADA
 * Sube este archivo a su carpeta 'public_html'.
 */

// 1. Cargar el autoloader (Ajustado a carpeta signatures arriba)
require __DIR__ . '/../signatures/vendor/autoload.php';

// 2. Cargar el Bootstrap (Ajustado a carpeta signatures arriba)
$app = require_once __DIR__ . '/../signatures/bootstrap/app.php';

use Illuminate\Support\Facades\Artisan;
$kernel = $app->make(Illuminate\Contracts\Console\Kernel::class);
$kernel->bootstrap();

echo "<h2>Iniciando Despliegue...</h2>";
echo "<ul>";

try {
    // PASO 0: Limpiar caché ANTES de todo (crítico)
    echo "<li>Limpiando caché de configuración... ";
    Artisan::call('config:clear');
    Artisan::call('cache:clear');
    echo "<span style='color:green;'>OK</span></li>";

    // PASO 1: Verificar conexión a la base de datos
    echo "<li>Verificando conexión a base de datos... ";
    $pdo = DB::connection()->getPdo();
    echo "<span style='color:green;'>OK (Conectado)</span></li>";

    // PASO 2: Ejecutar migraciones
    echo "<li>Ejecutando migraciones... ";
    Artisan::call('migrate', ['--force' => true]);
    echo "<span style='color:green;'>OK</span></li>";

    // PASO 3: Ejecutar seeders
    echo "<li>Creando usuario administrador... ";
    Artisan::call('db:seed', ['--class' => 'AdminUserSeeder', '--force' => true]);
    echo "<span style='color:green;'>OK</span></li>";

    echo "</ul>";
    echo "<h3 style='color:green;'>¡DESPLIEGUE COMPLETADO!</h3>";
    echo "<p>Usuario admin creado. Credenciales: <b>admin</b> / <b>password</b></p>";
    echo "<p style='color:red;'><b>IMPORTANTE: Borra este archivo 'deploy.php' del servidor ahora mismo.</b></p>";

} catch (\Exception $e) {
    echo "</ul>";
    echo "<h3><span style='color:red;'>ERROR:</span></h3>";
    echo "<pre style='background:#f5f5f5; padding:15px; border:1px solid #ddd;'>" . $e->getMessage() . "</pre>";
    echo "<h4>Posibles soluciones:</h4>";
    echo "<ul>";
    echo "<li>Verifica que el archivo .env esté en la carpeta <b>/signatures/</b> (no en public_html)</li>";
    echo "<li>Confirma que los datos de la base de datos en el .env sean correctos</li>";
    echo "<li>Asegúrate de que la base de datos exista en tu panel de Hostinger</li>";
    echo "</ul>";
}
