// useThemedStyles.js
import { useContext, useMemo } from 'react';
import { ThemeContext } from '@/components/themecontext';
import { StyleSheet } from 'react-native';

const useThemedStyles = (styles) => {
  const { theme } = useContext(ThemeContext);

  return useMemo(() => styles(theme), [theme]);
};

export default useThemedStyles;
