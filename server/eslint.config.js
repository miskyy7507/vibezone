// @ts-check

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
    { ignores: ["dist"] },
    {
        files: ["**/*.ts"],
        extends: [
            eslint.configs.recommended,
            tseslint.configs.strictTypeChecked
        ],
        rules: {
            "@typescript-eslint/array-type": "error",
            "@typescript-eslint/no-unused-vars": [
                "error",
                { argsIgnorePattern: "(^_|next)" },
            ],
            "max-depth": ["error", { max: 4 }],
            "eqeqeq": "error"
        },
        languageOptions: {
            parserOptions: {
                projectService: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
    }
);
