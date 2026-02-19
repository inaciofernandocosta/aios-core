// Chat message type
export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

// API endpoint (proxy server)
const API_URL = 'http://localhost:3001/api/chat';

// Send message via proxy server
export const sendToAgent = async (
  agentId: string,
  messages: ChatMessage[]
): Promise<string> => {
  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        agentId,
        messages,
      }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data.content;
  } catch (error) {
    console.error('Erro ao chamar API:', error);
    throw error;
  }
};

// Check if server is running
export const checkHealth = async (): Promise<boolean> => {
  try {
    const response = await fetch('http://localhost:3001/api/health');
    const data = await response.json();
    return data.hasApiKey;
  } catch {
    return false;
  }
};

export default { sendToAgent, checkHealth };
