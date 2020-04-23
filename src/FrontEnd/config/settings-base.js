// Although build process uses this configuration file, the server-side deployment operates on environment variables only.

module.exports = {
    /** Used in development mode only, production uses process.env.ISC_API_URL. */
    apiUrl: "http://commerce.local.com", // HTTP URL is recommended to ensure all ISC cookies pass through.
};
