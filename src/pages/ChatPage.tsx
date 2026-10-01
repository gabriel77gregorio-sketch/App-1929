import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useGame } from '../context/GameContext';
import { chatService } from '../services/chatService';
import { ChatMessage, CharacterStyle } from '../types/game';
import {
  MessageCircle, Send, Zap, Users, Lock, Gift,
  ChevronDown, Crown, Shield, Skull, Briefcase,
  X
} from 'lucide-react';

// =============================================================================
// CONSTANTES & UTILIDADES
// =============================================================================

/** Cores de destaque por estilo de personagem */
const STYLE_CONFIG: Record<CharacterStyle, { color: string; border: string; icon: React.ElementType; label: string }> = {
  negociador:     { color: 'text-gold-400',     border: 'border-gold-500/40',    icon: Briefcase, label: 'Negociador' },
  contrabandista: { color: 'text-green-400',    border: 'border-green-500/40',   icon: Skull,     label: 'Contrabandista' },
  executor:       { color: 'text-red-400',      border: 'border-red-500/40',     icon: Shield,    label: 'Executor' },
  empresario:     { color: 'text-blue-400',     border: 'border-blue-500/40',    icon: Crown,     label: 'Empresário' },
};

/** Frases rápidas temáticas (estilo Clash Royale) */
const QUICK_PHRASES = [
  { emoji: '🥃', text: 'Saúde, companheiros!' },
  { emoji: '🤝', text: 'Negócio fechado!' },
  { emoji: '🚨', text: 'Cuidado com a polícia!' },
  { emoji: '💰', text: 'Quem quer sociedade?' },
  { emoji: '🎩', text: 'Respeito.' },
  { emoji: '⚔️', text: 'Briga à vista no beco!' },
  { emoji: '📈', text: 'Café tá subindo, hora de comprar!' },
  { emoji: '📰', text: 'Viram a Gazeta de hoje?' },
  { emoji: '🏛️', text: 'Alguém recrutando pra família?' },
  { emoji: '🔥', text: 'Santa Augusta nunca dorme!' },
];

/** Formata timestamp relativo */
function formatRelativeTime(dateStr: string): string {
  const diffSec = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (diffSec < 30) return 'agora';
  if (diffSec < 60) return `${diffSec}s`;
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}min`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h`;
  return `${Math.floor(diffSec / 86400)}d`;
}

/** Gera as iniciais para o avatar */
function getAvatarInitials(nickname: string): string {
  return nickname.charAt(0).toUpperCase();
}

// =============================================================================
// COMPONENTES INTERNOS
// =============================================================================

