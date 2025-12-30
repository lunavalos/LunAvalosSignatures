import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Lato', 'Poppins', ...defaultTheme.fontFamily.sans],
            },
            colors: {
                primary: '#193074',
                secondary: '#ffffff',
                text: '#313131',
                lightbg: '#d1d1d1',
            },
        },
    },

    plugins: [forms],
};
