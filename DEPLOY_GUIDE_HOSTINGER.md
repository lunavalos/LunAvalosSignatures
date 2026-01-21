# Guía de Despliegue en Hostinger (public_html)

Para desplegar el proyecto moviendo la parte pública a `public_html` mientras mantienes el núcleo del sistema seguro en una carpeta privada, sigue estos pasos:

### 1. Preparación Local
Antes de subir nada, asegúrate de compilar los archivos de React:
```bash
npm run build
```

### 2. Estructura de Carpetas en el Servidor
Tu servidor debe quedar así:
```
/home/u256539358/ (Directorio raíz de tu cuenta)
├── signatures/      <-- Sube aquí TODO el proyecto (excepto la carpeta public)
└── public_html/     <-- Sube aquí el CONTENIDO de la carpeta public
```

### 3. Modificar `public_html/index.php`
Una vez que hayas movido el contenido de `public/` a `public_html/`, edita el archivo `public_html/index.php` y cambia las líneas para que apunten a la carpeta `signatures`:

```php
// Línea 9 - Mantenimiento
if (file_exists($maintenance = __DIR__.'/../signatures/storage/framework/maintenance.php')) {
    require $maintenance;
}

// Línea 14 - Autoload
require __DIR__.'/../signatures/vendor/autoload.php';

// Línea 18 - Bootstrap
$app = require_once __DIR__.'/../signatures/bootstrap/app.php';
```

### 4. Configurar el archivo `.env` en el servidor
En `/home/u256539358/signatures/.env`, asegúrate de cambiar:
```env
APP_ENV=production
APP_DEBUG=false
APP_URL=https://tu-dominio.com

# Si usas MySQL en Hostinger:
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=u256539358_nombre_bd
DB_USERNAME=u256539358_usuario_bd
DB_PASSWORD=tu_password_seguro
```

### 5. Crear el enlace simbólico para imágenes
Como las imágenes se guardan en `signatures/storage/app/public`, pero se sirven desde `public_html/storage`, necesitas crear un enlace simbólico. Si el SSH no te funciona, crea un archivo llamado `link.php` en `public_html/` con este código y ejecútalo desde tu navegador (`tu-dominio.com/link.php`):

```php
<?php
$target = '/home/u256539358/signatures/storage/app/public';
$shortcut = '/home/u256539358/public_html/storage';
symlink($target, $shortcut);
echo "Enlace creado correctamente";
```

### 6. Optimización (Vía SSH si logras entrar)
Si logras habilitar el SSH como te indiqué antes:
```bash
cd signatures
php artisan config:cache
php artisan route:cache
php artisan view:cache
```

### Notas Importantes
- **Carpeta Vendor**: No olvides subir la carpeta `vendor/`. Si no puedes subir tantos archivos, intenta correr `composer install --no-dev` por SSH.
- **Node Modules**: NO subas la carpeta `node_modules/` al servidor.
- **Permisos**: Asegúrate de que las carpetas `storage/` y `bootstrap/cache/` dentro de `signatures/` tengan permisos de escritura (chmod 775 o 777).
