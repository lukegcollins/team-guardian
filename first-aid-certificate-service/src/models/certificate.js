// Import required modules and files
const { DataTypes } = require("sequelize");

/**
 * 
 * @param {object} sequelize - sequelize object
 * @returns {object} Certificate model
 * @exports Certificate model
 * @example const Certificate = require('./Certificate.js')(sequelize, Sequelize);
 */
module.exports = (sequelize) => {
    const Certificate = sequelize.define("Certificate", {
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
        issuedDate: {
            type: DataTypes.DATEONLY,
            allowNull: false,
        },
        isValidated: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    Certificate.associate = (models) => {
        Certificate.belongsTo(models.CertificateType, {
            foreignKey: {
                name: "typeId",
                allowNull: false,
                onDelete: "CASCADE", // Automatically delete associated certificates
            },
        });
    };

    return Certificate;
};
