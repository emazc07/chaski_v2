import js from "@eslint/js"
import tseslint from "typescript-eslint"
import reactHooks from "eslint-plugin-react-hooks"
import prettier from "eslint-config-prettier"

export default tseslint.config(
  {
    ignores: [
      "dist/**",
      "node_modules/**",
      "public/**",
      "vendor/**",
      "tmp/**",
      "log/**",
      "coverage/**",
      // Stimulus legacy JS — not part of the React/TS lint surface
      "app/javascript/controllers/**",
      "app/javascript/application.js",
    ],
  },
  js.configs.recommended,
  ...tseslint.configs.recommended,
  {
    files: ["app/javascript/**/*.{ts,tsx}"],
    plugins: {
      "react-hooks": reactHooks,
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
    },
  },
  prettier, // keep last so Prettier owns formatting
)
