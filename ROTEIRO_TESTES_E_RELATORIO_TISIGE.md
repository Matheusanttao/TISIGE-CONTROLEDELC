# TISIGE - Roteiro de Testes e Modelo de Relatorio

Este arquivo foi feito para voce executar os testes finais do projeto e usar como base do relatorio/apresentacao.

## 1) Preparacao do ambiente

- Projeto Supabase correto no `.env`:
  - Web: `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`
  - Mobile: `EXPO_PUBLIC_SUPABASE_URL` e `EXPO_PUBLIC_SUPABASE_ANON_KEY`
- Migrations aplicadas na ordem:
  1. `supabase/migrations/20260324000000_initial_schema.sql`
  2. `supabase/migrations/20260325120000_approval_flow.sql`
  3. `supabase/migrations/20260326100000_admin_profiles_policy.sql`
- Conta admin criada no Auth:
  - Email: `admin@admin.local`
  - Senha: `admin`
  - Auto Confirm: ligado
- Rodar `supabase/seed_admin.sql`
- Rodar `supabase/seed_demo_print.sql`

## 2) Contas recomendadas para teste

Crie usuarios no Supabase Authentication -> Users:

- `admin@admin.local` / `admin`
- `desenho@demo.local` / `admin123`
- `aprovacao@demo.local` / `admin123`
- `pcp@demo.local` / `admin123`
- `gerencia@demo.local` / `admin123`
- `leitura@demo.local` / `admin123`

Depois, no menu **Usuarios** (logado como admin), configure:

- desenho: tipo `A`, papel `desenhista`
- aprovacao: tipo `A`, papel `aprovador`
- pcp: tipo `A`, papel `pcp`
- gerencia: tipo `A`, papel `gerencia`
- leitura: tipo `B`, papel `visualizador`

## 3) Roteiro de testes (com evidencias)

Para cada item abaixo, tire 1 print e marque OK.

### 3.1 Login e permissao

- [ ] Login com `admin` / `admin` funciona
- [ ] Menu lateral mostra **Usuarios** para admin
- [ ] Usuario nao-admin nao acessa `/admin/usuarios`

Print sugerido: home do admin com menu lateral visivel.

### 3.2 Cadastro de LC (Desenho)

- [ ] Login com `desenho@demo.local`
- [ ] Criar nova LC em `/controle-lc`
- [ ] LC aparece com status `rascunho`
- [ ] Enviar para aprovacao muda para `aguardando_aprovacao`

Print sugerido: formulario + card da LC criada.

### 3.3 Aprovacao Tecnica

- [ ] Login com `aprovacao@demo.local`
- [ ] Tela `/aprovacao` lista LCs aguardando
- [ ] Aprovar uma LC altera status para `aprovado`
- [ ] Reprovar uma LC exige motivo e muda para `reprovado`

Print sugerido: fila de aprovacao e detalhe com botoes aprovar/reprovar.

### 3.4 Notificacao para Desenho

- [ ] Ao reprovar, desenhista visualiza notificacao
- [ ] LC reprovada fica disponivel para correcao/reenvio

Print sugerido: notificacoes e status reprovado.

### 3.5 PCP Fabricacao

- [ ] Login com `pcp@demo.local`
- [ ] Tela `/pcp-fabricacao` mostra apenas aprovadas
- [ ] Marcacao `programado_fabricacao` funciona

Print sugerido: lista PCP com item marcado como programado.

### 3.6 Gerencia

- [ ] Login com `gerencia@demo.local`
- [ ] Dashboard `/gerencia` carrega metricas
- [ ] Filtros e contadores por status funcionando

Print sugerido: dashboard completo.

### 3.7 Gestao LC Final

- [ ] Tela de gestao final carrega e lista registros
- [ ] Campos de acompanhamento exibidos corretamente

Print sugerido: tela de gestao final.

## 4) Critrios de aceite final

Considere o projeto pronto quando:

- [ ] Fluxo ponta-a-ponta concluido: desenho -> aprovacao -> pcp -> gerencia
- [ ] Controle de permissao por papel funcionando
- [ ] Sem erro bloqueante no console durante teste principal
- [ ] Evidencias (prints) separadas por funcionalidade

## 5) Modelo rapido para relatorio/apresentacao

Copie e preencha:

### Tema

Sistema para controle e comunicacao entre Engenharia (Desenho), Aprovacao Tecnica e PCP, com rastreabilidade e organizacao do fluxo de desenhos tecnicos.

### Objetivo geral

Desenvolver um sistema informatizado para gerenciar desenhos tecnicos, integrando setores e reduzindo falhas de comunicacao.

### Objetivos especificos atendidos

1. Cadastro de desenhos tecnicos
2. Fluxo de aprovacao (aprovar/reprovar)
3. Sinalizacao visual de status
4. Consulta de aprovados no PCP
5. Marcacao de programacao para fabricacao
6. Acompanhamento gerencial em tempo real
7. Centralizacao das informacoes

### Tecnologias utilizadas

- Frontend Web: React + TypeScript + Vite
- Mobile: React Native (Expo)
- Backend/Banco/Auth: Supabase
- Seguranca: RLS (Row Level Security) por perfil

### Resultado obtido

O sistema integrou os setores de forma estruturada, com rastreabilidade do status dos desenhos e controle de acesso por perfil, melhorando visibilidade e organizacao do processo.

### Limites e trabalhos futuros

- Historico mais detalhado por usuario/acao
- Exportacao de relatorios (PDF/Excel)
- Notificacoes push em tempo real
- Indicadores adicionais no dashboard gerencial

## 6) Lista de prints recomendada (ordem para slides)

1. Tela de login
2. Home admin
3. Modulo Usuarios (definicao de papeis)
4. Controle LC (lista)
5. Formulario Nova LC
6. Fila de aprovacao
7. Reprovacao com motivo
8. PCP Fabricacao
9. Dashboard Gerencia
10. Gestao LC Final

