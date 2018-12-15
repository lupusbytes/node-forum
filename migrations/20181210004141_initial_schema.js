exports.up = function (knex, Promise) {
    const schema = knex.schema
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
            table.foreign('category_id').references('categories.id');
            table.integer('created_by').unsigned().notNullable();
            table.foreign('created_by').references('users.id');
            table.dateTime('created_at').defaultTo(knex.fn.now());
            table.dateTime('last_activity').defaultTo(knex.fn.now());
        })
        .createTable('posts', function (table) {
            table.increments('id').primary();
            table.string('content').notNullable();
            table.integer('thread_id').unsigned().notNullable();
            table.foreign('thread_id').references('threads.id');
            table.integer('created_by').unsigned().notNullable();
            table.foreign('created_by').references('users.id');
            table.dateTime('created_at').defaultTo(knex.fn.now());
        })
    return schema;
};

exports.down = function (knex, Promise) {
    return knex.schema
        .dropTableIfExists('posts')
        .dropTableIfExists('threads')
        .dropTableIfExists('categories')
        .dropTableIfExists('users')

};
