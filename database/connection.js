var knex = require('knex')({
    client: 'mysql2',
    connection: {
        host: 'localhost',
        user: 'root',
        password: 'grande123',
        database: 'meutopsite'
    }
});



module.exports = knex