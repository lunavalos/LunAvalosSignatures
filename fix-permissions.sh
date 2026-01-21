#!/bin/bash

# SCRIPT DE REPARACIÓN DE PERMISOS PARA LARAVEL EN HOSTINGER
# Copia y pega estos comandos UNO POR UNO en tu terminal SSH

echo "=== Paso 1: Verificar ubicación actual ==="
pwd
ls -la

echo ""
echo "=== Paso 2: Buscar la carpeta del proyecto ==="
# Busca dónde está la carpeta 'signatures' o 'app'
find ~ -name "signatures" -type d 2>/dev/null | head -5

echo ""
echo "=== Paso 3: Ir a la carpeta del proyecto ==="
# Ajusta esta ruta según lo que encontraste en el paso 2
# Ejemplo: cd ~/domains/signatures.lunavalos.com/signatures
# O: cd ~/public_html/../signatures

echo ""
echo "=== Paso 4: Dar permisos a storage y bootstrap/cache ==="
chmod -R 775 storage
chmod -R 775 bootstrap/cache

echo ""
echo "=== Paso 5: Verificar que el usuario web pueda escribir ==="
# En Hostinger, el usuario web suele ser 'nobody' o tu usuario
# Si los comandos anteriores no funcionan, prueba con 777 (menos seguro pero funcional):
# chmod -R 777 storage
# chmod -R 777 bootstrap/cache

echo ""
echo "=== Paso 6: Limpiar caché de Laravel ==="
php artisan config:clear
php artisan cache:clear
php artisan view:clear
php artisan route:clear

echo ""
echo "=== LISTO! Ahora intenta acceder a tu sitio ==="
