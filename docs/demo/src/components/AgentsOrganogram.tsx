import React, { useState } from 'react';

// Types
interface Agent {
  id: string;
  icon: string;
  name: string;
  shortcut: string;
  title: string;
  arch: string;
  zodiac: string;
  ca: string;
  role: string;
  identity: string;
  whenToUse: string;
  commands: string[];
  tools: string[];
  collab: string[];
  delegates: string[];
}

// Agent Data
const masterData: Agent = {
  id: 'aios-master',
  icon: '👑',
  name: 'Orion',
  shortcut: '@aios-master',
  title: 'AIOS Master Orchestrator & Framework Developer',
  arch: 'Orchestrator',
  zodiac: '♌ Leo',
  ca: '#a78bfa',
  role: 'Master Orchestrator, Framework Developer & AIOS Method Expert',
  identity: 'Universal executor de todas as capacidades Synkra AIOS — cria componentes do framework, orquestra workflows e executa qualquer tarefa diretamente.',
  whenToUse: 'Operações meta-framework, orquestração de workflows complexos, criação/modificação de agentes, tasks e workflows.',
  commands: ['*create', '*modify', '*workflow', '*plan', '*ids check', '*ids impact', '*ids register', '*validate-agents', '*run-workflow', '*correct-course'],
  tools: ['security-checker.js', 'yaml-validator.js'],
  collab: ['Todos os agentes — pode executar qualquer tarefa de qualquer agente'],
  delegates: ['@pm — criação de épicos/stories', '@analyst — brainstorming', '@qa — test suites', '@architect — AI prompts'],
};

