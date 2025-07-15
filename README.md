\`react-multilang-moodle\`
==========================

![npm version](https://badge.fury.io/js/react-multilang-moodle.svg) ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)

A lightweight and efficient React library for rendering Moodle-formatted multilingual content. It simplifies the display of texts containing `{mlang}` tags in React applications, allowing you to control the viewing language and define fallback logic easily.

Ideal for integrating content from platforms like Moodle that utilize `{mlang}` tags, ensuring robust internationalization and flexibility for your React components.

**Key Features:**

*   Renders Moodle `{mlang}` content in multiple languages.
*   Supports current language and custom fallback languages.
*   Optimized design for easy integration into React projects.
*   Built with Vite and SWC for performance.

* * *

Installation
---------------

You can install the library using npm or yarn:

    npm install react-multilang-moodle
    # or
    yarn add react-multilang-moodle
    

* * *

How to Use
-------------

The library exports a `MultilangContent` component and a `parseMoodleMultilangContent` utility function.

### `MultilangContent` Component

This component is the easiest way to render multilingual content directly in your React application.

#### Props

*   **`content`** (`string`, **required**): The string containing the Moodle multilingual content with `{mlang}` tags.
*   **`currentLanguage`** (`string`, **required**): The code of the current language you wish to display (e.g., `"en"`, `"pt_br"`, `"es"`).
*   **`fallbackLanguage`** (`string`, optional): A language code to be used as a fallback if content for the `currentLanguage` is not found. If not provided, the default fallback logic (first `en`, then `other`, then any available language, then an empty string) will be applied.

#### Usage Example

    import React from 'react';
    import { MultilangContent } from 'react-multilang-moodle';
    
    const MyComponent = () => {
      const moodleText = `
        <p>{mlang en}Hello, <strong>world</strong>! This is in English.</p>{mlang}
        <p>{mlang pt_br}Olá, <strong>mundo</strong>! Este é em Português.</p>{mlang}
        <p>{mlang es}¡Hola, <strong>mundo</strong>! Esto es en Español.</p>{mlang}
        <p>{mlang}This is generic fallback content.</p>{mlang}
      `;
    
      const currentAppLanguage = 'pt_br'; // Get this from your i18n system (e.g., i18next.language)
    
      return (
        <div>
          <h1>Multilingual Content</h1>
          <MultilangContent
            content={moodleText}
            currentLanguage={currentAppLanguage}
            fallbackLanguage="en" // Optional: sets "en" as fallback
          />
    
          <h2>Content without {mlang} tags:</h2>
          <MultilangContent
            content="<p>This is a plain paragraph without any Moodle language tags.</p>"
            currentLanguage="en"
          />
        </div>
      );
    };
    
    export default MyComponent;
    

### `parseMoodleMultilangContent` Function

If you need to extract specific language content or all language content before rendering, you can use this utility function.

    import { parseMoodleMultilangContent } from 'react-multilang-moodle';
    
    const moodleText = `
      {mlang en}English text.{mlang}
      {mlang pt_br}Texto em português.{mlang}
      {mlang}Generic text.{mlang}
    `;
    
    // Extract content for 'en'
    const englishContent = parseMoodleMultilangContent(moodleText, 'en');
    console.log(englishContent); // Output: "English text."
    
    // Extract content for 'es' (doesn't exist, so it tries fallbacks)
    const spanishContent = parseMoodleMultilangContent(moodleText, 'es');
    console.log(spanishContent); // Output: "Generic text." (if "en" isn't the primary fallback and "generic" is found)
    
    // To get all parsed contents:
    const allParsedContent = parseMoodleMultilangContent(moodleText);
    console.log(allParsedContent);
    /* Output (example):
    {
      en: "English text.",
      pt_br: "Texto em português.",
      other: "Generic text."
    }
    */
    

* * *

Development
---------------

To set up the development environment for the library:

1.  **Clone the repository:**
    
        git clone https://github.com/your-username/react-multilang-moodle.git
        cd react-multilang-moodle
        
    
2.  **Install dependencies:**
    
        npm install
        
    
3.  **Run tests:**
    
        npm test
        
    
4.  **Build the library:**
    
        npm run build
        
    
    The compiled files will be in the `dist/` folder.
    

* * *
Integration Tips with [react-i18next](https://react.i18next.com/)
-----------------------------------------------------------------

For developers using the popular `react-i18next` library to manage their application's internationalization, integrating `react-multilang-moodle` is quite intuitive. However, there's an important point to consider when extracting the **fallback** language from `i18next`.

### Pay Attention to `i18n.options.fallbackLng`

The `i18n.options.fallbackLng` property from `i18next` can have different types of values:

*   A **string** (e.g., `'en'`)
*   An **array of strings** (e.g., `['en', 'es']`)
*   `false` (if no fallback is defined)
*   `undefined`

To ensure you pass a `fallbackLanguage` value (which should be a string) correctly to the `<MultilangContent />` component or to the `parseMoodleMultilangContent` function, it's crucial to handle it safely. Otherwise, attempting to call `.toLowerCase()` directly on an array or `false` will result in an error.

### Recommended Usage Example with `useTranslation`:

This snippet demonstrates how to safely extract and process the current and fallback languages from `react-i18next` for use with your library:

    
    import React from 'react';
    import { useTranslation } from 'react-i18next';
    import { MultilangContent, parseMoodleMultilangContent } from 'react-multilang-moodle';
    
    const MyComponent = ({ moodleSummaryContent }) => {
      const { i18n } = useTranslation();
      const currentLang = i18n.language; // E.g., 'pt-BR', 'en-US'
    
      // --- Safe handling of fallbackLng ---
      let fallbackLang = '';
      const i18nFallback = i18n.options.fallbackLng;
    
      if (Array.isArray(i18nFallback)) {
        // If it's an array, take the first fallback language
        fallbackLang = i18nFallback[0] || ''; 
      } else if (typeof i18nFallback === 'string') {
        // If it's a string
        fallbackLang = i18nFallback;
      }
      // If it's false or undefined, fallbackLang remains an empty string, which is a safe fallback for your library.
      // Remember that your library internally already has fallbacks to 'en' and 'other' if the provided 'fallbackLanguage' has no content.
      // --- End of safe handling ---
    
      return (
        <div>
          <h3>Multilingual Content (with HTML)</h3>
          <MultilangContent
            content={moodleSummaryContent}
            currentLanguage={currentLang}
            fallbackLanguage={fallbackLang} // Pass the processed fallback here
          />
    
          <h3>Card Description (plain and truncated text)</h3>
          {(() => { // We use an IIFE to encapsulate the parsing and truncation logic
            const parsedContents = parseMoodleMultilangContent(moodleSummaryContent);
            
            let localizedHtml = '';
            const normalizedCurrentLang = currentLang.toLowerCase(); // Normalize current language
            const normalizedFallbackLang = fallbackLang.toLowerCase(); // Normalize fallback language
    
            // Content selection logic (mirrors the component's internal logic)
            if (parsedContents[normalizedCurrentLang]) {
              localizedHtml = parsedContents[normalizedCurrentLang];
            } else if (parsedContents[normalizedFallbackLang]) {
              localizedHtml = parsedContents[normalizedFallbackLang];
            } else if (parsedContents['en']) {
              localizedHtml = parsedContents['en'];
            } else if (parsedContents['other']) {
              localizedHtml = parsedContents['other'];
            } else {
              // Final fallback: if no {mlang} tags are present, use the original content
              const availableLangs = Object.keys(parsedContents);
              if (availableLangs.length > 0) {
                localizedHtml = parsedContents[availableLangs[0]];
              } else {
                localizedHtml = moodleSummaryContent; // If NO {mlang} tags are found at all
              }
            }
    
            // Simple function to strip HTML tags
            const stripHtml = (html) => {
              const doc = new DOMParser().parseFromString(html, 'text/html');
              return doc.body.textContent || "";
            };
    
            const rawText = stripHtml(localizedHtml);
            const MAX_LENGTH = 240; // Example character limit
            const truncatedText = rawText.length > MAX_LENGTH
              ? rawText.substring(0, MAX_LENGTH) + '...'
              : rawText;
    
            return <p>{truncatedText}</p>;
          })()}
        </div>
      );
    };
    
    export default MyComponent;
    

By following this approach, you'll ensure a smooth and robust integration between `react-multilang-moodle` and your internationalization system.
* * *

Contributing
---------------

Contributions are welcome! Feel free to open [issues](https://github.com/danalencar/react-multilang-moodle/issues) or [pull requests](https://github.com/danalencar/react-multilang-moodle/pulls).

* * *


License
----------

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit) file for more details.
