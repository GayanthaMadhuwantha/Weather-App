import React, { createContext, useState } from 'react';

// Define the themes
const lightTheme = {
  background: '#ffffff',
  text: '#000000',
  // Add more styles as needed
};

const darkTheme = {
  background: '#000000',
  text: '#ffffff',
  // Add more styles as needed
};

// Create the ThemeContext with default value
export const ThemeContext = createContext({
  theme: lightTheme,
  toggleTheme: () => {},
});

export default function ThemeProvider ({ children }){
  const [theme, setTheme] = useState(lightTheme);

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === lightTheme ? darkTheme : lightTheme
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
