let translations = {};

export async function loadTranslations(locale) {
    const response = await fetch(`./translations/${locale}.json`);
    translations = await response.json();
}

export function getString(key) {
    return translations[key] || key;
}
