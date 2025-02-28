/**
 * Форматує HTML-код для кращої читабельності
 * @param html Неформатований HTML-код
 * @returns Форматований HTML-код
 */
export function prettifyHTML(html: string): string {
  // Видаляємо зайві пробіли
  let result = html.trim();
  
  // Додаємо переноси рядків між тегами
  result = result.replace(/></g, '>\n<');
  
  // Розділяємо на рядки і видаляємо порожні
  const lines = result.split('\n').filter(line => line.trim());

  // Теги, які не потребують відступів
  const inlineTags = ["b", "i", "u", "strike"]

  // Додаємо відступи
  let indent = 0;
  const indentedLines = lines.map(line => {
    line = line.trim();
    
    // Отримуємо ім'я тегу
    const tagMatch = line.match(/<\/?([a-zA-Z0-9]+)/);
    const tagName = tagMatch ? tagMatch[1].toLowerCase() : '';
    
    // Перевіряємо, чи це inline тег
    const isInlineTag = inlineTags.includes(tagName);
    
    // Зменшуємо відступ для закриваючих тегів (не inline)
    if (line.startsWith('</') && !isInlineTag) {
      indent = Math.max(0, indent - 1);
    }
    
    // Форматуємо рядок з відступом, якщо це не inline тег
    const formattedLine = !isInlineTag 
      ? '  '.repeat(indent) + line 
      : line;
    
    // Збільшуємо відступ для відкриваючих тегів (не inline і не самозакриваючихся)
    if (!isInlineTag && line.startsWith('<') && !line.startsWith('</') && !line.endsWith('/>')) {
      // Перевіряємо, чи тег не закривається в тому ж рядку
      const hasClosingTag = line.match(/<[^>]+>.*<\/[^>]+>/);
      if (!hasClosingTag) {
        indent++;
      }
    }
    
    return formattedLine;
  });
  
  // Об'єднуємо рядки з переносом
  result = indentedLines.join('\n');
  
  // Видаляємо зайві пробіли перед спеціальними символами HTML
  result = result.replace(/\s+&nbsp;/g, '&nbsp;');
  
  return result;
}

/**
 * Мінімізує HTML-код, видаляючи зайві пробіли та переноси рядків
 * @param html HTML-код для мінімізації
 * @returns Мінімізований HTML-код
 */
export function minifyHTML(html: string): string {
  // Видаляємо коментарі
  let minified = html.replace(/<!--[\s\S]*?-->/g, '');
  
  // Видаляємо зайві пробіли між тегами
  minified = minified.replace(/>\s+</g, '><');
  
  // Видаляємо зайві пробіли всередині тегів
  minified = minified.replace(/\s{2,}/g, ' ');
  
  // Видаляємо пробіли навколо атрибутів
  minified = minified.replace(/\s*=\s*/g, '=');
  
  // Видаляємо пробіли на початку і в кінці
  minified = minified.trim();
  
  return minified;
} 