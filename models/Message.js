const { Model } = require('objection');
const User = require('./User');

class Message extends Model {
    static get tableName() {
        return "messages";
    }
    static get relationMappings() {
        return {
            creator: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'messages.created_by',
                    to: 'users.id'
                }
            }
        };
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                text: { type: 'string' },
                created_by: { type: 'integer'},
                created_at: { type: 'dateTime' },
            }
        }
    }
}
module.exports = Message;