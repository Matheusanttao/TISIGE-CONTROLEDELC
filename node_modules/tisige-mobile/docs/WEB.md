# Execução e build Web

## Desenvolvimento

O projeto usa **Metro** como bundler para web (`app.json` → `expo.web.bundler: "metro"`), com:

- `react-native-web` — implementação web dos componentes `react-native`
- `react-dom` — renderização no navegador

Comando principal:

```bash
npm run web
```

Equivale a `npx expo start --web`, que inicia o servidor de desenvolvimento e permite abrir o app no browser.

## Produção (export estático)

```bash
npm run build:web
```

Gera `web-build/` com `index.html`, assets e JavaScript empacotado. Publique essa pasta em qualquer servidor HTTP estático.

## Ajustes feitos para Web

- `metro.config.js` — `getDefaultConfig` do Expo (suporte a plataforma `web`).
- `App.tsx` — `SafeAreaProvider` para áreas seguras também no browser.
- `react-native-gesture-handler` importado no entry (necessário para gestos e navegação).
- Dependências explícitas: `react-dom`, `react-native-web`, `@expo/vector-icons`.

## Limitações típicas

- **AsyncStorage** no web usa `localStorage` (comportamento do pacote oficial).
- Gestos complexos podem diferir levemente do nativo; a navegação por stack funciona.

## Solução de problemas

- Se a porta estiver em uso, o Expo sugere outra no terminal.
- Limpe cache: `npx expo start --web --clear`.
- **`Uncaught SyntaxError: Cannot use 'import.meta' outside a module`**: o Zustand 5 publica ESM em `.mjs` com `import.meta`; Metro na Web pode resolver esse arquivo. O `metro.config.js` do projeto força o uso dos arquivos CommonJS (`index.js` / `middleware.js`). Se o erro voltar após atualizar dependências, confira se esse override ainda está presente.
