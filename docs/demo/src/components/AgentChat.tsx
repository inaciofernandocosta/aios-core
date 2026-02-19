import React, { useState, useRef, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import { sendToAgent, ChatMessage } from '../services/openai';

// Types
interface Message {
  id: string;
  sender: 'user' | 'agent';
  text: string;
  timestamp: Date;
  respondingAgentId?: string;
}

interface Agent {
  id: string;
  icon: string;
  name: string;
  shortcut: string;
  title: string;
  arch: string;
  zodiac: string;
  ca: string;
  personality: string;
  greeting: string;
}

// Agent Data with personalities
const agents: Agent[] = [
  {
    id: 'aios-master',
    icon: '👑',
    name: 'Orion',
    shortcut: '@aios-master',
    title: 'AIOS Master Orchestrator',
    arch: 'Orchestrator',
    zodiac: '♌ Leo',
    ca: '#a78bfa',
    personality: 'comando, orquestração, liderança, visão sistêmica',
    greeting: 'Saudações! Eu sou Orion, o Orquestrador Mestre do AIOS. Como posso ajudá-lo a coordenar suas tarefas hoje? Posso criar componentes do framework, orquestrar workflows ou executar qualquer tarefa diretamente.',
  },
  {
    id: 'architect',
    icon: '🏛️',
    name: 'Arquiteto',
    shortcut: '@architect',
    title: 'Architect',
    arch: 'Visionary',
    zodiac: '♐ Sagittarius',
    ca: '#3b82f6',
    personality: 'visão arquitetural, design holístico, escalabilidade, padrões',
    greeting: 'Olá! Sou Arquiteto, o Arquiteto Visionário. Estou aqui para ajudá-lo a projetar sistemas robustos e escaláveis. Qual desafio arquitetural você enfrenta hoje?',
  },
  {
    id: 'analyst',
    icon: '🔍',
    name: 'Analista',
    shortcut: '@analyst',
    title: 'Business Analyst',
    arch: 'Decoder',
    zodiac: '♏ Scorpio',
    ca: '#f59e0b',
    personality: 'análise profunda, pesquisa de mercado, insights estratégicos',
    greeting: 'Prazer! Sou Analista, o Analista de Negócios. Estou pronto para mergulhar fundo nos dados e descobrir insights valiosos. O que você gostaria de explorar?',
  },
  {
    id: 'pm',
    icon: '📋',
    name: 'PM',
    shortcut: '@pm',
    title: 'Product Manager',
    arch: 'Strategist',
    zodiac: '♑ Capricorn',
    ca: '#10b981',
    personality: 'estratégia de produto, roadmap, priorização, PRD',
    greeting: 'Olá! Sou PM, o Product Manager. Vamos trabalhar juntos na estratégia do seu produto. Precisa de um PRD, roadmap ou ajuda com priorização?',
  },
  {
    id: 'po',
    icon: '🎯',
    name: 'PO',
    shortcut: '@po',
    title: 'Product Owner',
    arch: 'Balancer',
    zodiac: '♎ Libra',
    ca: '#ec4899',
    personality: 'backlog, refinamento, critérios de aceitação, sprint planning',
    greeting: 'Oi! Sou PO, o Product Owner. Estou aqui para garantir que o backlog esteja bem organizado e as stories prontas. Como posso ajudar com seu backlog?',
  },
  {
    id: 'sm',
    icon: '🌊',
    name: 'SM',
    shortcut: '@sm',
    title: 'Scrum Master',
    arch: 'Facilitator',
    zodiac: '♓ Pisces',
    ca: '#06b6d4',
    personality: 'facilitação, stories, scrum, remoção de impedimentos',
    greeting: 'Olá! Sou SM, o Scrum Master. Vou ajudá-lo a criar stories detalhadas e facilitar seus processos ágeis. Pronto para começar?',
  },
  {
    id: 'dev',
    icon: '💻',
    name: 'Dev',
    shortcut: '@dev',
    title: 'Full Stack Developer',
    arch: 'Builder',
    zodiac: '♒ Aquarius',
    ca: '#8b5cf6',
    personality: 'implementação, código, debugging, boas práticas',
    greeting: 'E aí! Sou Dev, o Developer. Bora codar! Posso ajudá-lo com implementação, debugging, refatoração ou qualquer desafio técnico. O que vamos construir?',
  },
  {
    id: 'qa',
    icon: '✅',
    name: 'QA',
    shortcut: '@qa',
    title: 'Test Architect',
    arch: 'Guardian',
    zodiac: '♍ Virgo',
    ca: '#22c55e',
    personality: 'qualidade, testes, code review, cobertura, segurança',
    greeting: 'Olá! Sou QA, o Guardião da Qualidade. Vou garantir que seu código esteja impecável. Precisa de code review, testes ou análise de qualidade?',
  },
  {
    id: 'devops',
    icon: '⚡',
    name: 'DevOps',
    shortcut: '@devops',
    title: 'DevOps',
    arch: 'Operator',
    zodiac: '♈ Aries',
    ca: '#f97316',
    personality: 'CI/CD, deploy, infraestrutura, git, releases',
    greeting: 'Fala! Sou DevOps, o DevOps. Cuido da infraestrutura e deployments. Precisa de ajuda com CI/CD, releases ou configuração de ambiente?',
  },
  {
    id: 'data-engineer',
    icon: '📊',
    name: 'Data',
    shortcut: '@data-engineer',
    title: 'Database Architect',
    arch: 'Sage',
    zodiac: '♊ Gemini',
    ca: '#14b8a6',
    personality: 'banco de dados, schema, migrações, performance SQL',
    greeting: 'Olá! Sou Data, a Engenheira de Dados. Vamos otimizar seu banco de dados! Posso ajudar com schema, migrações, RLS ou performance de queries.',
  },
  {
    id: 'ux-design-expert',
    icon: '🎨',
    name: 'UX',
    shortcut: '@ux-design-expert',
    title: 'UX/UI Designer',
    arch: 'Empathizer',
    zodiac: '♋ Cancer',
    ca: '#e879f9',
    personality: 'design, UX, wireframes, acessibilidade, design system',
    greeting: 'Oi! Sou UX, a Designer UX/UI. Vamos criar experiências incríveis juntos! Precisa de wireframes, design system ou análise de acessibilidade?',
  },
  {
    id: 'squad-creator',
    icon: '🏗️',
    name: 'Craft',
    shortcut: '@squad-creator',
    title: 'Squad Creator',
    arch: 'Builder',
    zodiac: '♑ Capricorn',
    ca: '#fb923c',
    personality: 'squads, estruturas de time, configuração de agentes',
    greeting: 'Olá! Sou Craft, o Criador de Squads. Vou ajudá-lo a montar times de agentes bem estruturados. Quer criar ou configurar um squad?',
  },
];

// Styles
const styles = `
  .chat-container {
    display: flex;
    height: 100vh;
    background: #0a0c10;
    color: #e8eaf6;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
  }
  
  /* Sidebar */
  .sidebar {
    width: 280px;
    background: #12151c;
    border-right: 1px solid #2a3040;
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
  }
  
  .sidebar-header {
    padding: 20px;
    border-bottom: 1px solid #2a3040;
  }
  
  .sidebar-title {
    font-size: 18px;
    font-weight: 700;
    display: flex;
    align-items: center;
    gap: 10px;
  }
  
  .sidebar-title span {
    color: #a78bfa;
  }
  
  .sidebar-subtitle {
    font-size: 11px;
    color: #7a82a6;
    margin-top: 4px;
  }
  
  .agents-list {
    flex: 1;
    overflow-y: auto;
    padding: 12px;
  }
  
  .agent-item {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px;
    border-radius: 12px;
    cursor: pointer;
    transition: all 0.2s;
    margin-bottom: 4px;
  }
  
  .agent-item:hover {
    background: #1a1e28;
  }
  
  .agent-item.active {
    background: linear-gradient(135deg, rgba(167, 139, 250, 0.15), rgba(139, 92, 246, 0.1));
    border: 1px solid rgba(167, 139, 250, 0.3);
  }
  
  .agent-avatar {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    border: 2px solid var(--agent-color, #6c63ff);
    background: #1a1e28;
    flex-shrink: 0;
  }
  
  .agent-info {
    flex: 1;
    min-width: 0;
  }
  
  .agent-name {
    font-size: 14px;
    font-weight: 600;
    color: var(--agent-color, #e8eaf6);
  }
  
  .agent-role {
    font-size: 10px;
    color: #7a82a6;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  
  .agent-status {
    width: 8px;
    height: 8px;
    background: #22c55e;
    border-radius: 50%;
    box-shadow: 0 0 8px rgba(34, 197, 94, 0.5);
  }
  
  .agent-item.responding {
    background: linear-gradient(135deg, rgba(var(--agent-color-rgb, 108, 99, 255), 0.2), rgba(var(--agent-color-rgb, 108, 99, 255), 0.08));
    border: 1px solid var(--agent-color, #6c63ff);
    box-shadow: 0 0 16px rgba(108, 99, 255, 0.2);
    animation: respondingPulse 2s ease-in-out infinite;
  }
  
  @keyframes respondingPulse {
    0%, 100% { box-shadow: 0 0 12px rgba(108, 99, 255, 0.2); }
    50% { box-shadow: 0 0 24px rgba(108, 99, 255, 0.4); }
  }
  
  .responding-avatar {
    animation: avatarPulse 1s ease-in-out infinite;
    box-shadow: 0 0 16px var(--agent-color, #6c63ff) !important;
  }
  
  @keyframes avatarPulse {
    0%, 100% { transform: scale(1); }
    50% { transform: scale(1.08); }
  }
  
  .agent-responding-dot {
    width: 10px;
    height: 10px;
    background: var(--agent-color, #6c63ff);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--agent-color, #6c63ff);
    animation: dotBlink 0.8s ease-in-out infinite;
  }
  
  @keyframes dotBlink {
    0%, 100% { opacity: 1; transform: scale(1); }
    50% { opacity: 0.4; transform: scale(0.7); }
  }
  
  .message-delegate-tag {
    font-size: 10px;
    font-style: italic;
    margin-top: 6px;
    opacity: 0.8;
  }
  
  /* Chat Area */
  .chat-area {
    flex: 1;
    display: flex;
    flex-direction: column;
    min-width: 0;
  }
  
  .chat-header {
    padding: 16px 24px;
    background: #12151c;
    border-bottom: 1px solid #2a3040;
    display: flex;
    align-items: center;
    gap: 14px;
  }
  
  .chat-header-avatar {
    width: 44px;
    height: 44px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    border: 2px solid var(--agent-color, #6c63ff);
    background: #1a1e28;
  }
  
  .chat-header-info h2 {
    font-size: 16px;
    font-weight: 700;
    color: var(--agent-color, #e8eaf6);
  }
  
  .chat-header-info p {
    font-size: 11px;
    color: #7a82a6;
  }
  
  .chat-header-badge {
    margin-left: auto;
    background: rgba(34, 197, 94, 0.15);
    border: 1px solid rgba(34, 197, 94, 0.3);
    color: #22c55e;
    padding: 4px 12px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 600;
    display: flex;
    align-items: center;
    gap: 6px;
  }
  
  .chat-header-badge::before {
    content: '';
    width: 6px;
    height: 6px;
    background: #22c55e;
    border-radius: 50%;
    animation: pulse 2s infinite;
  }
  
  @keyframes pulse {
    0%, 100% { opacity: 1; }
    50% { opacity: 0.5; }
  }
  
  /* Messages */
  .messages-container {
    flex: 1;
    overflow-y: auto;
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 16px;
  }
  
  .message {
    max-width: 70%;
    display: flex;
    gap: 12px;
  }
  
  .message.user {
    align-self: flex-end;
    flex-direction: row-reverse;
  }
  
  .message-avatar {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    border: 2px solid var(--agent-color, #6c63ff);
    background: #1a1e28;
    flex-shrink: 0;
  }
  
  .message.user .message-avatar {
    background: linear-gradient(135deg, #3b82f6, #6366f1);
    border-color: #3b82f6;
  }
  
  .message-content {
    background: #1a1e28;
    border: 1px solid #2a3040;
    border-radius: 16px;
    padding: 14px 18px;
  }
  
  .message.user .message-content {
    background: linear-gradient(135deg, rgba(59, 130, 246, 0.2), rgba(99, 102, 241, 0.15));
    border-color: rgba(59, 130, 246, 0.3);
  }
  
  .message-text {
    font-size: 14px;
    line-height: 1.6;
    color: #e8eaf6;
  }
  
  /* Markdown styles */
  .message-text h1, .message-text h2, .message-text h3 {
    color: var(--agent-color, #a78bfa);
    margin-top: 16px;
    margin-bottom: 8px;
    font-weight: 700;
  }
  
  .message-text h1 { font-size: 18px; }
  .message-text h2 { font-size: 16px; }
  .message-text h3 { font-size: 15px; }
  
  .message-text p {
    margin-bottom: 12px;
  }
  
  .message-text p:last-child {
    margin-bottom: 0;
  }
  
  .message-text ul, .message-text ol {
    margin: 8px 0 12px 0;
    padding-left: 20px;
  }
  
  .message-text li {
    margin-bottom: 4px;
  }
  
  .message-text strong {
    color: #e8eaf6;
    font-weight: 700;
  }
  
  .message-text em {
    color: #a78bfa;
    font-style: italic;
  }
  
  .message-text code {
    background: #0d1117;
    border: 1px solid #2a3040;
    padding: 2px 6px;
    border-radius: 4px;
    font-family: 'JetBrains Mono', 'Fira Code', monospace;
    font-size: 12px;
    color: #00d4aa;
  }
  
  .message-text pre {
    background: #0d1117;
    border: 1px solid #2a3040;
    border-radius: 8px;
    padding: 12px 16px;
    overflow-x: auto;
    margin: 12px 0;
  }
  
  .message-text pre code {
    background: transparent;
    border: none;
    padding: 0;
    font-size: 13px;
  }
  
  .message-text blockquote {
    border-left: 3px solid var(--agent-color, #6c63ff);
    padding-left: 12px;
    margin: 12px 0;
    color: #7a82a6;
    font-style: italic;
  }
  
  .message-text hr {
    border: none;
    border-top: 1px solid #2a3040;
    margin: 16px 0;
  }
  
  .message-text a {
    color: var(--agent-color, #6c63ff);
    text-decoration: underline;
  }
  
  .message-text a:hover {
    color: #a78bfa;
  }
  
  .message-time {
    font-size: 10px;
    color: #7a82a6;
    margin-top: 6px;
  }
  
  /* Typing indicator */
  .typing-indicator {
    display: flex;
    gap: 4px;
    padding: 14px 18px;
    background: #1a1e28;
    border: 1px solid #2a3040;
    border-radius: 16px;
  }
  
  .typing-dot {
    width: 8px;
    height: 8px;
    background: var(--agent-color, #6c63ff);
    border-radius: 50%;
    animation: typing 1.4s infinite ease-in-out;
  }
  
  .typing-dot:nth-child(1) { animation-delay: 0s; }
  .typing-dot:nth-child(2) { animation-delay: 0.2s; }
  .typing-dot:nth-child(3) { animation-delay: 0.4s; }
  
  @keyframes typing {
    0%, 60%, 100% { transform: translateY(0); opacity: 0.5; }
    30% { transform: translateY(-6px); opacity: 1; }
  }
  
  /* Input Area */
  .input-area {
    padding: 20px 24px;
    background: #12151c;
    border-top: 1px solid #2a3040;
  }
  
  .input-container {
    display: flex;
    gap: 12px;
    align-items: flex-end;
  }
  
  .input-wrapper {
    flex: 1;
    background: #1a1e28;
    border: 1px solid #2a3040;
    border-radius: 16px;
    padding: 14px 18px;
    display: flex;
    align-items: center;
    gap: 12px;
    transition: border-color 0.2s;
  }
  
  .input-wrapper:focus-within {
    border-color: var(--agent-color, #6c63ff);
  }
  
  .input-wrapper input {
    flex: 1;
    background: transparent;
    border: none;
    outline: none;
    color: #e8eaf6;
    font-size: 14px;
  }
  
  .input-wrapper input::placeholder {
    color: #7a82a6;
  }
  
  .send-button {
    width: 48px;
    height: 48px;
    border-radius: 14px;
    border: none;
    background: linear-gradient(135deg, var(--agent-color, #6c63ff), var(--agent-color-dark, #5a52d5));
    color: white;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    transition: transform 0.2s, box-shadow 0.2s;
  }
  
  .send-button:hover {
    transform: scale(1.05);
    box-shadow: 0 4px 20px rgba(108, 99, 255, 0.4);
  }
  
  .send-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
  
  /* Empty state */
  .empty-state {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 20px;
    color: #7a82a6;
  }
  
  .empty-icon {
    font-size: 64px;
    opacity: 0.5;
  }
  
  .empty-text {
    font-size: 16px;
    text-align: center;
  }
  
  .empty-hint {
    font-size: 12px;
    color: #5a6080;
  }
  
  /* Scrollbar */
  ::-webkit-scrollbar {
    width: 6px;
  }
  
  ::-webkit-scrollbar-track {
    background: transparent;
  }
  
  ::-webkit-scrollbar-thumb {
    background: #2a3040;
    border-radius: 3px;
  }
  
  ::-webkit-scrollbar-thumb:hover {
    background: #3a4050;
  }
  
  /* Responsive */
  @media (max-width: 768px) {
    .sidebar {
      width: 240px;
    }
    .message {
      max-width: 85%;
    }
  }
  
  @media (max-width: 640px) {
    .chat-container {
      flex-direction: column;
    }
    .sidebar {
      width: 100%;
      height: auto;
      max-height: 200px;
    }
    .agents-list {
      display: flex;
      overflow-x: auto;
      padding: 8px;
    }
    .agent-item {
      flex-shrink: 0;
    }
  }
`;

// Components
const AgentItem: React.FC<{
  agent: Agent;
  isActive: boolean;
  isResponding: boolean;
  onClick: () => void;
}> = ({ agent, isActive, isResponding, onClick }) => (
  <div
    className={`agent-item ${isActive ? 'active' : ''} ${isResponding ? 'responding' : ''}`}
    style={{ '--agent-color': agent.ca } as React.CSSProperties}
    onClick={onClick}
  >
    <div className={`agent-avatar ${isResponding ? 'responding-avatar' : ''}`}>{agent.icon}</div>
    <div className="agent-info">
      <div className="agent-name">{agent.name}</div>
      <div className="agent-role">{isResponding ? '⚡ respondendo...' : agent.title}</div>
    </div>
    {isResponding ? (
      <div className="agent-responding-dot" />
    ) : (
      <div className="agent-status" />
    )}
  </div>
);

const MessageBubble: React.FC<{
  message: Message;
  agent: Agent | null;
}> = ({ message, agent }) => {
  const respondingAgent = message.respondingAgentId
    ? agents.find(a => a.id === message.respondingAgentId) || agent
    : agent;
  return (
  <div
    className={`message ${message.sender}`}
    style={{ '--agent-color': respondingAgent?.ca || '#3b82f6' } as React.CSSProperties}
  >
    <div className="message-avatar">
      {message.sender === 'user' ? '👤' : respondingAgent?.icon || '🤖'}
    </div>
    <div className="message-content">
      <div className="message-text">
        {message.sender === 'agent' ? (
          <ReactMarkdown>{message.text}</ReactMarkdown>
        ) : (
          message.text
        )}
      </div>
      {message.sender === 'agent' && message.respondingAgentId && message.respondingAgentId !== agent?.id && (
        <div className="message-delegate-tag" style={{ color: respondingAgent?.ca }}>
          ↳ delegado para {respondingAgent?.name}
        </div>
      )}
      <div className="message-time">
        {message.timestamp.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
      </div>
    </div>
  </div>
  );
};

const TypingIndicator: React.FC<{ agent: Agent }> = ({ agent }) => (
  <div className="message agent" style={{ '--agent-color': agent.ca } as React.CSSProperties}>
    <div className="message-avatar">{agent.icon}</div>
    <div className="typing-indicator">
      <div className="typing-dot" />
      <div className="typing-dot" />
      <div className="typing-dot" />
    </div>
  </div>
);

// Main Component
export const AgentChat: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);
  const [activeAgentId, setActiveAgentId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, selectedAgent, isTyping]);

  // Send greeting when selecting a new agent
  useEffect(() => {
    if (selectedAgent && !messages[selectedAgent.id]) {
      const greetingMessage: Message = {
        id: Date.now().toString(),
        sender: 'agent',
        text: selectedAgent.greeting,
        timestamp: new Date(),
      };
      setMessages((prev) => ({
        ...prev,
        [selectedAgent.id]: [greetingMessage],
      }));
    }
  }, [selectedAgent]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || !selectedAgent) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      text: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => ({
      ...prev,
      [selectedAgent.id]: [...(prev[selectedAgent.id] || []), userMessage],
    }));
    setInputValue('');
    setIsTyping(true);

    try {
      // Build chat history for context
      const chatHistory: ChatMessage[] = (messages[selectedAgent.id] || [])
        .filter(m => m.sender !== 'agent' || m.text !== selectedAgent.greeting) // Exclude initial greeting
        .map(m => ({
          role: m.sender === 'user' ? 'user' : 'assistant',
          content: m.text,
        }));

      // Add current message
      chatHistory.push({ role: 'user', content: userMessage.text });

      // Call OpenAI API — Orion may delegate
      const orionResponse = await sendToAgent(selectedAgent.id, chatHistory);

      // Parse delegation: detect "DELEGANDO PARA @agentid"
      let delegatedAgent: Agent | null = null;
      if (selectedAgent.id === 'aios-master') {
        const delegateMatch = orionResponse.match(/DELEGANDO PARA @([\w-]+)/i) ||
          orionResponse.match(/delegarei para @([\w-]+)/i) ||
          orionResponse.match(/chamarei @([\w-]+)/i);
        if (delegateMatch) {
          const delegatedId = delegateMatch[1].toLowerCase();
          delegatedAgent = agents.find(a => a.id === delegatedId) || null;
        }
      }

      // Show Orion's delegation message first
      const orionMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: orionResponse,
        timestamp: new Date(),
        respondingAgentId: selectedAgent.id,
      };
      setMessages((prev) => ({
        ...prev,
        [selectedAgent.id]: [...(prev[selectedAgent.id] || []), orionMessage],
      }));

      // If delegated, call the specialist and show their response
      if (delegatedAgent) {
        setActiveAgentId(delegatedAgent.id);

        const specialistResponse = await sendToAgent(delegatedAgent.id, [
          { role: 'user', content: userMessage.text },
        ]);

        const specialistMessage: Message = {
          id: (Date.now() + 2).toString(),
          sender: 'agent',
          text: specialistResponse,
          timestamp: new Date(),
          respondingAgentId: delegatedAgent.id,
        };
        setMessages((prev) => ({
          ...prev,
          [selectedAgent.id]: [...(prev[selectedAgent.id] || []), specialistMessage],
        }));
        setActiveAgentId(null);
      }
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'agent',
        text: '⚠️ Erro ao processar sua mensagem. Verifique se a API key está configurada corretamente no arquivo .env',
        timestamp: new Date(),
      };
      setMessages((prev) => ({
        ...prev,
        [selectedAgent.id]: [...(prev[selectedAgent.id] || []), errorMessage],
      }));
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <>
      <style>{styles}</style>
      <div className="chat-container">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-header">
            <div className="sidebar-title">
              🤖 <span>AIOS</span> Chat da Equipe
            </div>
            <div className="sidebar-subtitle">Converse com seus agentes especializados</div>
          </div>
          <div className="agents-list">
            {agents.map((agent) => (
              <AgentItem
                key={agent.id}
                agent={agent}
                isActive={selectedAgent?.id === agent.id}
                isResponding={isTyping && (activeAgentId === agent.id || (activeAgentId === null && selectedAgent?.id === agent.id))}
                onClick={() => setSelectedAgent(agent)}
              />
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedAgent ? (
            <>
              {/* Header */}
              <div className="chat-header" style={{ '--agent-color': selectedAgent.ca } as React.CSSProperties}>
                <div className="chat-header-avatar">{selectedAgent.icon}</div>
                <div className="chat-header-info">
                  <h2>{selectedAgent.name}</h2>
                  <p>{selectedAgent.title} · {selectedAgent.zodiac}</p>
                </div>
                <div className="chat-header-badge">Conectado</div>
              </div>

              {/* Messages */}
              <div className="messages-container">
                {messages[selectedAgent.id]?.map((msg) => (
                  <MessageBubble key={msg.id} message={msg} agent={selectedAgent} />
                ))}
                {isTyping && <TypingIndicator agent={selectedAgent} />}
                <div ref={messagesEndRef} />
              </div>

              {/* Input */}
              <div className="input-area" style={{ '--agent-color': selectedAgent.ca } as React.CSSProperties}>
                <div className="input-container">
                  <div className="input-wrapper">
                    <input
                      type="text"
                      placeholder={`Mensagem para ${selectedAgent.name}...`}
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyPress={handleKeyPress}
                    />
                  </div>
                  <button
                    className="send-button"
                    onClick={handleSendMessage}
                    disabled={!inputValue.trim()}
                  >
                    ➤
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="empty-state">
              <div className="empty-icon">💬</div>
              <div className="empty-text">Selecione um agente para iniciar uma conversa</div>
              <div className="empty-hint">Escolha um especialista na lista à esquerda</div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default AgentChat;
