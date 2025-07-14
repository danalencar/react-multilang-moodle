import { describe, it, expect } from 'vitest';
import { parseMoodleMultilangContent } from './parser';

describe('parseMoodleMultilangContent', () => {
  it('should extract content for a single language block', () => {
 
    const content = '<p>{mlang en}Hello World{mlang}</p>';
    const result = parseMoodleMultilangContent(content);
    expect(result).toEqual({ en: 'Hello World' }); 
  });

  it('should extract content for multiple language blocks', () => {
    const content =
      '<p>{mlang en}Hello{mlang}</p>\r\n<p>{mlang pt_br}Olá{mlang}</p>';
    const result = parseMoodleMultilangContent(content);
     expect(result).toEqual({ en: 'Hello', pt_br: 'Olá' });
  });

  it('should handle content with leading/trailing newlines and spaces inside tags', () => {
     
    const content =
      '<p>{mlang en}\r\n  Content in English  \r\n{mlang}</p>\n{mlang es}  Contenido en Español  {mlang}';
    const result = parseMoodleMultilangContent(content);
    expect(result).toEqual({
      en: 'Content in English',  
      es: 'Contenido en Español',  
    });
  });

  it('should correctly parse the "other" language block', () => {
     const content =
      '{mlang pt_br}Olá{mlang}{mlang}<p>Generic content</p>{mlang}'; 
    const result = parseMoodleMultilangContent(content);
    expect(result).toEqual({
      pt_br: 'Olá',  
      other: '<p>Generic content</p>', 
    });
  });

  it('should prioritize the last occurrence of a language block if duplicated', () => {
    const content =
      '{mlang en}First English{mlang}{mlang en}Second English{mlang}';
    const result = parseMoodleMultilangContent(content);
 
    expect(result).toEqual({ en: 'Second English' });
  });

  it('should handle complex HTML content within language blocks', () => {
    const content = `
      {mlang en}<br />This engaging and age-appropriate course introduces K-12 students to the fundamentals of cryptocurrency, blockchain technology, and digital finance. Through interactive lessons, games, and real-world examples, students will explore:<br /><strong>Basic Concepts: </strong>What is money? How do cryptocurrencies like Bitcoin work?<br /><strong>Blockchain Basics: </strong>Understanding decentralized ledgers and smart contracts.<br /><strong>Safety &amp; Responsibility: </strong>How to stay secure online and avoid scams.<br /><strong>Future of Finance: </strong>Exploring Web3, NFTs, and the evolving digital economy.</p>
      <p>Designed for different grade levels, the course promotes critical thinking, financial literacy, and tech awareness in a fun, easy-to-understand way. No prior experience required!</p>
      <p>Perfect for schools, homeschooling, and after-school programs!<br />{mlang}
      {mlang pt_br}<br />Este curso envolvente e adequado à idade introduz os alunos do K-12 aos fundamentos da criptomoeda, da tecnologia blockchain e das finanças digitais. Através de aulas interativas, jogos e exemplos do mundo real, os alunos explorarão:<br /><strong>Conceitos Básicos:</strong> O que é dinheiro? Como funcionam criptomoedas como o Bitcoin?<br /><strong>Fundamentos do Blockchain:</strong> Entender os livros-razão descentralizados e os contratos inteligentes.<br /><strong>Segurança e Responsabilidade: </strong>Como se manter seguro online e evitar golpes.<br /><strong>Futuro das Finanças: </strong>Explorar a Web3, NFTs e a economia digital em evolução.</p>
      <p>Projetado para diferentes níveis de ensino, o curso promove o pensamento crítico, a educação financeira e a consciência tecnológica de uma forma divertida e fácil de entender. Nenhuma experiência prévia é necessária!</p>
      <p>Perfeito para escolas, ensino doméstico e programas extracurriculares!<br />{mlang}
    `;
    const result = parseMoodleMultilangContent(content);

    expect(result).toHaveProperty('en');
    expect(result).toHaveProperty('pt_br');
     expect(result.en).toContain('This engaging and age-appropriate course introduces K-12 students to the fundamentals of cryptocurrency, blockchain technology, and digital finance.');
    expect(result.pt_br).toContain('Este curso envolvente e adequado à idade introduz os alunos do K-12 aos fundamentos da criptomoeda, da tecnologia blockchain e das finanças digitais.');
    expect(result.en).not.toContain('{mlang}');  
    expect(result.pt_br).not.toContain('{mlang}');
  });

  it('should return an empty object for empty content string', () => {
    const content = '';
    const result = parseMoodleMultilangContent(content);
    expect(result).toEqual({});
  });

  it('should return an empty object for content without mlang tags', () => {
     const content = '<p>This is some regular content.</p>';
    const result = parseMoodleMultilangContent(content);
    expect(result).toEqual({});
  });

  it('should handle content with only mlang open/close tags but no actual text', () => {
    const content = '{mlang en}{mlang}{mlang pt_br}{mlang}';
    const result = parseMoodleMultilangContent(content);
     expect(result).toEqual({ en: '', pt_br: '' });
  });

  it('should handle content where mlang tags are not closed properly (edge case - behavior defined by regex)', () => {
 
    const content = '{mlang en}Content not closed';
    const result = parseMoodleMultilangContent(content);
    expect(result).toEqual({});  
  });
});