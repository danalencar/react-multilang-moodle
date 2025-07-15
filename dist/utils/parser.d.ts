/**
* Parses a Moodle content string with {mlang} tags and extracts the content by language.
* @param content The raw Moodle content string.
* @returns An object where the keys are the language codes (e.g., 'en', 'pt_br', 'other') and the values are the corresponding HTML content strings.
*/
export declare function parseMoodleMultilangContent(content: string): Record<string, string>;
