// @ts-ignore
export default {
  experimental: { optimizeUniversalDefaults: true },
  darkMode: ['class'],
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      fontFamily : {
        'aguaextra':['safir-extra'],
        'agua':['safir-plus'],
        'aguatitle':['safir-title'],
        'chili':['ruby-plus'],
        'chilitext':['ruby-text'],
        'chilititle':['ruby-title'],
        'matrix':['emerald-plus'],
        'matrixtext':['emerald-text'],
        'matrixtitle':['emerald-title'],
        'pastel':['diamond-plus'],
        'pasteltext':['diamond-text'],
        'pasteltitle':['diamond-title'],
        'clasplus':['classic-plus'],
        'clastext':['classic-text'],
        'clastitle':['classic-title'],
        'dark':['neon-plus'],
        'darktext':['neon-text'],
        'darktitle':['neon-title'],
        'gold':['taco-plus'],
        'goldtext':['taco-text'],
        'goldtitle':['taco-title'],
        'silver':['berry-plus'],
        'silvertext':['berry-text'],
        'silvertitle':['berry-title'],
        'silverextra':['berry-extra'],
        'gemsextra':['africa-extra'],
        'gems':['africa-plus'],
        'gemstext':['africa-text'],
        'gemstitle':['africa-title'],
        'lazul':['metal-plus'],
        'lazultext':['metal-text'],
        'lazultitle':['metal-title'],
        'lazulextra':['metal-extra']
      },
      typography: {
        DEFAULT: {
          css: {
            maxWidth: 'none',
            color: 'hsl(var(--foreground))',
            hr: {
              borderColor: 'hsl(var(--border))',
              marginTop: '3em',
              marginBottom: '3em',
            },
            'h1, h2, h3, h4': {
              color: 'hsl(var(--foreground))',
            },
            a: {
              color: 'hsl(var(--primary))',
              '&:hover': {
                color: 'hsl(var(--primary))',
              },
            },
            strong: {
              color: 'hsl(var(--foreground))',
            },
          },
        },
      },
      colors: {
        sombre:'var(--sombre)',
        quadriary:'var(--quadriary)',
        quintary:'var(--quintary)',
        light:'var(--light)',
        classic:'var(--classic)',
        accent: 'var(--accent)',
        accentHover: 'var(--accent-hover)',
        accentTextHover:'var(--accentText-hover)',
        accentOneTextHover:'var(--accentText-hover)',
        accentTwoTextHover:'var(--accentText-hover)',
        accentThreeTextHover:'var(--accentText-hover)',
        accentFourTextHover:'var(--accentText-hover)',
        accentForeground: 'var(--accent-foreground)',
        accentOne: "var(--accentOne)",
        accentOneHover: "var(--accentOne-hover)",
        accentTwo: "var(--accentTwo)",
        accentTwoHover: "var(--accentTwo-hover)",
        accentThree: "var(--accentThree)",
        accentThreeHover: "var(--accentThree-hover)",
        accentFour: "var(--accentFour)",
        accentFourHover: "var(--accentFour-hover)",
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate'), require('@tailwindcss/typography')],
};
