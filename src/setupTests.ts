import '@testing-library/jest-dom';

// Додаємо кастомний метод для пошуку за класом
declare global {
  namespace jest {
    interface Matchers<R> {
      toHaveProperty: <E = any>(propertyPath: string | readonly any[], value?: E) => R;
    }
  }
}

expect.extend({
  toHaveProperty(received: any, property: string, value: any) {
    const pass = received[property] === value;
    return {
      pass,
      message: () =>
        `expected ${received} to have property "${property}" with value "${value}"`,
    };
  },
});

// Мокаємо document.execCommand
document.execCommand = jest.fn();

// Додаємо метод для пошуку за класом
import { screen } from '@testing-library/react';
import { Screen } from '@testing-library/dom';

const originalScreen = screen as Screen & {
  getByClassName: (className: string) => HTMLElement;
};

originalScreen.getByClassName = (className: string): HTMLElement => {
  const element = document.querySelector(`.${className}`);
  if (!element) {
    throw new Error(`Unable to find element with class: ${className}`);
  }
  return element as HTMLElement;
}; 