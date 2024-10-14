import type { Config } from 'tailwindcss';

const config: Config = {
    content: [
        './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
        './src/components/**/*.{js,ts,jsx,tsx,mdx}',
        './src/app/**/*.{js,ts,jsx,tsx,mdx}',
        './src/containers/**/*.{tsx,ts}',
    ],
    theme: {
        extend: {
            colors: {
                night: '#111111',
                'eerie-black': '#1a1a1a',
                'platinum': '#d8dbe2',
                'powerder-blue': '#a9bcd0',
            },
        },
    },
    plugins: [],
    important: true,
};
export default config;
