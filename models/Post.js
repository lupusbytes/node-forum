const { Model } = require('objection');

class Post extends Model {
    static get tableName() {
        return "threads";
    }
    static get jsonSchema() {
        return {
            type: 'object',
            
            properties: {
                id: { type: 'integer' },
                content: { type: 'string' },
                created_by: { type: 'integer'},
                created_at: { type: 'dateTime' },
                thread_id: { type: 'integer' }
            }
        }
    }
}
module.exports = Post;