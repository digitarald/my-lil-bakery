import { FlatCompat } from '@eslint/eslintrc';
// If you need base JS recommended rules, uncomment the next line:
// import js from '@eslint/js';

// Provide compatibility for extending legacy shareable configs (like "next/core-web-vitals").
const compat = new FlatCompat({
  baseDirectory: import.meta.dirname,
});

const config = [
  // Global ignore patterns
  {
    ignores: [
      '.next/**',
      'node_modules/**',
      'dist/**',
      'coverage/**',
      'prisma/dev.db',
      'next-env.d.ts',
    ],
  },
  // Next.js + Core Web Vitals + TypeScript rules via legacy config bridging
  ...compat.extends('next/core-web-vitals', 'next/typescript'),
  // TypeScript source overrides to relax stricter newly introduced rules to previous baseline
  {
    files: ['**/*.ts', '**/*.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off', // Re-enable later with proper typing refactor
    },
  },
  // Allow CommonJS style requires in tool / config files
  {
    files: ['jest.config.js', 'jest.setup.js', 'tailwind.config.ts'],
    rules: {
      '@typescript-eslint/no-require-imports': 'off',
    },
  },
  // Allow triple-slash reference in generated Next.js env d.ts (ignored anyway)
  {
    files: ['next-env.d.ts'],
    rules: {
      '@typescript-eslint/triple-slash-reference': 'off',
    },
  },
  // Project-specific rule overrides (add as needed)
  {
    rules: {
      // Examples:
      // 'no-console': ['warn', { allow: ['warn', 'error'] }],
      // '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
];

export default config;
