import js from "@eslint/js";
import globals from "globals";
import pluginReact from "eslint-plugin-react";
import { defineConfig } from "eslint/config";

export default defineConfig([
  // Ignore build output and coverage folders
  {
    ignores: ["dist/**", "coverage/**", "node_modules/**"]
  },
  // Main config for source files
  {
    files: ["**/*.{js,mjs,cjs,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser
      }
    }
  },
  // React config with JSX runtime (React 17+)
  {
    ...pluginReact.configs.flat.recommended,
    settings: {
      react: {
        version: "detect"
      }
    },
    rules: {
      ...pluginReact.configs.flat.recommended.rules,
      "react/react-in-jsx-scope": "off",
      "react/prop-types": "off"
    }
  },
  // Jest test files config
  {
    files: ["**/*.test.js", "**/*.test.jsx", "**/setupTests.js", "__mocks__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest,
        ...globals.node,
        global: "readonly",
        setImmediate: "readonly"
      }
    }
  }
]);
