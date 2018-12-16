const { Model } = require('objection');
const Thread = require('./Thread');

class Category extends Model {
    static get tableName() {
        return "categories";
    }
    static get relationMappings() {
        return {
            threads: {
                relation: Model.HasManyRelation,
                modelClass: Thread,
                join: {
                    from: 'threads.category_id',
                    to: 'categories.id'
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
            }
        }
    }
}
module.exports = Category;