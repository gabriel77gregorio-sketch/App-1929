import React, { useState } from 'react';
import { useGame } from '../context/GameContext';
import { NewspaperArticle } from '../types/game';
import { Newspaper, Calendar, MapPin, Tag } from 'lucide-react';

export const NewspaperPage: React.FC = () => {
  const { articles } = useGame();
  const [selectedCategory, setSelectedCategory] = useState<string>('TODAS');

  const categories = ['TODAS', 'CIDADE', 'NEGÓCIOS', 'POLÍCIA', 'FAMÍLIAS', 'MERCADO'];

  const filteredArticles = selectedCategory === 'TODAS'
    ? articles
    : articles.filter(a => a.category === selectedCategory);

  const mainArticle = filteredArticles.length > 0 ? filteredArticles[0] : null;
  const secondaryArticles = filteredArticles.length > 1 ? filteredArticles.slice(1) : [];

  return (
    <div className="max-w-2xl mx-auto px-4 py-5 space-y-6 pb-24">
      {/* Folha de Jornal Antiga Impressa (Estilo Papel Envelhecido / Noir) */}
      <div className="bg-paper-100 text-noir-950 rounded-lg p-5 sm:p-7 shadow-2xl border-4 border-noir-900 font-serif relative">
        {/* Cabeçalho do Jornal Histórico */}
        <div className="border-b-4 border-noir-900 pb-3 mb-4 text-center">
          <div className="flex items-center justify-between text-[10px] font-mono uppercase tracking-widest text-noir-700 border-b border-noir-400 pb-1 mb-2">
            <span>Santa Augusta • Ano XIII</span>
            <span>Edição Diária Matutina</span>
            <span>Preço: 200 Réis</span>
          </div>

          <h1 className="font-display font-black text-3xl sm:text-5xl tracking-tight uppercase leading-none">
            Gazeta da Capital
          </h1>
          <p className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-bold text-noir-800 mt-1">
            O Maior e Mais Antigo Diário das Forças Vivas do Estado
          </p>

          <div className="flex items-center justify-between text-[9px] sm:text-[10px] font-mono text-noir-600 border-t border-noir-400 pt-1 mt-2">
            <span>Diretor-Redator: Dr. Arnaldo Peixoto</span>
            <span>Noticiário Geral, Finanças e Crônica Policial</span>
          </div>
        </div>

        {/* Filtros de Seção do Jornal */}
        <div className="flex items-center gap-1 overflow-x-auto pb-2 border-b-2 border-noir-900 mb-4 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-0.5 rounded text-[10px] font-mono uppercase font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-noir-900 text-paper-100'
                  : 'bg-paper-200 text-noir-800 hover:bg-paper-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Manchete Principal de Capa */}
        {mainArticle ? (
          <div className="mb-6 pb-6 border-b-2 border-noir-400">
            <div className="flex items-center gap-2 text-[10px] font-mono uppercase font-bold text-blood-800 mb-1">
              <Tag className="w-3 h-3" />
              <span>{mainArticle.category}</span>
              {mainArticle.district_name && (
                <span>• {mainArticle.district_name}</span>
              )}
            </div>

            <h2 className="font-serif font-black text-xl sm:text-2xl md:text-3xl leading-tight uppercase tracking-tight mb-2">
              {mainArticle.headline}
            </h2>

            <p className="italic text-xs sm:text-sm font-semibold text-noir-800 mb-3 border-l-2 border-blood-800 pl-3">
              {mainArticle.subheadline}
            </p>

            <div className="text-xs sm:text-sm leading-relaxed text-noir-900 columns-1 sm:columns-2 gap-4 text-justify">
              <p>
                {mainArticle.content}
              </p>
            </div>
          </div>
        ) : (
          <p className="text-xs italic text-center py-6">
            Nenhuma reportagem arquivada nesta categoria.
          </p>
        )}

        {/* Notícias Secundárias e Notas da Cidade */}
        {secondaryArticles.length > 0 && (
          <div className="space-y-4">
            <h3 className="font-display font-bold text-xs uppercase tracking-widest border-b border-noir-900 pb-1">
              Outras Ocorrências Registradas
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {secondaryArticles.map((art) => (
                <div key={art.id} className="p-3 bg-paper-50 rounded border border-noir-300 space-y-1 text-justify">
                  <div className="flex items-center justify-between text-[9px] font-mono text-noir-600">
                    <span className="font-bold text-blood-800">{art.category}</span>
                    <span>Ed. #{art.edition_number}</span>
                  </div>
                  <h4 className="font-serif font-bold text-sm leading-snug">
                    {art.headline}
                  </h4>
                  <p className="text-[11px] text-noir-800 leading-normal line-clamp-3">
                    {art.content}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
