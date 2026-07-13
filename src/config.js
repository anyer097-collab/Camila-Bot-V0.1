require('dotenv').config();

module.exports = {
  TOKEN: process.env.BOT_TOKEN || "8279965294:AAHb4Jv4FBsUoSCbBEJMhMxwWl1_7nQxr24",
  ADMIN_CHAT_ID: parseInt(process.env.ADMIN_CHAT_ID || "7953907047", 10),
  DB_PATH: "./data/bot.db"
};
