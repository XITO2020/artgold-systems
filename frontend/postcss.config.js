/** @type {import('postcss-load-config').Config} */
module.exports = {
  plugins: {
    // IMPORTANT : un seul plugin Tailwind, le bon, pour v4
    '@tailwindcss/postcss': {},
    // Optionnels (ok si tu en as besoin)
    autoprefixer: {},
    ...(process.env.NODE_ENV === 'production' ? { cssnano: {} } : {}),
  },
};
