// Import required modules and files
const { DataTypes } = require("sequelize");

/**
 * Team model
 * @param {object} sequelize - sequelize object
 * @returns {object} Check Type model
 * @exports CheckType model
 * @example const CheckType = require('./checkType.js')(sequelize, Sequelize);
 */
module.exports = (sequelize) => {
    const CheckType = sequelize.define("CheckType", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        description: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        }
    });


    return CheckType;
};
