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
        .createTable('categories', function (table) {
            table.increments('id').primary();
            table.string('name');
        })
        .createTable('threads', function (table) {
            table.increments('id').primary();
            table.string('name');
            table.integer('category_id').unsigned().notNullable();
            table.foreing('category_id').references('categories.id');
            table.dateTime('created_at').defaultTo(knex.fn.now());
            table.dateTime('last_activity').defaultTo(knex.fn.now());
        })
        .createTable('posts', function (table) {
            table.increments('id').primary();
            table.string('name');
            table.integer('thread_id').unsigned().notNullable();
            table.foreing('thread_id').references('threads.id');
            table.integer('user_id').unsigned().notNullable();
            table.integer('user_id').references('users.id');
            table.dateTime('created_at').defaultTo(knex.fn.now());
        });

};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTableIfExists('users')
};
