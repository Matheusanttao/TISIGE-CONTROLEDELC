-- Fluxo de aprovação técnica + PCP (programação de fabricação)

alter table public.controle_lc
  add column if not exists status_aprovacao text not null default 'rascunho'
    check (status_aprovacao in (
      'rascunho',
      'aguardando_aprovacao',
      'aprovado',
      'reprovado'
    ));

alter table public.controle_lc
  add column if not exists motivo_reprovacao text;

alter table public.controle_lc
  add column if not exists aprovado_em timestamptz;

alter table public.controle_lc
  add column if not exists reprovado_em timestamptz;

alter table public.controle_lc
  add column if not exists aprovador_nome text;

alter table public.controle_lc
  add column if not exists programado_fabricacao boolean not null default false;

comment on column public.controle_lc.status_aprovacao is 'Fluxo: rascunho → aguardando → aprovado/reprovado';
comment on column public.controle_lc.programado_fabricacao is 'PCP: marcado após aprovação';

alter table public.profiles
  add column if not exists papel text default 'desenhista';

comment on column public.profiles.papel is 'desenhista | aprovador | pcp | gerencia | visualizador';
