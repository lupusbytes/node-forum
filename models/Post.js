const { Model } = require('objection');
const User = require('./User');

class Post extends Model {
    static get tableName() {
        return "posts";
    }
    static get relationMappings() {
        return {
            creator: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'posts.created_by',
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
                content: { type: 'string' },
                created_by: { type: 'integer'},
                created_at: { type: 'dateTime' },
                thread_id: { type: 'integer' }
            }
        }
    }
}
module.exports = Post;