const { Model } = require('objection');

class Thread extends Model {
    static get tableName() {
        return "threads";
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
                created_at: { type: 'dateTime' },
                last_activity: { type: 'dateTime'}
            }
        }
    }
}
module.exports = Thread;