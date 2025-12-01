import TelegramBot from 'node-telegram-bot-api';
import dotenv from 'dotenv';
import { packetBot } from 'model';
dotenv.config();
const token = process.env.TELEGRAM_BOT_TOKEN;
const chatId = process.env.RESPONSAVEL_CHAT_ID;

if (!token) {
    throw new Error("Erro: TELEGRAM_BOT_TOKEN não definido no .env");
}

// Cria a instância do bot
export const bot = new TelegramBot(token, { polling: true });
// Log para pegar o ID no início
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;
    console.log(`👋 Novo usuário (Chat ID): ${chatId}`);
    bot.sendMessage(chatId, `Seu ID é: \`${chatId}\` (copie e cole no .env ou código)`, { parse_mode: 'Markdown' });
});

bot.on('polling_error', (error) => console.log(`[Telegram Error]: ${error.message}`));

export const enviarAlertaQueda = async (): Promise<void> => {
    const mensagem = `
🚨 **CUIDADO!!! SEU IDOSO CAIU** 🚨
_Verifique imediatamente!_
`;

    try {
        await bot.sendMessage(chatId, mensagem, { parse_mode: 'Markdown' });
        console.log(`Alerta enviado para ${chatId}`);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
};


export const enviarAlertaDeAreaSegura = async (): Promise<void> => {
    const mensagem = `
🚨 **CUIDADO!!! SEU IDOSO JOSE SAIU DE CASA** 🚨
_Verifique imediatamente!_
`;
    try {
        await bot.sendMessage(chatId, mensagem, { parse_mode: 'Markdown' });
        console.log(`Alerta enviado para ${chatId}`);
    } catch (error) {
        console.error("Erro ao enviar mensagem:", error);
    }
};