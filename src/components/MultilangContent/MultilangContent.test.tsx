import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MultilangContent from './MultilangContent';

describe('MultilangContent', () => {
  const mockContent = `
    {mlang en}This is content in English.{mlang}
    {mlang pt_br}Este é o conteúdo em Português.{mlang}
    {mlang es}Este es el contenido em Español.{mlang}
    {mlang}This is generic fallback content.{mlang}
  `;

  it('should render English content when currentLanguage is "en"', () => {
    render(<MultilangContent content={mockContent} currentLanguage="en" />);
    expect(screen.getByText('This is content in English.')).toBeInTheDocument();
 
    expect(screen.queryByText('Este é o conteúdo em Português.')).not.toBeInTheDocument();
  });

  it('should render Portuguese content when currentLanguage is "pt_br"', () => {
    render(<MultilangContent content={mockContent} currentLanguage="pt_br" />);
    expect(screen.getByText('Este é o conteúdo em Português.')).toBeInTheDocument();
    expect(screen.queryByText('This is content in English.')).not.toBeInTheDocument();
  });

  it('should render Spanish content when currentLanguage is "es"', () => {
    render(<MultilangContent content={mockContent} currentLanguage="es" />);

    expect(screen.getByText('Este es el contenido em Español.')).toBeInTheDocument();
  });

  it('should use fallbackLanguage if currentLanguage content is not found', () => {
    render(
      <MultilangContent
        content={mockContent}
        currentLanguage="fr"
        fallbackLanguage="pt_br"
      />,
    );
    expect(screen.getByText('Este é o conteúdo em Português.')).toBeInTheDocument();
    expect(screen.queryByText('This is content in English.')).not.toBeInTheDocument();
  });

  it('should fallback to "en" if currentLanguage and fallbackLanguage content are not found', () => {
    const contentWithoutEN = `
      {mlang pt_br}Conteúdo PT.{mlang}
      {mlang es}Contenido ES.{mlang}
      {mlang}Fallback genérico.{mlang}
    `;
    render(
      <MultilangContent
        content={contentWithoutEN}
        currentLanguage="fr"
        fallbackLanguage="de"
      />,
    );

    expect(screen.getByText('Fallback genérico.')).toBeInTheDocument();
    expect(screen.queryByText('Conteúdo PT.')).not.toBeInTheDocument();

    const contentWithEN = `
      {mlang en}English fallback.{mlang}
      {mlang pt_br}Conteúdo PT.{mlang}
    `;
    render(
      <MultilangContent
        content={contentWithEN}
        currentLanguage="fr"
        fallbackLanguage="de"
      />,
    );
    expect(screen.getByText('English fallback.')).toBeInTheDocument();
  });

  it('should fallback to "other" if no specific language or "en" is found', () => {
    const content = `
      {mlang pt_br}Conteúdo em PT.{mlang}
      {mlang}Generic content.{mlang}
    `;
    render(<MultilangContent content={content} currentLanguage="fr" />);  
    expect(screen.getByText('Generic content.')).toBeInTheDocument();
  });

  it('should render any available content if no specific language, fallback, or "other" is found', () => {
    const content = `{mlang sw}Swahili content.{mlang}`;
    render(<MultilangContent content={content} currentLanguage="fr" />);
    expect(screen.getByText('Swahili content.')).toBeInTheDocument();
  });

  it('should render nothing if content is empty', () => {
    const { container } = render(<MultilangContent content="" currentLanguage="en" />);
 
    expect(container).toBeEmptyDOMElement();
  });

  it('should render an available language if current, fallback, "en", and "other" are not found', () => {
    const emptyMlangContent = '{mlang es}Spanish only{mlang}';
    render(<MultilangContent content={emptyMlangContent} currentLanguage="fr" />);
 
    expect(screen.getByText('Spanish only')).toBeInTheDocument();
  });

  it('should correctly render HTML tags within the content', () => {
    const htmlContent = '{mlang en}<div><strong>Hello</strong> <em>World</em>!</div>{mlang}';
    render(<MultilangContent content={htmlContent} currentLanguage="en" />);

 
    expect(screen.getByText('Hello', { selector: 'strong' })).toBeInTheDocument();
    expect(screen.getByText('World', { selector: 'em' })).toBeInTheDocument();

 
    const renderedDiv = screen.getByText('Hello', { selector: 'strong' }).closest('div');
    expect(renderedDiv).toBeInTheDocument();
    expect(renderedDiv).toContainHTML('<strong>Hello</strong> <em>World</em>!');
  });

  it('should render the original raw string if no mlang tags are present', () => {
    const nonMlangContent = '<p>This is just a regular paragraph.</p>';
    render(<MultilangContent content={nonMlangContent} currentLanguage="en" />);
    expect(screen.getByText('This is just a regular paragraph.')).toBeInTheDocument();
  });
});