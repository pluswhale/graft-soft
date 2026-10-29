# Правила работы с Git

## Порядок работы

1. Обновить `main`:

   ```bash
   git switch main
   git pull origin main
   ```

2. Создать ветку от `main`:

   ```bash
   git switch -c feat/short-description
   ```

3. Работать только в своей ветке. В `main` напрямую не коммитить и не пушить.

4. Делать коммиты в ветку в формате Conventional Commits:

   ```bash
   git add <файлы>
   git commit -m "feat: add contact section"
   ```

5. Запушить ветку в удалённый репозиторий:

   ```bash
   git push -u origin feat/short-description
   ```

6. Открыть Pull Request из ветки в `main` с описанием сделанного:

   ```bash
   gh pr create --base main --title "feat: add contact section" --body-file pr.md
   ```

7. После ревью влить PR в `main` и удалить ветку.

## Названия веток

Формат: `<тип>/<краткое-описание>`, латиница, слова через дефис.

Примеры:

- `feat/mobile-cases-cards`
- `fix/nav-focus-on-escape`
- `chore/vercel-domain-setup`

## Conventional Commits

Формат сообщения:

```
<тип>(<область>): <что сделано>
```

Область необязательна. Описание короткое, в повелительном наклонении, без точки в конце.

| Тип | Когда использовать |
|---|---|
| `feat` | новая функциональность |
| `fix` | исправление ошибки |
| `refactor` | изменение кода без изменения поведения |
| `style` | форматирование, без изменения логики |
| `docs` | документация |
| `test` | тесты |
| `perf` | производительность |
| `chore` | настройки, зависимости, служебные изменения |
| `ci` | CI/CD |

Примеры:

```
feat(cases): add mobile swipe cards
fix(nav): return focus after closing panel
docs: add git workflow rules
chore: update eslint config
```

Ломающие изменения отмечаются `!` после типа: `feat!: change locale routes`.

## Описание Pull Request

Заголовок PR — тоже в формате Conventional Commits.

Шаблон описания:

```markdown
## Что сделано
- Краткий список изменений.

## Зачем
- Какую задачу решает.

## Как проверено
- lint, tsc, build
- Что проверено вручную (страницы, мобильная версия).

## Что осталось на потом
- Если есть.
```

## Правила

- Одна ветка — одна задача.
- Маленькие и понятные коммиты и PR.
- Перед PR проверить: `pnpm lint`, `pnpm exec tsc --noEmit`, `pnpm build`.
- Не пушить напрямую в `main`.
- Не переписывать историю общих веток (`push --force` только в свою ветку и только при необходимости).