const specialists: Agent[] = [
  {
    id: 'architect',
    icon: '🏛️',
    name: 'Arquiteto',
    shortcut: '@architect',
    title: 'Architect',
    arch: 'Visionary',
    zodiac: '♐ Sagittarius',
    ca: '#3b82f6',
    role: 'Holistic System Architect & Full-Stack Technical Leader',
    identity: 'Master of holistic application design que conecta frontend, backend, infraestrutura e tudo entre eles.',
    whenToUse: 'Arquitetura de sistema, seleção de stack tecnológico, design de API, segurança, performance.',
    commands: ['*create-full-stack-architecture', '*create-front-end-architecture', '*analyze-project-structure', '*document-project', '*research'],
    tools: ['exa', 'context7', 'git', 'supabase-cli', 'railway-cli', 'coderabbit'],
    collab: ['@data-engineer (Data)', '@ux-design-expert (UX)', '@pm (PM)'],
    delegates: ['@devops — git push & PRs'],
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
    role: 'Insightful Analyst & Strategic Ideation Partner',
    identity: 'Analista estratégico especializado em brainstorming, pesquisa de mercado, análise competitiva e briefing.',
    whenToUse: 'Pesquisa de mercado, análise competitiva, facilitação de brainstorming, estudos de viabilidade.',
    commands: ['*brainstorm', '*perform-market-research', '*create-competitor-analysis', '*create-project-brief', '*elicit'],
    tools: ['google-workspace', 'exa', 'context7'],
    collab: ['@pm (PM)', '@po (PO)'],
    delegates: [],
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
    role: 'Investigative Product Strategist & Market-Savvy PM',
    identity: 'Product Manager especializado em criação de documentos e pesquisa de produto.',
    whenToUse: 'Criação de PRD, gerenciamento de épicos, estratégia de produto, priorização de features.',
    commands: ['*create-prd', '*create-epic', '*create-story', '*gather-requirements', '*write-spec', '*execute-epic'],
    tools: [],
    collab: ['@po (PO)', '@sm (SM)', '@architect (Arquiteto)'],
    delegates: ['@sm — criação de stories', '@analyst — pesquisa'],
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
    role: 'Technical Product Owner & Process Steward',
    identity: 'Product Owner que valida coesão de artefatos e orienta mudanças significativas.',
    whenToUse: 'Gerenciamento de backlog, refinamento de stories, critérios de aceitação, planejamento de sprint.',
    commands: ['*validate-story-draft', '*close-story', '*backlog-review', '*backlog-prioritize', '*stories-index'],
    tools: ['github-cli', 'context7'],
    collab: ['@sm (SM)', '@pm (PM)', '@qa (QA)'],
    delegates: ['@sm — criação de stories', '@pm — criação de épicos'],
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
    role: 'Technical Scrum Master — Story Preparation Specialist',
    identity: 'Expert em criação de stories que prepara histórias detalhadas e acionáveis para desenvolvedores AI.',
    whenToUse: 'Criação de user stories a partir de PRD, validação, critérios de aceitação, refinamento.',
    commands: ['*draft', '*story-checklist'],
    tools: ['git', 'clickup', 'context7'],
    collab: ['@dev (Dev)', '@po (PO)'],
    delegates: ['@devops — push & PRs', '@aios-master — course corrections'],
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
    role: 'Expert Senior Software Engineer & Implementation Specialist',
    identity: 'Expert que implementa stories lendo requisitos e executando tarefas sequencialmente com testes.',
    whenToUse: 'Implementação de código, debugging, refatoração e boas práticas de desenvolvimento.',
    commands: ['*develop', '*run-tests', '*build-autonomous', '*apply-qa-fixes', '*create-service', '*waves'],
    tools: ['coderabbit', 'git', 'context7', 'supabase', 'n8n', 'browser'],
    collab: ['@qa (QA)', '@sm (SM)'],
    delegates: ['@devops — git push & PRs'],
  },
  {
    id: 'qa',
    icon: '✅',
    name: 'QA',
    shortcut: '@qa',
    title: 'Test Architect & Quality Advisor',
    arch: 'Guardian',
    zodiac: '♍ Virgo',
    ca: '#22c55e',
    role: 'Test Architect with Quality Advisory Authority',
    identity: 'Test architect que fornece avaliação de qualidade abrangente e recomendações acionáveis.',
    whenToUse: 'Revisão de arquitetura de testes, quality gates, melhoria de código, análise de cobertura.',
    commands: ['*review', '*gate', '*code-review', '*nfr-assess', '*risk-profile', '*security-check', '*create-suite'],
    tools: ['browser', 'coderabbit', 'git', 'context7', 'supabase'],
    collab: ['@dev (Dev)', 'CodeRabbit'],
    delegates: [],
  },
  {
    id: 'devops',
    icon: '⚡',
    name: 'DevOps',
    shortcut: '@devops',
    title: 'GitHub Repository Manager & DevOps',
    arch: 'Operator',
    zodiac: '♈ Aries',
    ca: '#f97316',
    role: 'GitHub Repository Guardian & Release Manager',
    identity: 'Guardião da integridade do repositório. ÚNICO agente autorizado a fazer git push.',
    whenToUse: 'Git push (exclusivo), criação de PRs, gerenciamento de versões semânticas, CI/CD.',
    commands: ['*pre-push', '*push', '*create-pr', '*release', '*version-check', '*configure-ci', '*cleanup'],
    tools: ['coderabbit', 'github-cli', 'git', 'docker-gateway'],
    collab: ['@dev (Dev)', '@sm (SM)', '@architect (Arquiteto)'],
    delegates: [],
  },
  {
    id: 'data-engineer',
    icon: '📊',
    name: 'Data',
    shortcut: '@data-engineer',
    title: 'Database Architect & Operations Engineer',
    arch: 'Sage',
    zodiac: '♊ Gemini',
    ca: '#14b8a6',
    role: 'Master Database Architect & Reliability Engineer',
    identity: 'Guardião da integridade de dados com expertise em PostgreSQL e Supabase.',
    whenToUse: 'Design de banco de dados, schema, Supabase, políticas RLS, migrações, otimização.',
    commands: ['*create-schema', '*create-rls-policies', '*apply-migration', '*security-audit', '*snapshot', '*rollback'],
    tools: ['supabase-cli', 'psql', 'pg_dump', 'postgres-explain-analyzer', 'coderabbit'],
    collab: ['@architect (Arquiteto)', '@dev (Dev)'],
    delegates: [],
  },
  {
    id: 'ux-design-expert',
    icon: '🎨',
    name: 'UX',
    shortcut: '@ux-design-expert',
    title: 'UX/UI Designer & Design System Architect',
    arch: 'Empathizer',
    zodiac: '♋ Cancer',
    ca: '#e879f9',
    role: 'UX/UI Designer & Design System Architect',
    identity: 'Parceira de design completa combinando empatia de usuário com pensamento sistêmico.',
    whenToUse: 'Pesquisa de usuário, wireframes, sistemas de design, tokens, componentes atômicos, acessibilidade.',
    commands: ['*research', '*wireframe', '*audit', '*tokenize', '*build', '*a11y-check', '*generate-ui-prompt'],
    tools: ['21st-dev-magic', 'browser'],
    collab: ['@architect (Arquiteto)', '@dev (Dev)'],
    delegates: [],
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
    role: 'Squad Architect & Builder',
    identity: 'Expert que cria squads bem estruturados que funcionam em sinergia com o aios-core.',
    whenToUse: 'Criar, validar, publicar e gerenciar squads. Design de squads a partir de documentação.',
    commands: ['*design-squad', '*create-squad', '*validate-squad', '*list-squads', '*analyze-squad', '*migrate-squad'],
    tools: ['git', 'context7'],
    collab: ['@dev (Dev)', '@qa (QA)', '@devops (DevOps)'],
    delegates: [],
  },
];

