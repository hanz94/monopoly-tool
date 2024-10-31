import { createContext, useContext } from 'react';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useLocalStorageState } from '@toolpad/core';

type ModeType = "light" | "dark" | null;

interface ThemeContextType {
  mode: ModeType;
  setMode: (mode: ModeType) => void;
  changeTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const ThemeContextProvider = ({ children }: { children: React.ReactNode }) => {
  const prefersDarkMode = useMediaQuery<boolean>('(prefers-color-scheme: dark)');
  const [mode, setMode] = useLocalStorageState<ModeType>('selectedMode', prefersDarkMode ? 'dark' : 'light');

  const appTheme = createTheme({
    palette: {
      mode: mode ?? 'dark',
    },
  });

  const changeTheme = () => {
    setMode(mode === 'dark' ? 'light' : 'dark');
  };

  return (
    <ThemeContext.Provider value={{ mode, setMode, changeTheme }}>
      <ThemeProvider theme={appTheme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ThemeContext.Provider>
  );
};

const useThemeContext = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useThemeContext must be used within a ThemeContextProvider');
  }
  return context;
};

export { ThemeContextProvider, useThemeContext };