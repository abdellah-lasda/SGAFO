import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
    ],

    theme: {
        extend: {
            colors: {
                ofppt: {
                    50: '#f0f7ff',
                    100: '#e0f0fe',
                    200: '#b9e0fe',
                    300: '#7cc7fd',
                    400: '#36abfa',
                    500: '#0b90e6',
                    600: '#0070c0', // Bleu OFPPT
                    700: '#015c9e',
                    800: '#064e83',
                    900: '#0a426e',
                },
            },
            fontFamily: {
                sans: ['Inter', ...defaultTheme.fontFamily.sans],
            },
        },
    },

    plugins: [forms],
};
