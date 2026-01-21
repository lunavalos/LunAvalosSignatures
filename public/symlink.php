<?php

/**
 * CONFIGURADOR DE FOTOS (Estructura Dividida)
 * Sube este archivo a su carpeta 'public_html'.
 */

// Rutas para Hostinger con carpetas separadas
$target = __DIR__ . '/../signatures/storage/app/public';
$shortcut = __DIR__ . '/storage';

echo "<h3>Configurador de Imágenes</h3>";

if (file_exists($shortcut)) {
    echo "<p style='color: orange;'>El enlace ya existe.</p>";
} else {
    if (symlink($target, $shortcut)) {
        echo "<p style='color: green;'>¡Éxito! Enlace simbólico creado correctamente.</p>";
    } else {
        echo "<p style='color: red;'>Error al crear el enlace. Verifica rutas.</p>";
    }
}
