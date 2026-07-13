const TelegramBot = require('node-telegram-bot-api');
const { TOKEN, ADMIN_CHAT_ID } = require('./config');
const commandRegistry = require('./commands');
const sessionManager = require('./sessions/sessionManager');
const chatManager = require('./chats/chatManager');

// Iniciar bot en modo polling (ideal para Termux)
const bot = new TelegramBot(TOKEN, { polling: true });

// Middleware simple para sesiones
bot.use((msg, next) => {
  const session = sessionManager.getSession(msg.from.id);
  msg.session = session;
  next();
});

// Registro dinámico de todos los comandos
commandRegistry.registerAll(bot);

// Mensaje de bienvenida
bot.onText(/\/start/, (msg) => {
  const welcome = `👋 Hola ${msg.from.first_name}! Bienvenido al Bot modular.

` +
    `Usa /help para ver la lista de comandos.`;
  bot.sendMessage(msg.chat.id, welcome);
});

// Manejo de errores globales
bot.on('polling_error', (err) => console.error('Polling error:', err));

console.log('🤖 Bot iniciado y escuchando…');
