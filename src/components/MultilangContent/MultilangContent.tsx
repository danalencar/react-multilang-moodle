import { parseMoodleMultilangContent } from '../../utils/parser';  

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
const MultilangContent: React.FC<MultilangContentProps> = ({
  content,
  currentLanguage,
  fallbackLanguage,
}) => {
  // 1. Call the parsing function to extract the content by language
  const parsedContent = parseMoodleMultilangContent(content);

  let contentToRender = '';
  const normalizedCurrentLang = currentLanguage.toLowerCase();
  const normalizedFallbackLang = fallbackLanguage?.toLowerCase();

  // Check if the parser returned any mlang content
  const hasMlangContent = Object.keys(parsedContent).length > 0;

  if (!hasMlangContent) {
    // If there are no mlang tags in the content, render the original content as is.
    // This is useful for fields that don't use the {mlang} format but still contain HTML.
    contentToRender = content;
  } else if (parsedContent[normalizedCurrentLang]) {
    // Content found for current language
    contentToRender = parsedContent[normalizedCurrentLang];
  } else if (normalizedFallbackLang && parsedContent[normalizedFallbackLang]) {
    // Content found for the specified fallback language
    contentToRender = parsedContent[normalizedFallbackLang];
  } else if (parsedContent['en']) {
   // Fallback to 'en' if there is no content for the current or specified fallback language
    contentToRender = parsedContent['en'];
  } else if (parsedContent['other']) {
    // Last fallback: content marked as 'other'
    contentToRender = parsedContent['other'];
  } else {
    // If none of the above is found, try to grab any available content as a last resort.
    // This ensures that something is rendered if there is only one language not covered by the fallbacks.
    const availableLanguages = Object.keys(parsedContent);
    if (availableLanguages.length > 0) {
      contentToRender = parsedContent[availableLanguages[0]];
    }
  }

  // If there is no content to render (after all fallback checks),
  // return null so that the component doesn't take up space in the DOM.
  if (!contentToRender) {
    return null;
  }

  // Render HTML using dangerouslySetInnerHTML
  // WARNING: Use dangerouslySetInnerHTML ONLY if you are sure of the origin and security of the HTML.
  // Content coming from Moodle may contain malicious scripts if not sanitized.
  return (
    <div
      dangerouslySetInnerHTML={{ __html: contentToRender }}
  // Add a key or id if this component is used in lists for optimization,
  // although for a single direct use it is not strictly necessary.
    />
  );
};

export default MultilangContent;