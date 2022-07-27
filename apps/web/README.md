# next-template

## Установка

### [degit](https://github.com/Rich-Harris/degit)

```bash
npx degit platinamedia/next-template ./path/to/my-app
```

```bash
npm i
```

### Установка `tailwindcss`

```bash
node scripts/addTailwind.mjs
```

## Запуск ДЕВ-окружения

```bash
npm run dev
```

## Сборка для ПРОДа

```bash
npm run build
```

## Технологии

- TypeScript;
- eslint c [eslint-config-next](https://npmjs.com/package/eslint-config-next);
- husky;
- prettier;

## Структура

Исходный код идёт в [./src](./src) директории.

- [src/components](./src/components) - React компоненты;
  - [src/components/specific](./src/components/specific) - Компоненты созданные для абстракции больших кусков кода;
  - [src/components/design-system](./src/components/design-system) - Компоненты используемые во всём приложении;
- [src/layouts](./src/layouts) - Компоненты, представляющие шаблоны страниц [Next.js docs](https://nextjs.org/docs/basic-features/layouts);
- [src/pages](./src/pages);
- [src/types](./src/types) - Глобальные TypeScript типы;

## Рекомендации

### Расширение для editorconfig

- [vscode](https://marketplace.visualstudio.com/items?itemName=EditorConfig.EditorConfig)
- [vim](https://github.com/editorconfig/editorconfig-vim)
