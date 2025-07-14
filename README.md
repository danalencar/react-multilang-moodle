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

Contributing
---------------

Contributions are welcome! Feel free to open [issues](https://github.com/danalencar/react-multilang-moodle/issues) or [pull requests](https://github.com/danalencar/react-multilang-moodle/pulls).

* * *


License
----------

This project is licensed under the MIT License. See the [LICENSE](https://opensource.org/license/mit) file for more details.
