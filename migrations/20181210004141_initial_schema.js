exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary();
            table.string('username');
            table.string('password');
            table.string('email');
            table.dateTime('created_at').defaultTo(knex.fn.now());;
            table.dateTime('last_online').defaultTo(knex.fn.now());;
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTableIfExists('users')
};
