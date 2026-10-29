# Правила работы с Git

## Ветки и окружения

| Ветка | Окружение | Адрес |
|---|---|---|
| `main` | Production | https://www.graftsoft.com/ |
| `dev` | Dev (Preview) | https://dev.graftsoft.com/ |
| `feat/*`, `fix/*` и др. | Preview | временная ссылка Vercel в PR |

- `main` — только проверенный код, который уже работает на dev.
- `dev` — общая ветка для проверки перед релизом.
- В `main` и `dev` напрямую не коммитить и не пушить, только через PR.

## Порядок работы

1. Обновить `dev`:

   ```bash
   git switch dev
   git pull origin dev
   ```

2. Создать ветку задачи от `dev`:

   ```bash
   git switch -c feat/short-description
   ```

3. Делать коммиты в ветку в формате Conventional Commits:

   ```bash
   git add <файлы>
   git commit -m "feat: add contact section"
   ```

4. Запушить ветку в удалённый репозиторий:

   ```bash
   git push -u origin feat/short-description
   ```

5. Открыть Pull Request из ветки в `dev` с описанием сделанного:

   ```bash
   gh pr create --base dev --title "feat: add contact section" --body-file pr.md
   ```

   Vercel соберёт превью и добавит ссылку в PR.

6. После ревью влить PR в `dev` и удалить ветку. Изменения появятся на https://dev.graftsoft.com/.

7. Проверить сайт на dev: десктоп, мобильный, оба языка.

## Релиз в прод

1. Открыть Pull Request из `dev` в `main`:

   ```bash
   gh pr create --base main --head dev --title "chore(release): <что входит>" --body-file pr.md
   ```

2. В описании перечислить задачи, которые входят в релиз.

3. После влития в `main` Vercel автоматически выкатит прод на https://www.graftsoft.com/.

## Срочные исправления прода

1. Создать ветку `fix/...` от `main`.
2. PR в `main`, после влития — PR из `main` в `dev` (или влить `main` в `dev`), чтобы ветки не разошлись.

## Названия веток

Формат: `<тип>/<краткое-описание>`, латиница, слова через дефис.

Примеры:

- `feat/mobile-cases-cards`
- `fix/nav-focus-on-escape`
- `chore/vercel-domain-setup`

Ветки задач создаются от `dev`, ветки срочных исправлений — от `main`.

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
- Не пушить напрямую в `main` и `dev`.
- Не переписывать историю общих веток (`push --force` только в свою ветку и только при необходимости).
