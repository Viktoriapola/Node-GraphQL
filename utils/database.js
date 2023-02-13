const Sequelize = require('sequelize')
const DB_NAME = 'to-do'
const USER_NAME = 'root'
const PASSWORD = 'Ozesag1996'

const sequelize = new Sequelize(DB_NAME, USER_NAME, PASSWORD, {
    host: 'localhost',
    dialect: 'mysql'
})

module.exports = sequelize