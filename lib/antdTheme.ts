import type { ThemeConfig } from 'antd';

export const antdTheme: ThemeConfig = {
  token: {
    // Color tokens
    colorPrimary: '#7c3aed', // Purple-600
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',
    colorInfo: '#3b82f6',
    colorTextBase: '#1f2937',
    colorBgBase: '#ffffff',
    
    // Border
    borderRadius: 8,
    
    // Typography
    fontSize: 14,
    fontFamily: 'var(--font-geist-sans), -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial',
    
    // Spacing
    controlHeight: 44, // Mobile-friendly height
    
    // Shadow
    boxShadow: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    boxShadowSecondary: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
  },
  components: {
    Button: {
      controlHeight: 44,
      borderRadius: 8,
      fontWeight: 500,
      primaryShadow: '0 4px 6px -1px rgba(124, 58, 237, 0.3)',
    },
    Input: {
      controlHeight: 44,
      borderRadius: 8,
      paddingBlock: 10,
      paddingInline: 16,
    },
    Card: {
      borderRadiusLG: 12,
      paddingLG: 24,
    },
    Avatar: {
      borderRadius: 9999,
    },
    Modal: {
      borderRadiusLG: 16,
    },
    Message: {
      borderRadiusLG: 8,
    },
    Notification: {
      borderRadiusLG: 12,
    },
  },
  algorithm: undefined, // Will be set dynamically based on theme mode
};

// Dark theme configuration
export const darkTheme: ThemeConfig = {
  ...antdTheme,
  token: {
    ...antdTheme.token,
    colorTextBase: '#f9fafb',
    colorBgBase: '#111827',
    colorBorder: '#374151',
  },
};

