const { Model } = require('objection');

class User extends Model {
    static get tableName() {
        return "users";
    }
    static get jsonSchema() {
        return {
            type: 'object',
            // Unable to do partial updates if this is enabled ...
            //required: ['username', 'email', 'password'],

            properties: {
                id: { type: 'integer' },
                username: { type: 'string' },
                email: { type: 'string' },
                password: { type: 'string' },
                created_at: { type: 'dateTime' },
                last_online: { type: 'dateTime' }
            }
        }
    }
}
module.exports = User;