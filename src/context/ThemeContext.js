import React, {createContext, useContext, useState, useMemo} from 'react';

const ThemeContext = createContext();

export const ThemeProvider = ({children}) => {
  const [isDarkMode, setIsDarkMode] = useState(false);

  const theme = useMemo(
    () => ({
      primary: '#1976D2',
      background: isDarkMode ? '#0A1929' : '#F0F7FF',
      card: isDarkMode ? '#132F4C' : '#ffffff',
      text: isDarkMode ? '#ffffff' : '#102A43',
      subtext: isDarkMode ? '#B2BAC2' : '#486581',
      border: isDarkMode ? '#265D97' : '#D1E9FF',
      statusBarStyle: isDarkMode ? 'light-content' : 'dark-content',
    }),
    [isDarkMode],
  );

  const toggleTheme = () => setIsDarkMode(!isDarkMode);

  return (
    <ThemeContext.Provider value={{theme, isDarkMode, toggleTheme}}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};
