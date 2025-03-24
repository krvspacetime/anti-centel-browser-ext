/**
 * Service for handling Chrome storage operations
 */

import { StyleSettings, DEFAULT_STYLE_SETTINGS } from '../types/settings';
import { TargetHandle } from '../types/targets';

/**
 * Load style settings from Chrome storage
 * @returns Promise with the style settings
 */
export async function loadStyleSettings(): Promise<StyleSettings> {
  return new Promise((resolve) => {
    chrome.storage.sync.get("styleSettings", (data) => {
      let settings = data.styleSettings || {};
      
      // Ensure all required properties exist by merging with defaults
      settings = ensureStyleSettingsProperties(settings);
      
      resolve(settings as StyleSettings);
    });
  });
}

/**
 * Save style settings to Chrome storage
 * @param settings The style settings to save
 * @returns Promise that resolves when the settings are saved
 */
export function saveStyleSettings(settings: StyleSettings): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ styleSettings: settings }, () => {
      console.log("Updated styleSettings in storage:", settings);
      resolve();
    });
  });
}

/**
 * Load target handles from Chrome storage
 * @returns Promise with the target handles
 */
export async function loadTargetHandles(): Promise<TargetHandle[]> {
  return new Promise((resolve) => {
    chrome.storage.sync.get("targetHandles", (data) => {
      const targetHandles = data.targetHandles || [];
      resolve(targetHandles);
    });
  });
}

/**
 * Save target handles to Chrome storage
 * @param targetHandles The target handles to save
 * @returns Promise that resolves when the handles are saved
 */
export function saveTargetHandles(targetHandles: TargetHandle[]): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.sync.set({ targetHandles }, () => {
      console.log("Updated targetHandles in storage:", targetHandles);
      resolve();
    });
  });
}

/**
 * Ensure all required properties exist in the style settings
 * @param settings Partial style settings
 * @returns Complete style settings with all properties
 */
function ensureStyleSettingsProperties(settings: Partial<StyleSettings>): StyleSettings {
  // Deep merge with defaults
  return {
    ...DEFAULT_STYLE_SETTINGS,
    ...settings,
    blur: {
      ...DEFAULT_STYLE_SETTINGS.blur,
      ...settings.blur
    },
    highlight: {
      ...DEFAULT_STYLE_SETTINGS.highlight,
      ...settings.highlight
    },
    hide: {
      ...DEFAULT_STYLE_SETTINGS.hide,
      ...settings.hide
    }
  };
}
