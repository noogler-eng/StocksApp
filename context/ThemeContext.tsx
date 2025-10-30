import React, { createContext, useContext, useState, useEffect } from "react";
import { useColorScheme } from "react-native";

type ThemeContextType = {
  isDark: boolean;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextType>({
  isDark: false,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const systemTheme = useColorScheme() === "dark";
  const [isDark, setIsDark] = useState(systemTheme);

  const toggleTheme = () => setIsDark((prev) => !prev);

  useEffect(() => {
    setIsDark(systemTheme);
  }, [systemTheme]);

  return (
    <ThemeContext.Provider value={{ isDark, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
