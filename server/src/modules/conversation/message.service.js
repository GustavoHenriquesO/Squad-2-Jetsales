// server/src/modules/conversation/message.service.js
//
// Regras de negócio para mensagens. Antes de qualquer operação, valida que a
// conversa existe E pertence à organização do caller — garantia de tenant
// isolation mesmo se o controller esquecer.

const Message = require('./message.model');
const Conversation = require('../conversation/conversation.model');

const VALID_DIRECTIONS = ['in', 'out'];

exports.VALID_DIRECTIONS = VALID_DIRECTIONS;

/**
 * Garante que a conversa existe na organização. Retorna a conversa ou null.
 */
async function assertConversationOwned(organizationId, conversationId) {
  return Conversation.findById(organizationId, conversationId);
}

exports.listByConversation = async (organizationId, conversationId, pagination) => {
  const conv = await assertConversationOwned(organizationId, conversationId);
  if (!conv) return null;
  const rows = await Message.listByConversation(conversationId, pagination);
  return { conversation: conv, messages: rows };
};

exports.createInConversation = async (organizationId, conversationId, { direction, content, flowNodeId, metadata }) => {
  const conv = await assertConversationOwned(organizationId, conversationId);
  if (!conv) return null;
  const row = await Message.create({
    conversationId,
    flowNodeId,
    direction,
    content,
    metadata,
  });
  return row;
};
