const db = require('../utils/db');

function register(bot) {
  // /balance – muestra saldo
  bot.onText(/\/balance/, (msg) => {
    const userId = msg.from.id;
    db.get('SELECT balance FROM economy WHERE user_id = ?', [userId], (err, row) => {
      if (err || !row) {
        db.run('INSERT OR IGNORE INTO economy (user_id, balance) VALUES (?,0)', [userId]);
        return bot.sendMessage(msg.chat.id, '💰 Tu saldo: 0 monedas');
      }
      bot.sendMessage(msg.chat.id, `💰 Tu saldo: ${row.balance} monedas`);
    });
  });

  // /work – genera dinero aleatorio (cooldown 1h)
  const workCooldown = {};
  bot.onText(/\/work/, (msg) => {
    const userId = msg.from.id;
    const now = Date.now();
    if (workCooldown[userId] && now - workCooldown[userId] < 3600_000) {
      return bot.sendMessage(msg.chat.id, '⏳ Debes esperar antes de volver a trabajar.');
    }
    const earned = Math.floor(Math.random() * 100) + 10;
    db.run('INSERT OR REPLACE INTO economy (user_id, balance) VALUES (?, COALESCE((SELECT balance FROM economy WHERE user_id = ?),0) + ?)', [userId, userId, earned]);
    workCooldown[userId] = now;
    bot.sendMessage(msg.chat.id, `🛠️ Ganaste ${earned} monedas!`);
  });

  // /transfer <id> <cantidad>
  bot.onText(/\/transfer (\d+) (\d+)/, (msg, match) => {
    const fromId = msg.from.id;
    const toId = parseInt(match[1]);
    const amount = parseInt(match[2]);
    if (amount <= 0) return bot.sendMessage(msg.chat.id, '❌ Cantidad inválida.');
    db.get('SELECT balance FROM economy WHERE user_id = ?', [fromId], (err, row) => {
      if (err || !row || row.balance < amount) return bot.sendMessage(msg.chat.id, '⚠️ Saldo insuficiente.');
      // Restar del emisor
      db.run('UPDATE economy SET balance = balance - ? WHERE user_id = ?', [amount, fromId]);
      // Añadir al receptor
      db.run('INSERT OR REPLACE INTO economy (user_id, balance) VALUES (?, COALESCE((SELECT balance FROM economy WHERE user_id = ?),0) + ?)', [toId, toId, amount]);
      bot.sendMessage(msg.chat.id, `✅ Transferidos ${amount} monedas a ${toId}.`);
    });
  });
}

module.exports = { register };
