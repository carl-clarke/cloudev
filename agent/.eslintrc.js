/*
👋 Hi! This file was autogenerated by tslint-to-eslint-config.
https://github.com/typescript-eslint/tslint-to-eslint-config

It represents the closest reasonable ESLint configuration to this
project's original TSLint configuration.

We recommend eventually switching this configuration to extend from
the recommended rulesets in typescript-eslint. 
https://github.com/typescript-eslint/tslint-to-eslint-config/blob/master/docs/FAQs.md

Happy linting! 💖
*/
module.exports = {
    "env": {
        "node": true
    },
    "extends": [
        "plugin:@typescript-eslint/recommended",
        "plugin:@typescript-eslint/recommended-requiring-type-checking",
        "prettier",
        "prettier/@typescript-eslint"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "tsconfig.json",
        "sourceType": "module"
    },
    "plugins": [
        "eslint-plugin-import",
        "eslint-plugin-jsdoc",
        "eslint-plugin-prefer-arrow",
        "eslint-plugin-react",
        "@typescript-eslint",
        "@typescript-eslint/tslint"
    ],
    "rules": {
        "@typescript-eslint/adjacent-overload-signatures": "error",
        "@typescript-eslint/array-type": "off",
        "@typescript-eslint/await-thenable": "error",
        "@typescript-eslint/ban-types": "off",
        "@typescript-eslint/consistent-type-assertions": "error",
        "@typescript-eslint/consistent-type-definitions": "off",
        "@typescript-eslint/dot-notation": "error",
        "@typescript-eslint/explicit-member-accessibility": [
            "error",
            {
                "accessibility": "explicit"
            }
        ],
        "@typescript-eslint/indent": [
            "error",
            2
        ],
        "@typescript-eslint/member-delimiter-style": [
            "error",
            {
                "multiline": {
                    "delimiter": "none",
                    "requireLast": true
                },
                "singleline": {
                    "delimiter": "semi",
                    "requireLast": false
                }
            }
        ],
        "@typescript-eslint/member-ordering": "off",
        "@typescript-eslint/naming-convention": "off",
        "@typescript-eslint/no-empty-function": "error",
        "@typescript-eslint/no-empty-interface": "error",
        "@typescript-eslint/no-explicit-any": "off",
        "@typescript-eslint/no-floating-promises": "error",
        "@typescript-eslint/no-inferrable-types": "error",
        "@typescript-eslint/no-misused-new": "error",
        "@typescript-eslint/no-namespace": "error",
        "@typescript-eslint/no-param-reassign": "error",
        "@typescript-eslint/no-parameter-properties": "off",
        "@typescript-eslint/no-shadow": [
            "error",
            {
                "hoist": "all"
            }
        ],
        "@typescript-eslint/no-this-alias": "off",
        "@typescript-eslint/no-unnecessary-qualifier": "error",
        "@typescript-eslint/no-unnecessary-type-arguments": "error",
        "@typescript-eslint/no-unnecessary-type-assertion": "error",
        "@typescript-eslint/no-unused-expressions": "error",
        "@typescript-eslint/no-use-before-define": "off",
        "@typescript-eslint/no-var-requires": "error",
        "@typescript-eslint/prefer-for-of": "error",
        "@typescript-eslint/prefer-function-type": "error",
        "@typescript-eslint/prefer-namespace-keyword": "error",
        "@typescript-eslint/prefer-readonly": "error",
        "@typescript-eslint/promise-function-async": "error",
        "@typescript-eslint/quotes": [
            "error",
            "single"
        ],
        "@typescript-eslint/restrict-plus-operands": "error",
        "@typescript-eslint/semi": [
            "error",
            null
        ],
        "@typescript-eslint/strict-boolean-expressions": "error",
        "@typescript-eslint/triple-slash-reference": [
            "error",
            {
                "path": "always",
                "types": "prefer-import",
                "lib": "always"
            }
        ],
        "@typescript-eslint/type-annotation-spacing": "off",
        "@typescript-eslint/unbound-method": "error",
        "@typescript-eslint/unified-signatures": "error",
        "arrow-body-style": "error",
        "arrow-parens": [
            "off",
            "always"
        ],
        "brace-style": [
            "off",
            "off"
        ],
        "comma-dangle": "error",
        "complexity": "error",
        "constructor-super": "error",
        "curly": "error",
        "default-case": "error",
        "eol-last": "error",
        "eqeqeq": [
            "error",
            "always"
        ],
        "guard-for-in": "error",
        "id-blacklist": [
            "error",
            "any",
            "Number",
            "number",
            "String",
            "string",
            "Boolean",
            "boolean",
            "Undefined",
            "undefined"
        ],
        "id-match": "error",
        "import/no-default-export": "off",
        "import/no-deprecated": "error",
        "import/no-extraneous-dependencies": "error",
        "import/order": "off",
        "jsdoc/check-alignment": "error",
        "jsdoc/check-indentation": "error",
        "jsdoc/newline-after-description": "error",
        "jsdoc/no-types": "error",
        "linebreak-style": "off",
        "max-classes-per-file": [
            "error",
            1
        ],
        "max-len": [
            "error",
            {
                "ignorePattern": "^import |^export {(.*?)}",
                "code": 200
            }
        ],
        "max-lines": [
            "error",
            1000
        ],
        "new-parens": "error",
        "newline-per-chained-call": "error",
        "no-bitwise": "error",
        "no-caller": "error",
        "no-cond-assign": "error",
        "no-console": "error",
        "no-debugger": "error",
        "no-duplicate-case": "error",
        "no-duplicate-imports": "error",
        "no-empty": "error",
        "no-eval": "error",
        "no-extra-semi": "off",
        "no-fallthrough": "off",
        "no-invalid-this": "off",
        "no-irregular-whitespace": "error",
        "no-magic-numbers": "error",
        "no-multiple-empty-lines": "off",
        "no-new-wrappers": "error",
        "no-redeclare": "error",
        "no-return-await": "error",
        "no-template-curly-in-string": "error",
        "no-throw-literal": "error",
        "no-trailing-spaces": "error",
        "no-undef-init": "error",
        "no-underscore-dangle": "error",
        "no-unsafe-finally": "error",
        "no-unused-labels": "error",
        "no-var": "error",
        "no-void": "error",
        "object-shorthand": "error",
        "one-var": [
            "error",
            "never"
        ],
        "padding-line-between-statements": [
            "error",
            {
                "blankLine": "always",
                "prev": "*",
                "next": "return"
            }
        ],
        "prefer-arrow/prefer-arrow-functions": "off",
        "prefer-const": "error",
        "prefer-object-spread": "error",
        "prefer-template": "error",
        "quote-props": "off",
        "radix": "error",
        "react/jsx-curly-spacing": "off",
        "react/jsx-equals-spacing": "off",
        "react/jsx-tag-spacing": [
            "off",
            {
                "afterOpening": "allow",
                "closingSlash": "allow"
            }
        ],
        "react/jsx-wrap-multilines": "off",
        "space-before-function-paren": "off",
        "space-in-parens": [
            "off",
            "never"
        ],
        "spaced-comment": [
            "error",
            "always",
            {
                "markers": [
                    "/"
                ]
            }
        ],
        "use-isnan": "error",
        "valid-typeof": "off",
        "yoda": "error",
        "@typescript-eslint/tslint/config": [
            "error",
            {
                "rules": {
                    "encoding": true,
                    "import-spacing": true,
                    "no-inferred-empty-object-type": true,
                    "no-mergeable-namespace": true,
                    "no-unnecessary-callback-wrapper": true,
                    "number-literal-format": true,
                    "prefer-method-signature": true,
                    "prefer-while": true,
                    "return-undefined": true,
                    "strict-type-predicates": true,
                    "typedef": true,
                    "whitespace": true
                }
            }
        ]
    }
};
