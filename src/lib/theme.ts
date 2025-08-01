// Social SaaS Theme Configuration
// Dark theme with black-blue color palette

export const theme = {
  colors: {
    // Primary Colors - Deep Blue Tones
    primary: {
      50: '#f0f4ff',
      100: '#e0e9ff',
      200: '#c7d6ff',
      300: '#a5b8ff',
      400: '#8191ff',
      500: '#6366ff',
      600: '#4f46e5',
      700: '#4338ca',
      800: '#3730a3',
      900: '#312e81',
      950: '#1e1b4b',
    },

    // Secondary Colors - Dark Blue-Gray
    secondary: {
      50: '#f8fafc',
      100: '#f1f5f9',
      200: '#e2e8f0',
      300: '#cbd5e1',
      400: '#94a3b8',
      500: '#64748b',
      600: '#475569',
      700: '#334155',
      800: '#1e293b',
      900: '#0f172a',
      950: '#020617',
    },

    // Background Colors - Deep Blacks
    background: {
      primary: '#0a0a0f',      // Deep black with blue tint
      secondary: '#111827',    // Dark slate
      tertiary: '#1f2937',     // Lighter dark slate
      card: '#1e1e2e',         // Dark card background
      overlay: '#00000080',    // Semi-transparent overlay
    },

    // Surface Colors - Dark Surfaces
    surface: {
      primary: '#0f0f23',      // Deep dark blue-black
      secondary: '#1a1a2e',    // Dark blue-gray
      tertiary: '#16213e',     // Dark blue
      elevated: '#1e293b',     // Elevated surface
      border: '#2d3748',       // Border color
    },

    // Text Colors
    text: {
      primary: '#ffffff',      // Pure white
      secondary: '#e2e8f0',    // Light gray
      tertiary: '#94a3b8',     // Medium gray
      muted: '#64748b',        // Muted text
      inverse: '#0f172a',      // Dark text for light backgrounds
    },

    // Accent Colors
    accent: {
      blue: '#3b82f6',         // Bright blue
      purple: '#8b5cf6',       // Purple
      cyan: '#06b6d4',         // Cyan
      emerald: '#10b981',      // Green
      amber: '#f59e0b',        // Amber
      rose: '#f43f5e',         // Rose
    },

    // Status Colors
    status: {
      success: '#10b981',      // Green
      warning: '#f59e0b',      // Amber
      error: '#ef4444',        // Red
      info: '#3b82f6',         // Blue
    },

    // Gradient Colors
    gradients: {
      primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      dark: 'linear-gradient(135deg, #0f0f23 0%, #1a1a2e 100%)',
      blue: 'linear-gradient(135deg, #1e3a8a 0%, #3b82f6 100%)',
      purple: 'linear-gradient(135deg, #581c87 0%, #8b5cf6 100%)',
    },
  },

  // Spacing Scale
  spacing: {
    xs: '0.25rem',    // 4px
    sm: '0.5rem',     // 8px
    md: '1rem',       // 16px
    lg: '1.5rem',     // 24px
    xl: '2rem',       // 32px
    '2xl': '3rem',    // 48px
    '3xl': '4rem',    // 64px
  },

  // Border Radius
  borderRadius: {
    none: '0',
    sm: '0.125rem',   // 2px
    md: '0.375rem',   // 6px
    lg: '0.5rem',     // 8px
    xl: '0.75rem',    // 12px
    '2xl': '1rem',    // 16px
    full: '9999px',
  },

  // Shadows
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    inner: 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
    none: 'none',
  },

  // Typography
  typography: {
    fontFamily: {
      sans: ['Geist', 'system-ui', 'sans-serif'],
      mono: ['Geist Mono', 'monospace'],
    },
    fontSize: {
      xs: '0.75rem',    // 12px
      sm: '0.875rem',   // 14px
      base: '1rem',     // 16px
      lg: '1.125rem',   // 18px
      xl: '1.25rem',    // 20px
      '2xl': '1.5rem',  // 24px
      '3xl': '1.875rem', // 30px
      '4xl': '2.25rem',  // 36px
      '5xl': '3rem',     // 48px
      '6xl': '3.75rem',  // 60px
    },
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
  },

  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },

  // Transitions
  transitions: {
    fast: '150ms ease-in-out',
    normal: '250ms ease-in-out',
    slow: '350ms ease-in-out',
  },

  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    secondary: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    success: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    warning: 'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    danger: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 100%)',
    info: 'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
    dark: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
    light: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
  },
}

// CSS Variables for easy use in Tailwind
export const cssVariables = {
  '--color-primary-50': theme.colors.primary[50],
  '--color-primary-100': theme.colors.primary[100],
  '--color-primary-200': theme.colors.primary[200],
  '--color-primary-300': theme.colors.primary[300],
  '--color-primary-400': theme.colors.primary[400],
  '--color-primary-500': theme.colors.primary[500],
  '--color-primary-600': theme.colors.primary[600],
  '--color-primary-700': theme.colors.primary[700],
  '--color-primary-800': theme.colors.primary[800],
  '--color-primary-900': theme.colors.primary[900],
  '--color-primary-950': theme.colors.primary[950],
  
  '--color-background-primary': theme.colors.background.primary,
  '--color-background-secondary': theme.colors.background.secondary,
  '--color-background-tertiary': theme.colors.background.tertiary,
  '--color-background-card': theme.colors.background.card,
  
  '--color-surface-primary': theme.colors.surface.primary,
  '--color-surface-secondary': theme.colors.surface.secondary,
  '--color-surface-tertiary': theme.colors.surface.tertiary,
  '--color-surface-elevated': theme.colors.surface.elevated,
  '--color-surface-border': theme.colors.surface.border,
  
  '--color-text-primary': theme.colors.text.primary,
  '--color-text-secondary': theme.colors.text.secondary,
  '--color-text-tertiary': theme.colors.text.tertiary,
  '--color-text-muted': theme.colors.text.muted,
}

// Utility functions
export const getGradient = (gradientName: keyof typeof theme.gradients) => {
  return theme.gradients[gradientName]
}

export const getColor = (colorPath: string) => {
  const path = colorPath.split('.')
  let current: any = theme.colors
  
  for (const key of path) {
    current = current[key]
    if (current === undefined) {
      console.warn(`Color path "${colorPath}" not found`)
      return theme.colors.text.primary
    }
  }
  
  return current
} 