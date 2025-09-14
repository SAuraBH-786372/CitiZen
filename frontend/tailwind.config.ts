import type { Config } from 'tailwindcss'
import animate from 'tailwindcss-animate'

export default {
  darkMode: ['class'],
  content: ['index.html', './src/**/*.{ts,tsx}'],
  theme: {
    container: { center: true, padding: '2rem' },
    extend: {
      colors: {
        // Enhanced Border System
        border: {
          DEFAULT: 'hsl(var(--border))',
          light: 'hsl(var(--border-light))',
          strong: 'hsl(var(--border-strong))'
        },
        input: {
          DEFAULT: 'hsl(var(--input))',
          focus: 'hsl(var(--input-focus))'
        },
        ring: 'hsl(var(--ring))',
        
        // Enhanced Background System
        background: {
          DEFAULT: 'hsl(var(--background))',
          secondary: 'hsl(var(--background-secondary))',
          tertiary: 'hsl(var(--background-tertiary))'
        },
        foreground: 'hsl(var(--foreground))',
        
        // Enhanced Primary Colors
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          hover: 'hsl(var(--primary-hover))',
          active: 'hsl(var(--primary-active))',
          foreground: 'hsl(var(--primary-foreground))',
          light: 'hsl(var(--primary-light))',
          dark: 'hsl(var(--primary-dark))'
        },
        
        // Enhanced Secondary Colors
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          hover: 'hsl(var(--secondary-hover))',
          active: 'hsl(var(--secondary-active))',
          foreground: 'hsl(var(--secondary-foreground))'
        },
        
        // Success Colors
        success: {
          DEFAULT: 'hsl(var(--success))',
          hover: 'hsl(var(--success-hover))',
          foreground: 'hsl(var(--success-foreground))',
          light: 'hsl(var(--success-light))'
        },
        
        // Warning Colors
        warning: {
          DEFAULT: 'hsl(var(--warning))',
          hover: 'hsl(var(--warning-hover))',
          foreground: 'hsl(var(--warning-foreground))',
          light: 'hsl(var(--warning-light))'
        },
        
        // Enhanced Destructive Colors
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          hover: 'hsl(var(--destructive-hover))',
          foreground: 'hsl(var(--destructive-foreground))',
          light: 'hsl(var(--destructive-light))'
        },
        
        // Enhanced Muted System
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          hover: 'hsl(var(--muted-hover))',
          foreground: 'hsl(var(--muted-foreground))'
        },
        
        // Enhanced Accent System
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          hover: 'hsl(var(--accent-hover))',
          foreground: 'hsl(var(--accent-foreground))',
          light: 'hsl(var(--accent-light))'
        },
        
        // Enhanced Popover System
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))'
        },
        
        // Enhanced Card System
        card: {
          DEFAULT: 'hsl(var(--card))',
          secondary: 'hsl(var(--card-secondary))',
          foreground: 'hsl(var(--card-foreground))',
          border: 'hsl(var(--card-border))'
        },
        
        // Status Colors
        status: {
          open: 'hsl(var(--status-open))',
          progress: 'hsl(var(--status-progress))',
          resolved: 'hsl(var(--status-resolved))',
          closed: 'hsl(var(--status-closed))'
        },
        
        // Multi-colored Avatar System
        avatar: {
          1: 'hsl(var(--avatar-1))',
          2: 'hsl(var(--avatar-2))',
          3: 'hsl(var(--avatar-3))',
          4: 'hsl(var(--avatar-4))',
          5: 'hsl(var(--avatar-5))',
          6: 'hsl(var(--avatar-6))'
        }
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)'
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' }
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out'
      }
    }
  },
  plugins: [animate]
} satisfies Config