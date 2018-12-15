const { Model } = require('objection');
const Thread = require('./Thread');

class Category extends Model {
    static get tableName() {
        return "threads";
    }
    static get jsonSchema() {
        return {
            type: 'object',
            relation: Model.HasManyRelation,
            modelClass: Thread,
            join: {
                from: 'threads.category_id',
                to: 'category.id'
            },
            properties: {
                id: { type: 'integer' },
                name: { type: 'string' },
            }
        }
    }
}
module.exports = Category;