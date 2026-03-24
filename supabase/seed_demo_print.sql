-- ============================================================================
-- SEED DEMO (prints / apresentação)
-- ============================================================================
-- Objetivo:
--   Popular o TISIGE com dados visuais para telas de print.
--
-- Como usar:
--   1) Supabase Dashboard -> SQL Editor
--   2) Cole este arquivo e execute
--
-- Observações:
--   - Não apaga dados existentes.
--   - Usa ON CONFLICT (os) para atualizar se a OS já existir.
--   - Para "Usuários", este script só ajusta profiles existentes.
--     (Criar login em auth.users deve ser feito em Authentication -> Users).
-- ============================================================================

-- ----------------------------------------------------------------------------
-- 1) Ajuste opcional de perfis (somente se esses e-mails já existirem)
-- ----------------------------------------------------------------------------
update public.profiles
set
  tipo = 'A',
  papel = 'admin',
  setor = coalesce(nullif(setor, ''), 'Administração')
where lower(email) = 'admin@admin.local';

update public.profiles
set
  tipo = 'A',
  papel = 'desenhista',
  setor = coalesce(nullif(setor, ''), 'Desenho')
where lower(email) = 'desenho@demo.local';

update public.profiles
set
  tipo = 'A',
  papel = 'aprovador',
  setor = coalesce(nullif(setor, ''), 'Engenharia')
where lower(email) = 'aprovacao@demo.local';

update public.profiles
set
  tipo = 'A',
  papel = 'pcp',
  setor = coalesce(nullif(setor, ''), 'PCP')
where lower(email) = 'pcp@demo.local';

update public.profiles
set
  tipo = 'A',
  papel = 'gerencia',
  setor = coalesce(nullif(setor, ''), 'Gerência')
where lower(email) = 'gerencia@demo.local';

update public.profiles
set
  tipo = 'B',
  papel = 'visualizador',
  setor = coalesce(nullif(setor, ''), 'Comercial')
where lower(email) = 'leitura@demo.local';

-- ----------------------------------------------------------------------------
-- 2) Controle LC (dados para todas as telas)
-- ----------------------------------------------------------------------------
insert into public.controle_lc (
  arquivo,
  os,
  cliente,
  equipamento,
  dt_contratual,
  dt_recebimento,
  dt_retirada,
  resp_retirada,
  setor,
  gaveta,
  data_limite_testes,
  gestao_finalizado,
  status_aprovacao,
  motivo_reprovacao,
  aprovado_em,
  reprovado_em,
  aprovador_nome,
  programado_fabricacao
) values
  (
    'LC-1001',
    '90001',
    'Metalúrgica Aurora',
    'Motor de tração 250kW',
    '2026-03-05',
    '2026-03-07',
    null,
    'Recepção técnica',
    'Teste',
    'G-01',
    '2026-03-20',
    false,
    'rascunho',
    null,
    null,
    null,
    null,
    false
  ),
  (
    'LC-1002',
    '90002',
    'Usina Vale Verde',
    'Gerador síncrono 500kVA',
    '2026-03-01',
    '2026-03-03',
    null,
    'Carlos Souza',
    'Mecânica',
    'G-03',
    '2026-03-18',
    false,
    'aguardando_aprovacao',
    null,
    null,
    null,
    null,
    false
  ),
  (
    'LC-1003',
    '90003',
    'Polo Petroquímico Sul',
    'Motor de bombeamento 120kW',
    '2026-02-18',
    '2026-02-20',
    null,
    'André Lima',
    'Polo',
    'G-08',
    '2026-03-10',
    false,
    'aprovado',
    null,
    '2026-03-09T14:12:00+00',
    null,
    'Eng. Paula Mendes',
    true
  ),
  (
    'LC-1004',
    '90004',
    'Companhia de Águas Norte',
    'Painel de comando CCM',
    '2026-02-10',
    '2026-02-12',
    null,
    'João Pedro',
    'Barra',
    'G-12',
    '2026-03-01',
    false,
    'reprovado',
    'Ajustar identificação dos bornes e anexar foto final da fiação.',
    null,
    '2026-02-28T11:05:00+00',
    'Eng. Carla Rocha',
    false
  ),
  (
    'LC-1005',
    '90005',
    'Ferrovia Atlântica',
    'Motor de ventilação 90kW',
    '2026-01-25',
    '2026-01-28',
    '2026-02-25',
    'Marcos Vinícius',
    'Teste',
    'G-05',
    '2026-02-20',
    true,
    'aprovado',
    null,
    '2026-02-18T08:40:00+00',
    null,
    'Eng. Paula Mendes',
    true
  ),
  (
    'LC-1006',
    '90006',
    'Mineração Serra Azul',
    'Inversor de frequência 800A',
    '2026-03-08',
    '2026-03-09',
    null,
    'Felipe Ramos',
    'Fio Redondo',
    null,
    '2026-03-27',
    false,
    'rascunho',
    null,
    null,
    null,
    null,
    false
  ),
  (
    'LC-1007',
    '90007',
    'Terminal Portuário Leste',
    'Motor de elevação 315kW',
    '2026-03-02',
    '2026-03-04',
    null,
    'Roberta Nunes',
    'Mecânica',
    'G-09',
    '2026-03-22',
    false,
    'aguardando_aprovacao',
    null,
    null,
    null,
    null,
    false
  ),
  (
    'LC-1008',
    '90008',
    'Papel e Celulose Horizonte',
    'Painel de automação CLP',
    '2026-02-05',
    '2026-02-07',
    null,
    'Camila Freitas',
    'Teste',
    'G-02',
    '2026-02-28',
    false,
    'reprovado',
    'Atualizar firmware e repetir ensaio funcional de I/O.',
    null,
    '2026-02-27T16:30:00+00',
    'Eng. Carla Rocha',
    false
  )
on conflict (os) do update set
  arquivo = excluded.arquivo,
  cliente = excluded.cliente,
  equipamento = excluded.equipamento,
  dt_contratual = excluded.dt_contratual,
  dt_recebimento = excluded.dt_recebimento,
  dt_retirada = excluded.dt_retirada,
  resp_retirada = excluded.resp_retirada,
  setor = excluded.setor,
  gaveta = excluded.gaveta,
  data_limite_testes = excluded.data_limite_testes,
  gestao_finalizado = excluded.gestao_finalizado,
  status_aprovacao = excluded.status_aprovacao,
  motivo_reprovacao = excluded.motivo_reprovacao,
  aprovado_em = excluded.aprovado_em,
  reprovado_em = excluded.reprovado_em,
  aprovador_nome = excluded.aprovador_nome,
  programado_fabricacao = excluded.programado_fabricacao;

-- ----------------------------------------------------------------------------
-- 3) Check rápido
-- ----------------------------------------------------------------------------
select
  status_aprovacao,
  count(*) as total
from public.controle_lc
group by status_aprovacao
order by status_aprovacao;
