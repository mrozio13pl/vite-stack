# Creating recipes

This is the workflow for adding or updating a feature recipe.

## First time

Start from `main` and build the feature by hand. This is a fictional example for `auth`.

```sh
git switch main
git switch -c recipe/auth
# build feature
git add .
git commit -m "recipe: add auth"
git push -u origin recipe/auth
```

Create a diff to help write the prompt.

```sh
git diff main...recipe/auth > /tmp/auth.diff
```

Then write the recipe source on the `recipes` branch.

```sh
git switch recipes
cp recipes/_template.md recipes/auth.md
# edit recipes/auth.md and recipes/README.md
git add recipes/auth.md recipes/README.md
git commit -m "docs: add auth recipe"
git push
```

The pre-commit hook updates `MAIN_README.md` before the commit. After push, GitHub Actions opens or updates a PR into `main` with the generated README.

## Updating a prompt

Edit the recipe file and commit.

```sh
git switch recipes
$EDITOR recipes/auth.md
git add recipes/auth.md
git commit -m "docs: update auth recipe"
git push
```

## Updating applied code

Update the applied branch with a PR.

```sh
git switch recipe/auth
git switch -c update-auth-recipe
# run agent using recipes/auth.md, then adjust manually if needed
git add .
git commit -m "recipe: update auth"
git push -u origin update-auth-recipe
```

Open a PR with:

```txt
base: recipe/auth
compare: update-auth-recipe
```

## Mid-session prompt changes

If the prompt changes while implementing, update `recipes/auth.md` too. The prompt is the source of truth. The applied branch is just the result.

## Rules

- Keep `main` clean for GitHub template users.
- Keep prompts in `recipes/*.md`.
- Keep the generated main README copy in `MAIN_README.md`.
- Keep applied code in `recipe/*` branches.
- Prefer one recipe per feature.
