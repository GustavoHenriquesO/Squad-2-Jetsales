// server/src/routes/index.js
//
// Agregador de rotas do JetGO. Tudo aqui é montado pelo app.js sob /api/v1.
// Mantemos os módulos isolados por domínio para que cada subgrupo (auth, flows,
// chatbots, etc.) possa evoluir sem tocar nos outros.

const router = require('express').Router();
const chatbotRoutes = require('../modules/chatbot/chatbot.routes');
const messageRoutes = require('../modules/conversation/message.routes');
const conversationRoutes = require('../modules/conversation/conversation.routes');

router.use('/chatbots', chatbotRoutes);
router.use('/messages', messageRoutes);
router.use('/conversations', conversationRoutes);

module.exports = router;