/** Bolha individual de mensagem */
const ChatBubble: React.FC<{
  msg: ChatMessage;
  isOwn: boolean;
}> = ({ msg, isOwn }) => {
  const style = STYLE_CONFIG[msg.character_style] || STYLE_CONFIG.negociador;

  // Mensagem de sistema
  if (msg.message_type === 'system') {
    return (
      <div className="flex justify-center my-2 animate-fadeIn">
        <div className="bg-noir-850 border border-gold-500/20 rounded-lg px-4 py-2 max-w-[90%]">
          <p className="text-gold-400/80 text-xs text-center italic leading-relaxed">
            {msg.content}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2.5 mb-3 animate-fadeIn ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div
        className={`w-9 h-9 rounded-lg shrink-0 flex items-center justify-center text-sm font-bold border ${style.border} ${
          isOwn ? 'bg-gold-500/20 text-gold-400' : 'bg-noir-800 text-noir-300'
        }`}
      >
        {getAvatarInitials(msg.character_nickname)}
      </div>

      {/* Conteúdo */}
      <div className={`flex flex-col max-w-[75%] ${isOwn ? 'items-end' : 'items-start'}`}>
        {/* Header: Tag + Nome + Level + Tempo */}
        <div className={`flex items-center gap-1.5 mb-0.5 ${isOwn ? 'flex-row-reverse' : 'flex-row'}`}>
          {/* Tag da família */}
          {msg.family_tag && (
            <span className="text-[9px] font-black bg-gold-500/20 text-gold-400 px-1.5 py-0.5 rounded tracking-wider">
              [{msg.family_tag}]
            </span>
          )}

          {/* Nickname */}
          <span className={`text-xs font-semibold ${isOwn ? 'text-gold-400' : style.color}`}>
            {msg.character_nickname}
          </span>

          {/* Level badge */}
          {msg.character_level > 0 && (
            <span className="text-[9px] text-noir-500 font-mono">
              Nv.{msg.character_level}
            </span>
          )}

          {/* Timestamp */}
          <span className="text-[9px] text-noir-600">
            {formatRelativeTime(msg.created_at)}
          </span>
        </div>

        {/* Corpo da mensagem */}
        <div
          className={`px-3 py-2 rounded-xl text-sm leading-relaxed ${
            isOwn
              ? 'bg-gold-500/15 text-paper-100 rounded-tr-sm border border-gold-500/20'
              : 'bg-noir-850 text-paper-200 rounded-tl-sm border border-noir-700'
          }`}
        >
          {msg.content}
        </div>
      </div>
    </div>
  );
};

/** Banner de incentivo à primeira mensagem */
const FirstMessageBanner: React.FC<{ onDismiss: () => void }> = ({ onDismiss }) => (
  <div className="mx-3 mt-2 mb-1 bg-gradient-to-r from-gold-500/15 to-gold-500/5 border border-gold-500/30 rounded-lg p-3 flex items-center gap-3 animate-fadeIn">
    <div className="w-10 h-10 rounded-full bg-gold-500/20 flex items-center justify-center shrink-0">
      <Gift className="w-5 h-5 text-gold-400" />
    </div>
    <div className="flex-1 min-w-0">
      <p className="text-xs font-semibold text-gold-300">Envie seu primeiro telegrama!</p>
      <p className="text-[10px] text-noir-400 mt-0.5">
        Ganhe <span className="text-gold-400 font-bold">$200 réis</span> e{' '}
        <span className="text-gold-400 font-bold">+2 Respeito</span> ao participar.
      </p>
    </div>
    <button onClick={onDismiss} className="text-noir-600 hover:text-noir-400 p-1">
      <X className="w-3.5 h-3.5" />
    </button>
  </div>
);

/** Indicador de "scroll para novas mensagens" */
const NewMessagesIndicator: React.FC<{ count: number; onClick: () => void }> = ({ count, onClick }) => (
  <button
    onClick={onClick}
    className="absolute bottom-2 left-1/2 -translate-x-1/2 z-10 bg-gold-500 text-noir-950 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 animate-bounce hover:bg-gold-400 transition-colors"
  >
    <ChevronDown className="w-3.5 h-3.5" />
    {count} nova{count > 1 ? 's' : ''}
  </button>
);

// =============================================================================
// COMPONENTE PRINCIPAL: ChatPage
// =============================================================================

export const ChatPage: React.FC = () => {
  const { character, notify } = useGame();

  // Estado do chat
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [channel, setChannel] = useState('geral');
  const [isLoading, setIsLoading] = useState(true);
  const [showQuickPhrases, setShowQuickPhrases] = useState(false);
  const [newMsgCount, setNewMsgCount] = useState(0);
  const [isAtBottom, setIsAtBottom] = useState(true);
  const [isSending, setIsSending] = useState(false);
  const [showFirstBanner, setShowFirstBanner] = useState(() => chatService.isFirstMessage());
  const [onlineCount, setOnlineCount] = useState(() => chatService.getOnlineCount());

  // Refs
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const hasFamilyChannel = Boolean(character?.family_id);
  const familyChannel = character?.family_id ? `familia_${character.family_id}` : '';

  // -------------------------------------------------------------------------
  // Carrega mensagens e ativa Realtime
  // -------------------------------------------------------------------------
  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      setIsLoading(true);
      const msgs = await chatService.loadRecentMessages(channel);
      if (isMounted) {
        setMessages(msgs);
        setIsLoading(false);
        // Scroll para o final após carregar
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
        }, 50);
      }
    };

    init();

    // Inscreve no canal para mensagens em tempo real
    chatService.subscribeToChannel(channel, (newMsg) => {
      if (!isMounted) return;
      setMessages(prev => [...prev, newMsg]);

      // Se não está no final, incrementa badge de novas mensagens
      if (!isAtBottom) {
        setNewMsgCount(prev => prev + 1);
      }
    });

    return () => {
      isMounted = false;
      chatService.unsubscribe();
    };
  }, [channel]); // eslint-disable-line react-hooks/exhaustive-deps

  // -------------------------------------------------------------------------
  // Auto-scroll quando está no fundo
  // -------------------------------------------------------------------------
  useEffect(() => {
    if (isAtBottom && messages.length > 0) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages.length, isAtBottom]);

  // -------------------------------------------------------------------------
  // Atualiza contagem online periodicamente
  // -------------------------------------------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      setOnlineCount(chatService.refreshOnlineCount());
    }, 30000); // a cada 30s
    return () => clearInterval(timer);
  }, []);

  // -------------------------------------------------------------------------
  // Detecta scroll para controlar auto-scroll e badge
  // -------------------------------------------------------------------------
  const handleScroll = useCallback(() => {
    const container = chatContainerRef.current;
    if (!container) return;

    const threshold = 80; // px
    const atBottom = container.scrollHeight - container.scrollTop - container.clientHeight < threshold;
    setIsAtBottom(atBottom);

    if (atBottom) {
      setNewMsgCount(0);
    }
  }, []);

  // -------------------------------------------------------------------------
  // Scroll para o final (botão "novas mensagens")
  // -------------------------------------------------------------------------
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setNewMsgCount(0);
    setIsAtBottom(true);
  }, []);

  // -------------------------------------------------------------------------
  // Enviar mensagem
  // -------------------------------------------------------------------------
  const handleSend = useCallback(async (overrideText?: string) => {
    const text = (overrideText || input).trim();
    if (!text || !character || isSending) return;

    setIsSending(true);

    // Recompensa da primeira mensagem
    const wasFirst = chatService.isFirstMessage();

    const sent = await chatService.sendMessage(character, text, channel);

    if (sent) {
      if (!overrideText) setInput('');
      setIsAtBottom(true);

      // Scroll pro final
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);

      // Primeira mensagem? Dá reward!
      if (wasFirst) {
        chatService.markFirstMessageSent();
        setShowFirstBanner(false);
        notify('📢 Sua voz ecoa pelos becos! Bônus: +$200 réis, +2 Respeito!', 'success');
      }
    }

    setIsSending(false);
    inputRef.current?.focus();
  }, [input, character, channel, isSending, notify]);

  // -------------------------------------------------------------------------
  // Enviar frase rápida
  // -------------------------------------------------------------------------
  const handleQuickPhrase = useCallback((phrase: string) => {
    handleSend(phrase);
    setShowQuickPhrases(false);
  }, [handleSend]);

  // -------------------------------------------------------------------------
  // Troca de canal
  // -------------------------------------------------------------------------
  const switchChannel = useCallback((ch: string) => {
    if (ch === channel) return;
    setMessages([]);
    setNewMsgCount(0);
    setChannel(ch);
  }, [channel]);

  // -------------------------------------------------------------------------
  // Enter para enviar
  // -------------------------------------------------------------------------
  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  }, [handleSend]);

  if (!character) return null;

  const charCount = input.length;
  const isNearLimit = charCount > 240;
  const isAtLimit = charCount >= 280;

  return (
    <div className="max-w-2xl mx-auto flex flex-col h-[calc(100vh-120px)]">
      {/* ================================================================= */}
      {/* HEADER: "A Boca" */}
      {/* ================================================================= */}
      <div className="px-4 pt-3 pb-2 border-b border-noir-800 bg-noir-950/80 backdrop-blur-sm">
        {/* Título + Online */}
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gold-500/15 border border-gold-500/30 flex items-center justify-center">
              <MessageCircle className="w-4 h-4 text-gold-400" />
            </div>
            <div>
              <h1 className="font-display text-sm text-gold-400 font-bold tracking-wide leading-none">
                A BOCA
              </h1>
              <p className="text-[10px] text-noir-500 italic">Telegrama do Submundo</p>
            </div>
          </div>

          {/* Online Count */}
          <div className="flex items-center gap-1.5 bg-noir-900 rounded-full px-2.5 py-1 border border-noir-800">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            <Users className="w-3 h-3 text-noir-500" />
            <span className="text-[10px] text-noir-400 font-mono">{onlineCount}</span>
          </div>
        </div>

        {/* Tabs de Canal */}
        <div className="flex gap-1">
          <button
            onClick={() => switchChannel('geral')}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all ${
              channel === 'geral'
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'text-noir-500 hover:text-noir-300 border border-transparent'
            }`}
          >
            🏛️ Geral
          </button>
          <button
            onClick={() => hasFamilyChannel ? switchChannel(familyChannel) : undefined}
            disabled={!hasFamilyChannel}
            className={`flex-1 py-1.5 rounded-md text-xs font-semibold transition-all flex items-center justify-center gap-1 ${
              channel === familyChannel
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : hasFamilyChannel
                  ? 'text-noir-500 hover:text-noir-300 border border-transparent'
                  : 'text-noir-700 border border-transparent cursor-not-allowed'
            }`}
          >
            {!hasFamilyChannel && <Lock className="w-3 h-3" />}
            👥 Família
          </button>
        </div>
      </div>

      {/* ================================================================= */}
      {/* BANNER: Primeira Mensagem (Incentivo) */}
      {/* ================================================================= */}
      {showFirstBanner && (
        <FirstMessageBanner onDismiss={() => setShowFirstBanner(false)} />
      )}

      {/* ================================================================= */}
      {/* ÁREA DE MENSAGENS */}
      {/* ================================================================= */}
      <div
        ref={chatContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto px-3 py-3 relative scroll-smooth"
        style={{ overscrollBehavior: 'contain' }}
      >
        {/* Loading */}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="w-8 h-8 border-2 border-gold-500/30 border-t-gold-400 rounded-full animate-spin" />
            <p className="text-xs text-noir-500 italic">Sintonizando telegramas...</p>
          </div>
        )}

        {/* Empty state */}
        {!isLoading && messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-16 gap-3 text-center">
            <div className="w-14 h-14 rounded-full bg-noir-900 border border-noir-750 flex items-center justify-center">
              <MessageCircle className="w-7 h-7 text-noir-600" />
            </div>
            <p className="text-sm text-noir-500">O silêncio é dourado...</p>
            <p className="text-xs text-noir-600">Mas alguém precisa quebrar o gelo. Seja o primeiro!</p>
          </div>
        )}

        {/* Mensagens */}
        {!isLoading && messages.map((msg) => (
          <ChatBubble
            key={msg.id}
            msg={msg}
            isOwn={msg.character_id === character.id}
          />
        ))}

        {/* Scroll anchor */}
        <div ref={messagesEndRef} />

        {/* Indicador de novas mensagens */}
        {newMsgCount > 0 && !isAtBottom && (
          <NewMessagesIndicator count={newMsgCount} onClick={scrollToBottom} />
        )}
      </div>

      {/* ================================================================= */}
      {/* FRASES RÁPIDAS (expandível) */}
      {/* ================================================================= */}
      {showQuickPhrases && (
        <div className="border-t border-noir-800 bg-noir-900/95 backdrop-blur-sm px-3 py-2 animate-fadeIn">
          <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
            {QUICK_PHRASES.map((phrase, i) => (
              <button
                key={i}
                onClick={() => handleQuickPhrase(`${phrase.emoji} ${phrase.text}`)}
                className="shrink-0 bg-noir-800 hover:bg-noir-700 text-paper-200 text-[11px] px-2.5 py-1.5 rounded-lg border border-noir-700 hover:border-gold-500/30 transition-all whitespace-nowrap active:scale-95"
              >
                {phrase.emoji} {phrase.text}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* ================================================================= */}
      {/* INPUT: Enviar Telegrama */}
      {/* ================================================================= */}
      <div className="border-t border-noir-800 bg-noir-950/95 backdrop-blur-sm px-3 py-2.5">
        <div className="flex items-center gap-2">
          {/* Botão de frases rápidas */}
          <button
            onClick={() => setShowQuickPhrases(!showQuickPhrases)}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0 ${
              showQuickPhrases
                ? 'bg-gold-500/20 text-gold-400 border border-gold-500/30'
                : 'bg-noir-900 text-noir-500 hover:text-gold-400 border border-noir-800 hover:border-gold-500/30'
            }`}
            title="Frases rápidas"
          >
            <Zap className="w-4 h-4" />
          </button>

          {/* Campo de texto */}
          <div className="flex-1 relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={e => setInput(e.target.value.slice(0, 280))}
              onKeyDown={handleKeyDown}
              placeholder="Escreva um telegrama..."
              maxLength={280}
              className="w-full bg-noir-900 text-paper-100 text-sm placeholder-noir-600 rounded-xl px-4 py-2.5 pr-12 border border-noir-750 focus:border-gold-500/40 focus:outline-none focus:ring-1 focus:ring-gold-500/20 transition-all"
            />
            {/* Contador de caracteres */}
            {charCount > 0 && (
              <span
                className={`absolute right-3 top-1/2 -translate-y-1/2 text-[9px] font-mono ${
                  isAtLimit ? 'text-red-400' : isNearLimit ? 'text-gold-500' : 'text-noir-600'
                }`}
              >
                {charCount}/280
              </span>
            )}
          </div>

          {/* Botão enviar */}
          <button
            onClick={() => handleSend()}
            disabled={!input.trim() || isSending}
            className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all shrink-0 ${
              input.trim()
                ? 'bg-gold-500 text-noir-950 hover:bg-gold-400 active:scale-95 shadow-gold-subtle'
                : 'bg-noir-900 text-noir-700 border border-noir-800 cursor-not-allowed'
            }`}
            title="Enviar"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