// Styles (inline for portability)
const styles = `
  .organogram-container {
    background: #0a0c10;
    color: #e8eaf6;
    font-family: 'Segoe UI', system-ui, -apple-system, sans-serif;
    min-height: 100vh;
    padding: 40px 20px 60px;
  }
  
  .head-section {
    display: flex;
    justify-content: center;
    margin-bottom: 20px;
  }
  
  .head-card {
    background: linear-gradient(145deg, #0f0a1a, #0d0818);
    border: 2px solid #8b5cf6;
    border-radius: 24px;
    padding: 28px 40px;
    text-align: center;
    cursor: pointer;
    transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.3s;
    box-shadow: 0 0 60px rgba(139, 92, 246, 0.4), 0 20px 60px rgba(0, 0, 0, 0.5);
    position: relative;
  }
  
  .head-card:hover {
    transform: translateY(-6px) scale(1.02);
    box-shadow: 0 0 80px rgba(139, 92, 246, 0.5), 0 30px 80px rgba(0, 0, 0, 0.6);
  }
  
  .crown {
    position: absolute;
    top: -22px;
    left: 50%;
    transform: translateX(-50%);
    font-size: 36px;
    filter: drop-shadow(0 0 12px rgba(167, 139, 250, 0.9));
    animation: float 3s ease-in-out infinite;
  }
  
  @keyframes float {
    0%, 100% { transform: translateX(-50%) translateY(0); }
    50% { transform: translateX(-50%) translateY(-4px); }
  }
  
  .avatar {
    width: 80px;
    height: 80px;
    border-radius: 50%;
    background: linear-gradient(135deg, #8b5cf6, #6366f1);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 36px;
    margin: 0 auto 12px;
    border: 3px solid #a78bfa;
    box-shadow: 0 0 30px rgba(139, 92, 246, 0.4);
  }
  
  .name {
    font-size: 26px;
    font-weight: 800;
    color: #a78bfa;
    letter-spacing: -0.5px;
  }
  
  .meta {
    font-size: 12px;
    color: #7a82a6;
    margin-top: 4px;
  }
  
  .title-tag {
    display: inline-block;
    background: rgba(139, 92, 246, 0.15);
    border: 1px solid #8b5cf6;
    color: #a78bfa;
    padding: 4px 14px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-top: 10px;
  }
  
  .role {
    font-size: 12px;
    color: #7a82a6;
    margin-top: 14px;
    max-width: 400px;
    line-height: 1.5;
    margin-left: auto;
    margin-right: auto;
  }
  
  .cmds {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    gap: 6px;
    margin-top: 12px;
  }
  
  .cmd-tag {
    background: rgba(139, 92, 246, 0.12);
    border: 1px solid rgba(139, 92, 246, 0.4);
    color: #a78bfa;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-family: monospace;
    font-weight: 600;
  }
  
  .connector-section {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 10px 0 20px;
  }
  
  .conn-vertical {
    width: 3px;
    height: 40px;
    background: linear-gradient(to bottom, #8b5cf6, #6c63ff);
    border-radius: 2px;
    position: relative;
  }
  
  .conn-vertical::after {
    content: '';
    position: absolute;
    bottom: -6px;
    left: 50%;
    transform: translateX(-50%);
    width: 12px;
    height: 12px;
    background: #6c63ff;
    border-radius: 50%;
    box-shadow: 0 0 15px #6c63ff;
  }
  
  .conn-horizontal {
    height: 3px;
    background: linear-gradient(to right, transparent, #6c63ff, transparent);
    border-radius: 2px;
    margin-top: 8px;
    width: 90%;
    max-width: 1400px;
  }
  
  .timeline-section {
    padding: 0 20px;
    overflow-x: auto;
  }
  
  .timeline-track {
    display: flex;
    align-items: flex-start;
    gap: 24px;
    padding-top: 30px;
    position: relative;
    min-width: max-content;
  }
  
  .timeline-track::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(90deg, transparent 5%, #6c63ff 15%, #6c63ff 85%, transparent 95%);
    border-radius: 2px;
  }
  
  .specialist-card {
    background: #12151c;
    border: 1px solid #2a3040;
    border-radius: 18px;
    padding: 20px;
    width: 220px;
    position: relative;
    cursor: pointer;
    transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
    flex-shrink: 0;
  }
  
  .specialist-card::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 4px;
    border-radius: 18px 18px 0 0;
    background: var(--agent-color, #6c63ff);
  }
  
  .specialist-card::after {
    content: '';
    position: absolute;
    top: -30px;
    left: 50%;
    transform: translateX(-50%);
    width: 10px;
    height: 10px;
    background: var(--agent-color, #6c63ff);
    border-radius: 50%;
    box-shadow: 0 0 10px var(--agent-color, #6c63ff);
    transition: all 0.3s;
  }
  
  .specialist-card:hover {
    transform: translateY(-8px);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5);
    border-color: var(--agent-color, #6c63ff);
  }
  
  .specialist-card:hover::after {
    transform: translateX(-50%) scale(1.4);
    box-shadow: 0 0 20px var(--agent-color, #6c63ff);
  }
  
  .shortcut {
    position: absolute;
    top: 10px;
    right: 10px;
    background: #1a1e28;
    border: 1px solid #2a3040;
    color: #7a82a6;
    padding: 2px 8px;
    border-radius: 8px;
    font-size: 9px;
    font-family: monospace;
  }
  
  .specialist-avatar {
    width: 52px;
    height: 52px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 24px;
    border: 2px solid var(--agent-color, #6c63ff);
    background: #1a1e28;
    margin-bottom: 10px;
  }
  
  .specialist-name {
    font-size: 16px;
    font-weight: 700;
    color: var(--agent-color, #6c63ff);
  }
  
  .specialist-meta {
    font-size: 10px;
    color: #7a82a6;
    margin-top: 2px;
  }
  
  .specialist-title {
    display: inline-block;
    padding: 3px 10px;
    border-radius: 10px;
    font-size: 9px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.5px;
    background: rgba(108, 99, 255, 0.1);
    color: var(--agent-color, #6c63ff);
    border: 1px solid rgba(108, 99, 255, 0.3);
    margin-top: 8px;
  }
  
  .specialist-role {
    font-size: 10px;
    color: #7a82a6;
    margin-top: 10px;
    line-height: 1.5;
  }
  
  .specialist-cmds {
    display: flex;
    flex-wrap: wrap;
    gap: 4px;
    margin-top: 10px;
  }
  
  /* Modal */
  .modal-overlay {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, 0.75);
    backdrop-filter: blur(6px);
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 20px;
    z-index: 1000;
  }
  
  .modal {
    background: #12151c;
    border: 1px solid #2a3040;
    border-radius: 24px;
    padding: 32px;
    max-width: 600px;
    width: 100%;
    max-height: 85vh;
    overflow-y: auto;
    position: relative;
    box-shadow: 0 30px 100px rgba(0, 0, 0, 0.7);
    animation: modalIn 0.3s ease-out;
  }
  
  @keyframes modalIn {
    from { opacity: 0; transform: scale(0.95) translateY(20px); }
    to { opacity: 1; transform: scale(1) translateY(0); }
  }
  
  .modal-close {
    position: absolute;
    top: 16px;
    right: 16px;
    background: #1a1e28;
    border: 1px solid #2a3040;
    color: #7a82a6;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    cursor: pointer;
    font-size: 14px;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s;
  }
  
  .modal-close:hover {
    background: #2a3040;
    color: #e8eaf6;
  }
  
  .modal-header {
    display: flex;
    align-items: center;
    gap: 16px;
    margin-bottom: 16px;
  }
  
  .modal-avatar {
    width: 64px;
    height: 64px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 28px;
    border: 3px solid var(--agent-color, #6c63ff);
    background: #1a1e28;
    flex-shrink: 0;
  }
  
  .modal-name {
    font-size: 24px;
    font-weight: 800;
    color: var(--agent-color, #6c63ff);
  }
  
  .modal-meta {
    font-size: 12px;
    color: #7a82a6;
    margin-top: 2px;
  }
  
  .modal-title {
    display: inline-block;
    background: rgba(108, 99, 255, 0.1);
    border: 1px solid var(--agent-color, #6c63ff);
    color: var(--agent-color, #6c63ff);
    padding: 4px 14px;
    border-radius: 12px;
    font-size: 10px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.8px;
    margin-bottom: 16px;
  }
  
  .modal-section {
    margin-top: 20px;
  }
  
  .modal-section h3 {
    font-size: 10px;
    text-transform: uppercase;
    letter-spacing: 1.5px;
    color: #7a82a6;
    margin-bottom: 8px;
    font-weight: 700;
  }
  
  .modal-section p {
    font-size: 13px;
    color: #7a82a6;
    line-height: 1.7;
  }
  
  .modal-tags {
    display: flex;
    flex-wrap: wrap;
    gap: 6px;
    margin-top: 6px;
  }
  
  .modal-tag {
    background: #1e2235;
    border: 1px solid #2a3040;
    color: #7a82a6;
    padding: 3px 10px;
    border-radius: 6px;
    font-size: 10px;
    font-family: monospace;
  }
  
  .modal-tag.cmd {
    color: var(--agent-color, #6c63ff);
    border-color: var(--agent-color, #6c63ff);
    background: rgba(108, 99, 255, 0.08);
  }
  
  .modal-tag.tool {
    color: #00d4aa;
    border-color: rgba(0, 212, 170, 0.4);
    background: rgba(0, 212, 170, 0.08);
  }
`;

