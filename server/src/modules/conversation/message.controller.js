// server/src/modules/conversation/message.controller.js
//
// Endpoints aninhados em /conversations/:conversationId/messages.
// authRequired e CSRF (em POST) já são aplicados nos níveis acima — aqui só
// validamos input e delegamos pro service, que faz o tenant-check.

const service = require('./message.service');

exports.list = async (req, res, next) => {
  try {
    const { organizationId } = req.auth;
    const { conversationId } = req.params;
    const { limit, offset } = req.query;
    const result = await service.listByConversation(organizationId, conversationId, { limit, offset });
    if (!result) {
      return res.status(404).json({ error: 'Conversa não encontrada', code: 'NOT_FOUND' });
    }
    res.json(result.messages);
  } catch (err) {
    next(err);
  }
};

exports.create = async (req, res, next) => {
  try {
    const { organizationId } = req.auth;
    const { conversationId } = req.params;
    const { direction, content, flowNodeId, metadata } = req.body || {};

    if (!direction || !service.VALID_DIRECTIONS.includes(direction)) {
      return res.status(400).json({
        error: `direction inválido (use ${service.VALID_DIRECTIONS.join(' ou ')})`,
        code: 'BAD_REQUEST',
      });
    }
    if (typeof content !== 'string' || !content.trim()) {
      return res.status(400).json({ error: 'content é obrigatório', code: 'BAD_REQUEST' });
    }

    const row = await service.createInConversation(organizationId, conversationId, {
      direction,
      content: content.trim(),
      flowNodeId,
      metadata,
    });
    if (!row) {
      return res.status(404).json({ error: 'Conversa não encontrada', code: 'NOT_FOUND' });
    }
    res.status(201).json(row);
  } catch (err) {
    next(err);
  }
};
