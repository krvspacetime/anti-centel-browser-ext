/**
 * Utility functions for DOM manipulation
 */

import { StyleSettings } from '../types/settings';

/**
 * Find an element by its data-testid attribute
 * @param testId The data-testid value to search for
 * @returns The element or null if not found
 */
export function findElementByTestId(testId: string): HTMLElement | null {
  return document.querySelector(`[data-testid="${testId}"]`);
}

/**
 * Create and append a style element to the document head
 * @param css The CSS content to add
 * @returns The created style element
 */
export function addStyleToDocument(css: string): HTMLStyleElement {
  const styleElement = document.createElement('style');
  styleElement.textContent = css;
  document.head.appendChild(styleElement);
  return styleElement;
}

/**
 * Add global styles for tweet visibility and animations
 * @param styleSettings The current style settings
 */
export function addGlobalStyles(styleSettings: StyleSettings): void {
  // Remove any existing style element
  const existingStyle = document.getElementById('anti-centel-styles');
  if (existingStyle) {
    existingStyle.remove();
  }

  // Create new style element
  const styleTag = document.createElement('style');
  styleTag.id = 'anti-centel-styles';
  
  // Define CSS based on style settings
  const isDarkTheme = styleSettings.theme === 'dark';
  
  styleTag.textContent = `
    .tweet-hidden {
      height: 0;
      overflow: hidden;
      transition: height 0.3s ease;
    }
    
    .collapse-indicator {
      background-color: ${isDarkTheme ? 'transparent' : 'rgb(215 222 222)'};
      color: ${isDarkTheme ? '#FFFFFF' : '#000000'};
      cursor: pointer;
      padding: 4px;
      font-size: 13px;
    }
    
    .watchlist-button-container {
      display: flex;
      gap: 4px;
      margin-top: 4px;
    }
    
    .watchlist-button {
      background: transparent;
      border: 1px solid ${isDarkTheme ? '#FFFFFF' : '#000000'};
      border-radius: 4px;
      color: ${isDarkTheme ? '#FFFFFF' : '#000000'};
      cursor: pointer;
      font-size: 12px;
      padding: 2px 6px;
    }
    
    .watchlist-button:hover {
      background: ${isDarkTheme ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'};
    }
    
    .tweet-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 2;
    }
  `;
  
  // Add the style tag to the document head
  document.head.appendChild(styleTag);
}

/**
 * Create a new element with text content
 * @param tag The HTML tag to create
 * @param text The text content for the element
 * @param className Optional class name for the element
 * @returns The created element
 */
export function createElement<K extends keyof HTMLElementTagNameMap>(
  tag: K,
  text: string,
  className?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tag);
  element.textContent = text;
  if (className) {
    element.className = className;
  }
  return element;
}

/**
 * Set inline styles on an element
 * @param element The element to style
 * @param styles Object containing style properties and values
 */
export function setStyles(
  element: HTMLElement,
  styles: Record<string, string>
): void {
  Object.entries(styles).forEach(([property, value]) => {
    element.style[property as any] = value;
  });
}
