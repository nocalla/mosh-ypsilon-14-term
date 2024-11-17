// sourced from: https://centus.com/blog/javascript-localization
// This object will store our translations
let translations = {};

// This function fetches the translation file
async function loadTranslations(locale) {
    try {
        const translations = await import(`./lang/${locale}.js`);
        return translations.default;
    } catch (error) {
        console.error('Error loading translation file:', error);
        const defaultTranslations = await import('./lang/en.js');
        return defaultTranslations.default;
    }
}

async function getString(str_key) {

}

export { loadTranslations, getString }
