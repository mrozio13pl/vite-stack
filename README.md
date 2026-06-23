# vite-stack recipes

This branch contains the prompts and recipe workflow for expanding vite-stack.

The `main` branch stays as the clean GitHub template. Recipe branches show applied examples for people who do not want to use an agent.

## Start here

- [Recipes index](./recipes/README.md)
- [How to create a recipe](./recipes/creating-recipes.md)
- [Recipe file template](./recipes/_template.md)
- [Script that updates main README](./scripts/update-main-readme.mjs)

## Branch layout

```txt
main            = clean template
recipes         = prompts and workflow docs
recipe/<name>   = applied feature code
```

## Recipes

This folder is the source of truth for vite-stack recipes.

Each recipe has:

- a short explanation
- an agent prompt
- an applied `recipe/*` branch
- a diff against `main`

| Feature | Prompt | Applied branch | Diff | Status |
| --- | --- | --- | --- | --- |
| Example | [`_template.md`](./_template.md) | `recipe/example` | `main...recipe/example` | template |

## Workflow

1. Create or edit a recipe in `recipes/*.md`.
2. Commit normally.
3. The Husky pre-commit hook updates `MAIN_README.md`.
4. Pushing `recipes` opens or updates a PR that copies `MAIN_README.md` to `main:README.md`.

Applied branches should always be based on `main`.
