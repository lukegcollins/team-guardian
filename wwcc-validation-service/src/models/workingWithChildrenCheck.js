// Import required modules and files
const { DataTypes } = require("sequelize");

/**
 * 
 * @param {object} sequelize - sequelize object
 * @returns {object} WWCC model
 * @exports WorkingWithChildrenCheck model
 * @example const WWCC = require('./workingWithChildrenCheck.js')(sequelize, Sequelize);
 */
module.exports = (sequelize) => {
    const WWCC = sequelize.define("WorkingWithChildrenCheck", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        typeId: {
            type: DataTypes.INTEGER,
            primaryKey: false,
            autoIncrement: false,
            allowNull: false,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        registrationNumber: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        expiryDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        isValidated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    WWCC.associate = (models) => {
        WWCC.belongsTo(models.CheckType, {
            foreignKey: {
                name: "typeId",
                allowNull: false,
                onDelete: "CASCADE", // Automatically delete associated checks when a check type is deleted
            },
        });
    };

    return WWCC;
};
