const Sequelize = require('sequelize');

const connection = new Sequelize('guilhermino_blog', 'root', '', {
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;