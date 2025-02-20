export const exportToHTML = (content: string): string => {
  return content;
};

export const exportToText = (content: string): string => {
  const temp = document.createElement('div');
  temp.innerHTML = content;
  return temp.textContent || temp.innerText || '';
};

export const exportToMarkdown = (content: string): string => {
  const temp = document.createElement('div');
  temp.innerHTML = content;
  
  let markdown = '';
  
  const processNode = (node: Node): string => {
    if (node.nodeType === Node.TEXT_NODE) {
      return node.textContent || '';
    }
    
    const element = node as HTMLElement;
    let result = '';
    
    switch (element.nodeName) {
      case 'P':
        result = processChildren(element) + '\n\n';
        break;
      case 'STRONG':
      case 'B':
        result = `**${processChildren(element)}**`;
        break;
      case 'EM':
      case 'I':
        result = `*${processChildren(element)}*`;
        break;
      case 'A':
        result = `[${processChildren(element)}](${element.getAttribute('href')})`;
        break;
      case 'IMG':
        result = `![${element.getAttribute('alt') || ''}](${element.getAttribute('src')})`;
        break;
      case 'TABLE':
        result = processTable(element);
        break;
      default:
        result = processChildren(element);
    }
    
    return result;
  };
  
  const processChildren = (element: HTMLElement): string => {
    return Array.from(element.childNodes)
      .map(node => processNode(node))
      .join('');
  };
  
  const processTable = (table: HTMLElement): string => {
    let result = '\n';
    const rows = table.querySelectorAll('tr');
    
    // Обробка рядків
    rows.forEach((row, rowIndex) => {
      const cells = row.querySelectorAll('td, th');
      
      // Додаємо вміст комірок
      cells.forEach((cell, cellIndex) => {
        result += `| ${cell.textContent?.trim() || ''} `;
      });
      result += '|\n';
      
      // Додаємо роздільник після першого рядка
      if (rowIndex === 0) {
        cells.forEach(() => {
          result += '| --- ';
        });
        result += '|\n';
      }
    });
    
    return result + '\n';
  };
  
  markdown = processChildren(temp);
  return markdown.trim();
}; 