const sequelize = require('sequelize');
const DB = require('../config/database');

const TravelAgency = DB.define('user', {
    id: {
        type: sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
    },
    name: {
        type: sequelize.STRING,
        allowNull: false,
    },
    email: {
        type: sequelize.STRING,
        allowNull: false,
    },
    password: {
        type: sequelize.STRING,
        allowNull: false,
    },
    location: {
        type: sequelize.STRING,
        allowNull: false,
    },
    verified: {
        type: sequelize.BOOLEAN,
        allowNull: false,
    },
    credits: {
        type: sequelize.INTEGER,
        allowNull: false,
    },
})
return TravelAgency;
module.exports = TravelAgency;