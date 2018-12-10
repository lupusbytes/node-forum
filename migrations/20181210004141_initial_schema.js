exports.up = function (knex, Promise) {
    return knex.schema
        .createTable('users', function (table) {
            table.increments('id').primary();
            table.string('username');
            table.string('password');
            table.string('email');
            table.dateTime('created_at');
            table.dateTime('last_online');
        })
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTableIfExists('users')
};
