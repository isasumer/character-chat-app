'use client';

import React, { useEffect, useState } from 'react';
import { ConfigProvider, theme } from 'antd';
import { AntdRegistry } from '@ant-design/nextjs-registry';
import { antdTheme, darkTheme } from '../../lib/antdTheme';

export function AntdProvider({ children }: { children: React.ReactNode }) {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check for dark mode preference
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setIsDark(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent) => {
      setIsDark(e.matches);
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const currentTheme = isDark ? darkTheme : antdTheme;
  const algorithm = isDark ? theme.darkAlgorithm : theme.defaultAlgorithm;

  return (
    <AntdRegistry>
      <ConfigProvider
        theme={{
          ...currentTheme,
          algorithm,
        }}
      >
        {children}
      </ConfigProvider>
    </AntdRegistry>
  );
}