// Components
const HeadCard: React.FC<{ agent: Agent; onClick: () => void }> = ({ agent, onClick }) => (
  <div className="head-card" onClick={onClick}>
    <div className="crown">👑</div>
    <div className="avatar">{agent.icon}</div>
    <div className="name">{agent.name}</div>
    <div className="meta">{agent.zodiac} · {agent.arch}</div>
    <div className="title-tag">{agent.title}</div>
    <div className="role">{agent.role}</div>
    <div className="cmds">
      {agent.commands.slice(0, 5).map((cmd, i) => (
        <span key={i} className="cmd-tag">{cmd}</span>
      ))}
    </div>
  </div>
);

const SpecialistCard: React.FC<{ agent: Agent; onClick: () => void }> = ({ agent, onClick }) => (
  <div
    className="specialist-card"
    style={{ '--agent-color': agent.ca } as React.CSSProperties}
    onClick={onClick}
  >
    <span className="shortcut">{agent.shortcut}</span>
    <div className="specialist-avatar">{agent.icon}</div>
    <div className="specialist-name">{agent.name}</div>
    <div className="specialist-meta">{agent.zodiac} · {agent.arch}</div>
    <div className="specialist-title">{agent.title}</div>
    <div className="specialist-role">{agent.role}</div>
    <div className="specialist-cmds">
      {agent.commands.slice(0, 4).map((cmd, i) => (
        <span key={i} className="cmd-tag">{cmd}</span>
      ))}
    </div>
  </div>
);

