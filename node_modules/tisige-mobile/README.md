# TISIGE Mobile

App **React Native (Expo)** do sistema de **Controle de LC** e **Gestão LC final**. O mesmo código roda em **Android**, **iOS** e **navegador (Web)**.

## Supabase (produção)

1. Copie `.env.example` para `.env` e preencha `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`.
2. No painel Supabase, execute os SQL em `../supabase/migrations/` (schema + fluxo de aprovação).
3. Crie usuários em **Authentication**; a tabela `public.profiles` é preenchida pelo trigger (ajuste `tipo`, `papel`, `setor` conforme necessário).
4. O app usa **Supabase Auth** (e-mail + senha) e persiste LCs em `public.controle_lc`. Notificações de reprovação ficam no aparelho (AsyncStorage).

## Rodar no navegador (Web)

1. Instale dependências:

```bash
npm install
```

2. Inicie o servidor de desenvolvimento **com bundler web**:

```bash
npm run web
```

O Expo abre o Metro e compila com **react-native-web**. No terminal, pressione **`w`** para abrir o navegador, ou use a URL indicada (em geral `http://localhost:8081` ou porta exibida pelo CLI).

3. Alternativa com Expo CLI:

```bash
npx expo start --web
```

### Build estático para hospedar (HTML/JS)

Gera a pasta `web-build/` com `index.html` e bundles prontos para servir em qualquer host estático (Netlify, S3, IIS, etc.):

```bash
npm run build:web
```

Para testar localmente após o build:

```bash
npx serve web-build
```

## Mobile

```bash
npm run android
# ou
npm run ios
```

Requer ambiente Android Studio / Xcode conforme a plataforma.

## Contas de demonstração

| Usuário        | Senha    | Papel            |
|----------------|----------|------------------|
| `pcp.motor`    | `data2024` | Edição completa (tipo A) |
| `visualizador` | `data2024` | Somente leitura (tipo B) |

## Stack

- Expo SDK 55, React 19, TypeScript  
- React Navigation (native stack)  
- Zustand + AsyncStorage (sessão e dados locais)  
- **Web:** `react-dom`, `react-native-web`, bundler **Metro** (`app.json` → `web.bundler: "metro"`)

## Documentação adicional

- `docs/WEB.md` — detalhes de build e execução no navegador  
- Regras da Gestão LC final: `+5` dias (PCP) e `+15` dias (comercial) após a data limite de testes finais (`src/utils/gestaoLcFinal.ts`).

## Requisitos

- Node.js 18+ recomendado  
- Navegador atual (Chrome, Edge, Firefox) para Web  
