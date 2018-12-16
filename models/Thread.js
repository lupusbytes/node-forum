const { Model } = require('objection');
const Post = require('./Post');
const User = require('./User');

class Thread extends Model {
    static get tableName() {
        return "threads";
    }
    static get relationMappings() {
        return {
            posts: {
                relation: Model.HasManyRelation,
                modelClass: Post,
                join: {
                    from: 'posts.thread_id',
                    to: 'threads.id'
                }
            },
            creator: {
                relation: Model.HasOneRelation,
                modelClass: User,
                join: {
                    from: 'threads.created_by',
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
                name: { type: 'string' },
                created_by: { type: 'integer' },
                created_at: { type: 'dateTime' },
                last_activity: { type: 'dateTime' }
            }
        }
    }
}
module.exports = Thread;