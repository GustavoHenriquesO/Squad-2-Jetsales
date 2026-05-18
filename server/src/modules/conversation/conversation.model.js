// server/src/modules/conversation/conversation.model.js
//
// Acesso direto à tabela `conversations`. Schema definido em
// 20260504_001_initial_schema.js. TODAS as queries filtram por
// organization_id — multi-tenant é regra do projeto.

const db = require('../../database');

const TABLE = 'conversations';

/* Colunas que existem na tabela (defensivo: limita SELECT pra não vazar nada
   inesperado se alguém alterar o schema sem cuidado). */
const COLUMNS = [
  'id',
  'organization_id',
  'contact_id',
  'chatbot_id',
  'whatsapp_connection_id',
  'status',
  'current_flow_path',
  'flow_context',
  'current_node_id',
  'unread_count',
  'last_message_preview',
  'last_message_at',
  'closed_at',
  'created_at',
  'updated_at',
];

/**
 * Lista conversas da organização, com paginação opcional.
 * Filtros aceitos: contact_id, chatbot_id, status.
 */
async function listByOrganization(organizationId, { contactId, chatbotId, status, limit = 50, offset = 0 } = {}) {
  const query = db(TABLE)
    .select(COLUMNS)
    .where({ organization_id: organizationId })
    .orderBy('created_at', 'desc')
    .limit(Math.min(Math.max(Number(limit) || 50, 1), 200))
    .offset(Math.max(Number(offset) || 0, 0));

  if (contactId) query.where({ contact_id: contactId });
  if (chatbotId) query.where({ chatbot_id: chatbotId });
  if (status) query.where({ status });

  return query;
}

async function findById(organizationId, id) {
  return db(TABLE)
    .select(COLUMNS)
    .where({ organization_id: organizationId, id })
    .first();
}

module.exports = { listByOrganization, findById };
