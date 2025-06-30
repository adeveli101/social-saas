import type { Config } from "tailwindcss";
import { theme } from "./src/lib/theme";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Primary Colors
        primary: theme.colors.primary,
        
        // Secondary Colors
        secondary: theme.colors.secondary,
        
        // Background Colors
        background: theme.colors.background,
        
        // Surface Colors
        surface: theme.colors.surface,
        
        // Text Colors
        text: theme.colors.text,
        
        // Accent Colors
        accent: theme.colors.accent,
        
        // Status Colors
        success: theme.colors.status.success,
        warning: theme.colors.status.warning,
        error: theme.colors.status.error,
        info: theme.colors.status.info,
      },
      
      backgroundImage: {
        'gradient-primary': theme.gradients.primary,
        'gradient-secondary': theme.gradients.secondary,
        'gradient-dark': theme.gradients.dark,
        'gradient-blue': theme.gradients.blue,
        'gradient-purple': theme.gradients.purple,
      },
      
      fontFamily: {
        sans: theme.typography.fontFamily.sans,
        mono: theme.typography.fontFamily.mono,
      },
      
      fontSize: theme.typography.fontSize,
      fontWeight: theme.typography.fontWeight,
      
      spacing: theme.spacing,
      borderRadius: theme.borderRadius,
      
      boxShadow: theme.shadows,
      
      transitionDuration: {
        'fast': '150ms',
        'normal': '250ms',
        'slow': '350ms',
      },
      
      transitionTimingFunction: {
        'ease-in-out': 'ease-in-out',
      },
    },
  },
  plugins: [],
};

export default config; 