/**
* Props for the MultilangContent component.
*/
interface MultilangContentProps {
    /**
  * The raw content string coming from Moodle, containing the {mlang} tags.
  * Ex: "<p>{mlang en}Hello{mlang}</p><p>{mlang pt_br}Hello{mlang}</p>"
  */
    content: string;
    /**
    * The user's current language, usually from an i18n setting (e.g., 'en', 'pt_br', 'es').
    */
    currentLanguage: string;
    /**
    * Optional fallback language to use if 'currentLanguage' has no content available.
    * If not provided and 'currentLanguage' has no content, 'en' will be used as the default fallback.
    */
    fallbackLanguage?: string;
}
/**
* React component that renders multilingual content formatted with Moodle's {mlang} tags.
* It selects content based on the user's current language, with fallback support.
*/
declare const MultilangContent: React.FC<MultilangContentProps>;
export default MultilangContent;
