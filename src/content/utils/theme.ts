export interface ThemeColors {
  background: {
    primary: string;
    secondary: string;
    overlay: string;
  };
  text: {
    primary: string;
    secondary: string;
    accent: string;
  };
  border: {
    light: string;
    medium: string;
    dark: string;
  };
  button: {
    primary: {
      background: string;
      text: string;
    };
    secondary: {
      background: string;
      text: string;
    };
  };
}

export const getThemeColors = (isDarkTheme: boolean): ThemeColors => ({
  background: {
    primary: isDarkTheme ? "#1e1e1e" : "#ffffff",
    secondary: isDarkTheme ? "#2d2d2d" : "#f0f0f0",
    overlay: isDarkTheme ? "rgba(0,0,0,0.7)" : "rgba(0,0,0,0.2)",
  },
  text: {
    primary: isDarkTheme ? "#e0e0e0" : "#333333",
    secondary: isDarkTheme ? "#a0a0a0" : "#666666",
    accent: isDarkTheme ? "#1d9bf0" : "#1d9bf0",
  },
  border: {
    light: isDarkTheme ? "rgba(255,255,255,0.1)" : "rgba(0,0,0,0.05)",
    medium: isDarkTheme ? "rgba(255,255,255,0.2)" : "rgba(0,0,0,0.1)",
    dark: isDarkTheme ? "#404040" : "#cccccc",
  },
  button: {
    primary: {
      background: isDarkTheme ? "#0d47a1" : "#1976d2",
      text: "#ffffff",
    },
    secondary: {
      background: isDarkTheme ? "#2d2d2d" : "#f0f0f0",
      text: isDarkTheme ? "#e0e0e0" : "#333333",
    },
  },
});
