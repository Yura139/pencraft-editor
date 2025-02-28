export class SelectionManager {
  private savedRange: Range | null = null;

  /**
   * Зберігає поточне виділення
   * @returns {Range | null} Збережений діапазон виділення
   */
  saveSelection(): Range | null {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      this.savedRange = selection.getRangeAt(0).cloneRange();
      return this.savedRange;
    }
    return null;
  }

  /**
   * Відновлює збережене виділення
   * @returns {boolean} Успішність відновлення виділення
   */
  restoreSelection(): boolean {
    if (this.savedRange) {
      const selection = window.getSelection();
      if (selection) {
        selection.removeAllRanges();
        selection.addRange(this.savedRange);
        return true;
      }
    }
    return false;
  }

  /**
   * Очищає збережене виділення
   */
  clearSelection(): void {
    this.savedRange = null;
  }

  /**
   * Перевіряє, чи знаходиться виділення в межах вказаного елемента
   * @param element HTML елемент для перевірки
   * @returns {boolean} Результат перевірки
   */
  isSelectionWithinElement(element: HTMLElement): boolean {
    const selection = window.getSelection();
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      return element.contains(range.commonAncestorContainer);
    }
    return false;
  }

  /**
   * Вставляє HTML контент в поточне виділення
   * @param html HTML контент для вставки
   * @param editorElement Елемент редактора
   */
  insertHTML(html: string, editorElement: HTMLElement): void {
    this.restoreSelection();
    const selection = window.getSelection();
    
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      
      if (this.isSelectionWithinElement(editorElement)) {
        const temp = document.createElement('div');
        temp.innerHTML = html;
        
        range.deleteContents();
        range.insertNode(temp.firstChild!);
        
        // Переміщуємо курсор в кінець вставленого контенту
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
      }
    }
  }

} 