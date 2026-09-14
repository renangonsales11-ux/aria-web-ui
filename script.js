// Simulação do ARIA Backend
class ARIA {
    constructor() {
        this.memorias = [];
        this.tarefas = {};
        this.ferramentas = ['calculadora', 'analisador_texto', 'procurador'];
    }

    processar_entrada(mensagem) {
        mensagem = mensagem.trim();
        
        const intencao = this.detectar_intencao(mensagem);
        
        let resposta = '';
        
        if (intencao === 'ferramenta') {
            resposta = this.executar_ferramenta(mensagem);
        } else if (intencao === 'tarefa') {
            resposta = this.processar_tarefa(mensagem);
        } else if (intencao === 'listar_tarefas') {
            resposta = this.listar_tarefas();
        } else if (intencao === 'status') {
            resposta = this.obter_status();
        } else {
            resposta = this.gerar_resposta_conversacional(mensagem);
        }
        
        this.armazenar_memoria(mensagem, resposta);
        return resposta;
    }

    detectar_intencao(mensagem) {
        const lower = mensagem.toLowerCase();
        
        if (/calcule|faça a conta|quanto é|operação|\d+\s*[+\-*/÷×]\s*\d+/.test(lower)) {
            return 'ferramenta';
        }
        if (/criar tarefa|adicione|lembre-me|to-do/.test(lower)) {
            return 'tarefa';
        }
        if (/tarefas|minhas tarefas|lista de tarefas/.test(lower)) {
            return 'listar_tarefas';
        }
        if (/status|como está|informações/.test(lower)) {
            return 'status';
        }
        
        return 'conversa';
    }

    executar_ferramenta(mensagem) {
        const lower = mensagem.toLowerCase();
        
        if (/\d+\s*[+\-*/÷×]\s*\d+/.test(lower)) {
            return this.calcular(mensagem);
        }
        
        if (/calcule|soma|subtração|multiplicação|divisão/.test(lower)) {
            return "🧮 Use números com operadores: ex: '10 + 5', '20 * 3'";
        }
        
        return `Ferramentas disponíveis: ${this.ferramentas.join(', ')}`;
    }

    calcular(mensagem) {
        const regex = /(-?\d+\.?\d*)\s*([+\-*/÷×])\s*(-?\d+\.?\d*)/;
        const match = mensagem.match(regex);
        
        if (!match) {
            return "❌ Não consegui extrair os números. Tente: '10 + 5'";
        }
        
        const a = parseFloat(match[1]);
        const op = match[2];
        const b = parseFloat(match[3]);
        
        let resultado;
        let operacao;
        
        if (op === '+') {
            resultado = a + b;
            operacao = 'soma';
        } else if (op === '-') {
            resultado = a - b;
            operacao = 'subtração';
        } else if (op === '*' || op === '×') {
            resultado = a * b;
            operacao = 'multiplicação';
        } else if (op === '/' || op === '÷') {
            if (b === 0) {
                return "❌ Erro: Divisão por zero não permitida!";
            }
            resultado = a / b;
            operacao = 'divisão';
        }
        
        // Formatar resultado
        const resultadoFormatado = Number.isInteger(resultado) ? resultado : resultado.toFixed(2);
        
        return `🧮 Cálculo: ${a} ${op} ${b}\n✅ Resultado: **${resultadoFormatado}**`;
    }

    processar_tarefa(mensagem) {
        const conteudo = mensagem
            .replace(/criar tarefa/i, '')
            .replace(/adicione/i, '')
            .trim();
        
        if (!conteudo) {
            return "❌ Qual é a tarefa? Digite: 'criar tarefa seu texto aqui'";
        }
        
        const taskId = this.gerarId();
        this.tarefas[taskId] = {
            id: taskId,
            content: conteudo,
            status: 'pendente',
            criada_em: new Date().toLocaleString('pt-BR')
        };
        
        return `✅ Tarefa criada!\n📌 "${conteudo}"\n🔑 ID: ${taskId}`;
    }

    listar_tarefas() {
        if (Object.keys(this.tarefas).length === 0) {
            return "📋 Você não tem tarefas pendentes. Quer criar uma? 😊";
        }
        
        let lista = "📋 **Suas Tarefas:**\n";
        Object.values(this.tarefas).forEach((t, i) => {
            lista += `${i + 1}. ${t.content} [${t.status}]\n`;
        });
        
        return lista;
    }

    obter_status() {
        return `📊 **Status do ARIA**\n
🤖 Nome: ARIA
💾 Memórias: ${this.memorias.length}
✅ Tarefas: ${Object.keys(this.tarefas).length}
🛠️ Ferramentas: ${this.ferramentas.length}
🟢 Status: Online e funcionando!`;
    }