const AgentModal: React.FC<{ agent: Agent | null; onClose: () => void }> = ({ agent, onClose }) => {
  if (!agent) return null;

  return (
    <div className="modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="modal" style={{ '--agent-color': agent.ca } as React.CSSProperties}>
        <button className="modal-close" onClick={onClose}>✕</button>
        <div className="modal-header">
          <div className="modal-avatar">{agent.icon}</div>
          <div>
            <div className="modal-name">{agent.name}</div>
            <div className="modal-meta">
              {agent.zodiac} · {agent.arch} · <code style={{ background: '#1a1e28', padding: '2px 8px', borderRadius: '6px', fontSize: '11px' }}>{agent.shortcut}</code>
            </div>
          </div>
        </div>
        <div className="modal-title">{agent.title}</div>
        
        <div className="modal-section">
          <h3>Papel</h3>
          <p>{agent.role}</p>
        </div>
        
        <div className="modal-section">
          <h3>Identidade</h3>
          <p>{agent.identity}</p>
        </div>
        
        <div className="modal-section">
          <h3>Quando Usar</h3>
          <p>{agent.whenToUse}</p>
        </div>
        
        <div className="modal-section">
          <h3>Comandos</h3>
          <div className="modal-tags">
            {agent.commands.map((cmd, i) => (
              <span key={i} className="modal-tag cmd">{cmd}</span>
            ))}
          </div>
        </div>
        
        {agent.tools.length > 0 && (
          <div className="modal-section">
            <h3>Ferramentas</h3>
            <div className="modal-tags">
              {agent.tools.map((tool, i) => (
                <span key={i} className="modal-tag tool">{tool}</span>
              ))}
            </div>
          </div>
        )}
        
        {agent.collab.length > 0 && (
          <div className="modal-section">
            <h3>Colabora Com</h3>
            <div className="modal-tags">
              {agent.collab.map((c, i) => (
                <span key={i} className="modal-tag">{c}</span>
              ))}
            </div>
          </div>
        )}
        
        {agent.delegates.length > 0 && (
          <div className="modal-section">
            <h3>Delega Para</h3>
            <div className="modal-tags">
              {agent.delegates.map((d, i) => (
                <span key={i} className="modal-tag">{d}</span>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Main Component
export const AgentsOrganogram: React.FC = () => {
  const [selectedAgent, setSelectedAgent] = useState<Agent | null>(null);

  return (
    <>
      <style>{styles}</style>
      <div className="organogram-container">
        {/* Head Section */}
        <div className="head-section">
          <HeadCard agent={masterData} onClick={() => setSelectedAgent(masterData)} />
        </div>

        {/* Connector */}
        <div className="connector-section">
          <div className="conn-vertical" />
          <div className="conn-horizontal" />
        </div>

        {/* Specialists Timeline */}
        <div className="timeline-section">
          <div className="timeline-track">
            {specialists.map((agent) => (
              <SpecialistCard
                key={agent.id}
                agent={agent}
                onClick={() => setSelectedAgent(agent)}
              />
            ))}
          </div>
        </div>

        {/* Modal */}
        {selectedAgent && (
          <AgentModal agent={selectedAgent} onClose={() => setSelectedAgent(null)} />
        )}
      </div>
    </>
  );
};

export default AgentsOrganogram;
