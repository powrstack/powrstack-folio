import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals"),
  {
    rules: {
      // Disable unescaped entities rule to allow apostrophes and quotes in JSX
      "react/no-unescaped-entities": "off",
      
      // Allow <img> tags (disable Next.js image optimization warning)
      "@next/next/no-img-element": "off",
      
      // Allow <a> tags for external links (disable Next.js Link requirement)
      "@next/next/no-html-link-for-pages": "off",
      
      // Make exhaustive-deps a warning instead of error
      "react-hooks/exhaustive-deps": "warn",
    },
  },
];

export default eslintConfig;
