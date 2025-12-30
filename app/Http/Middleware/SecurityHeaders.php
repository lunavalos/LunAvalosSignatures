<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class SecurityHeaders
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $response = $next($request);

        // Prevent clickjacking
        $response->headers->set('X-Frame-Options', 'SAMEORIGIN');

        // Prevent MIME type sniffing
        $response->headers->set('X-Content-Type-Options', 'nosniff');

        // XSS Protection (legacy browsers)
        $response->headers->set('X-XSS-Protection', '1; mode=block');

        // Referrer Policy
        $response->headers->set('Referrer-Policy', 'strict-origin-when-cross-origin');

        // Content Security Policy - Different for dev and production
        if (app()->environment('local', 'development')) {
            // Permissive CSP for development (Vite needs unsafe-inline/eval)
            $csp = implode('; ', [
                "default-src 'self'",
                "script-src 'self' 'unsafe-inline' 'unsafe-eval' http://localhost:* http://[::1]:* ws://localhost:* ws://[::1]:*",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net",
                "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net data:",
                "img-src 'self' data: https: blob: http://localhost:* http://[::1]:*",
                "connect-src 'self' http://localhost:* http://[::1]:* ws://localhost:* ws://[::1]:*",
                "frame-ancestors 'self'",
            ]);
        } else {
            // Strict CSP for production
            $csp = implode('; ', [
                "default-src 'self'",
                "script-src 'self'",
                "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com https://fonts.bunny.net",
                "font-src 'self' https://fonts.gstatic.com https://fonts.bunny.net data:",
                "img-src 'self' data: https: blob:",
                "connect-src 'self'",
                "frame-ancestors 'self'",
            ]);
        }
        $response->headers->set('Content-Security-Policy', $csp);

        // HSTS (only in production with HTTPS)
        if (app()->environment('production') && $request->secure()) {
            $response->headers->set('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
        }

        // Permissions Policy
        $response->headers->set('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');

        return $response;
    }
}
