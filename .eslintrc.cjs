module.exports = {
  root: true,
  extends: [
    'next/core-web-vitals',
    'plugin:tailwindcss/recommended',
  ],
  plugins: ['tailwindcss'],
  rules: {
    'tailwindcss/no-custom-classname': 'off',
  },
  settings: {
    tailwindcss: {
      callees: ["cn", "cva"],
      config: "tailwind.config.ts",
    },
    next: {
      rootDir: ["app/", "components/", "lib/", "hooks/", "styles/"]
    }
  },
  ignorePatterns: [
    'node_modules',
    '.next',
    'out',
    'dist',
    '.turbo',
    '*.d.ts',
    '**/*.md',
    '**/*.mdx',
    '**/*.json',
    '**/*.graphql',
    '**/*.gql',
    '**/*.graphqls',
    '**/*.gqls',
  ],
}
