import '@testing-library/jest-dom';

// Мокаємо document.execCommand
document.execCommand = jest.fn();