-- Dados de exemplo (opcional)
-- Execute no SQL Editor com role de serviço / “Run as postgres” para ignorar RLS,
-- ou desative RLS temporariamente só para este insert (não recomendado em produção).

insert into public.controle_lc (
  arquivo, os, cliente, equipamento,
  dt_contratual, dt_recebimento, dt_retirada, resp_retirada, setor, gaveta,
  data_limite_testes, gestao_finalizado
) values
  (
    'LC-001', '17242', 'Cliente Alpha', 'Motor 450kW',
    '2024-02-01', '2024-02-10', '2024-03-01', 'João Silva', 'Teste', 'G-12',
    '2024-03-28', false
  ),
  (
    'LC-002', '17232', 'Cliente Beta', 'Gerador 300kVA',
    '2024-02-15', '2024-03-01', null, '', 'Mecânica', null,
    '2024-03-15', false
  )
on conflict (os) do nothing;
