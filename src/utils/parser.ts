/**
* Parses a Moodle content string with {mlang} tags and extracts the content by language.
* @param content The raw Moodle content string.
* @returns An object where the keys are the language codes (e.g., 'en', 'pt_br', 'other') and the values are the corresponding HTML content strings.
*/
export function parseMoodleMultilangContent(content: string): Record<string, string> {
  const result: Record<string, string> = {};

// Regex to find opening {mlang <language>} or {mlang} blocks
// and capture the content up to the matching closing {mlang}.
// The 's' (dotAll) flag allows the '.' (dot) to match newline characters.
// The 'g' (global) flag is for finding all occurrences.
// The regex has been adjusted to capture the content *between* the opening and closing tags.

// Regex Explanation:
// \{mlang\s*(\w{2}(?:_\w{2})?)?\} -> Matches the opening tag, optionally capturing the language (group 1).
// (.*?) -> Captures the content non-greedily (anything, including newlines, group 2).
// \{\s*mlang\s*\} -> Matches the closing {mlang} tag.
  const regex = /\{mlang\s*(\w{2}(?:_\w{2})?)?\}(.*?)\{\s*mlang\s*\}/gs;

  let match;

  while ((match = regex.exec(content)) !== null) {
    const lang = match[1] ? match[1].toLowerCase() : 'other'; // Captures the language or 'other'
    const blockContent = match[2].trim(); // Content between tags. Trim to remove extra spaces/line breaks.

// If content already exists for this language, the new one overwrites it (desired behavior for duplicates).
    result[lang] = blockContent;
  }

  return result;
}