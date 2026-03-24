import { Link, useParams } from 'react-router-dom';

export function OsInexistentePage() {
  const { os } = useParams<{ os: string }>();

  return (
    <div className="flex min-h-[40vh] flex-col items-center justify-center text-center">
      <p className="text-6xl">🔍</p>
      <h1 className="mt-4 text-xl font-bold text-white">OS não encontrada</h1>
      <p className="mt-2 text-slate-400">
        Não há LC cadastrada para a OS <strong className="text-cyan-300">{os}</strong>.
      </p>
      <Link to="/gestao-lc-final" className="mt-6 text-cyan-400 hover:underline">
        Voltar à gestão LC final
      </Link>
    </div>
  );
}