    gerar_resposta_conversacional(mensagem) {
        const respostas = {
            'olá': 'Olá! 👋 Como posso ajudá-lo?',
            'oi': 'Oi! Em que posso ser útil? 😊',
            'como você está': 'Estou funcionando perfeitamente! Obrigado por perguntar! 🚀',
            'obrigado': 'De nada! Fico feliz em ajudar! 😄',
            'qual é seu nome': 'Sou ARIA, seu assistente IA inteligente! 🤖',
            'o que você faz': 'Posso fazer cálculos, gerenciar tarefas, analisar texto e muito mais!',
            'qual é seu superpoder': '⚡ Meus superpoderes: memória infinita, raciocínio rápido e paciência infinita!',
            'você é humano': 'Sou uma IA, mas gosto de pensar que tenho uma personalidade única! 😄'
        };
        
        const lower = mensagem.toLowerCase();
        
        for (const [chave, resposta] of Object.entries(respostas)) {
            if (lower.includes(chave)) {
                return resposta;
            }
        }
        
        // Respostas genéricas inteligentes
        if (mensagem.includes('?')) {
            return `Ótima pergunta sobre: "${mensagem.slice(0, 40)}..." 🤔\nTente usar: calcule, criar tarefa, tarefas, ou status!`;
        }
        
        return `Entendi: "${mensagem}". Como posso ajudar com isso? 💭`;
    }

    armazenar_memoria(mensagem, resposta) {
        this.memorias.push({
            mensagem,
            resposta,
            timestamp: new Date().toLocaleTimeString('pt-BR')
        });
        
        if (this.memorias.length > 100) {
            this.memorias = this.memorias.slice(-100);
        }
    }

    gerarId() {
        return 'task_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
    }
}

// Instância global do ARIA
const aria = new ARIA();

// DOM Elements
const messagesContainer = document.getElementById('messages');
const userInput = document.getElementById('userInput');
const fab = document.getElementById('fab');

// Enviar mensagem
function enviarMensagem() {
    const mensagem = userInput.value.trim();
    
    if (!mensagem) return;
    
    // Adicionar mensagem do usuário
    adicionarMensagem(mensagem, 'user');
    
    // Processar com ARIA
    setTimeout(() => {
        const resposta = aria.processar_entrada(mensagem);
        adicionarMensagem(resposta, 'bot');
    }, 500);
    
    // Limpar input
    userInput.value = '';
    userInput.focus();
}

// Ação rápida
function quickAction(acao) {
    userInput.value = acao;
    userInput.focus();
}

// Adicionar mensagem ao chat
function adicionarMensagem(texto, tipo) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${tipo}-message`;
    
    const avatar = document.createElement('div');
    avatar.className = 'message-avatar';
    avatar.textContent = tipo === 'user' ? '👤' : '🤖';
    
    const content = document.createElement('div');
    content.className = 'message-content';
    
    // Processar markdown simples
    let html = texto
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        .replace(/\n/g, '<br>')
        .replace(/•/g, '&bull;');
    
    content.innerHTML = html;
    
    messageDiv.appendChild(avatar);
    messageDiv.appendChild(content);
    
    messagesContainer.appendChild(messageDiv);
    
    // Auto scroll para baixo
    setTimeout(() => {
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }, 100);
}

// FAB - Limpar chat
fab.addEventListener('click', () => {
    if (confirm('Tem certeza que quer limpar o chat? 🗑️')) {
        messagesContainer.innerHTML = `
            <div class="message bot-message initial-message">
                <div class="message-avatar">🤖</div>
                <div class="message-content">
                    <p>Chat limpo! ✨</p>
                    <p>Vamos começar de novo?</p>
                </div>
            </div>
        `;
        aria.memorias = [];
        fab.style.animation = 'fabBounce 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        setTimeout(() => {
            fab.style.animation = '';
        }, 600);
    }
});

// Enter para enviar
userInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        enviarMensagem();
    }
});

// Focus no input ao carregar
window.addEventListener('load', () => {
    userInput.focus();
    
    // Animação de entrada das ações rápidas
    const actionBtns = document.querySelectorAll('.action-btn');
    actionBtns.forEach((btn, index) => {
        btn.style.animation = `none`;
        setTimeout(() => {
            btn.style.animation = `messageAppear 0.4s ease-out ${index * 0.1}s`;
        }, 10);
    });
});

// Feedback visual ao enviar
const sendBtn = document.querySelector('.send-btn');
sendBtn.addEventListener('click', () => {
    sendBtn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        sendBtn.style.transform = '';
    }, 100);
});