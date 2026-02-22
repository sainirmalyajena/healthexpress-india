import type { Locale } from './i18n-config'

const dictionaries = {
    en: () => import('./dictionaries/en.json').then((module) => module.default),
    hi: () => import('./dictionaries/hi.json').then((module) => module.default),
}

/**
 * Deep merges two objects.
 * Target is the base (fallback), source is the translated object.
 */
function deepMerge(target: any, source: any): any {
    const output = { ...target };
    if (source && typeof source === 'object' && !Array.isArray(source)) {
        Object.keys(source).forEach(key => {
            if (source[key] && typeof source[key] === 'object' && !Array.isArray(source[key])) {
                if (!(key in target)) {
                    output[key] = source[key];
                } else {
                    output[key] = deepMerge(target[key], source[key]);
                }
            } else {
                // Only overwrite if source has a truthy value (or it's explicitly defined)
                if (source[key] !== undefined && source[key] !== '') {
                    output[key] = source[key];
                }
            }
        });
    }
    return output;
}

export const getDictionary = async (locale: Locale) => {
    const enDict = await dictionaries.en();
    if (locale === 'en') return enDict;

    const targetDict = await dictionaries[locale]();
    // Return target merged with English as fallback
    return deepMerge(enDict, targetDict);
}
