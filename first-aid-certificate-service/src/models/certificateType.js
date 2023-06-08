// Import required modules and files
const { DataTypes } = require("sequelize");

/**
 * Team model
 * @param {object} sequelize - sequelize object
 * @returns {object} CertificateType model
 * @exports CertificateType model
 * @example const CertificateType = require('./certificateType.js')(sequelize, Sequelize);
 */
module.exports = (sequelize) => {
    const CertificateType = sequelize.define("Certificate Type", {
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
        },
        yearsBeforeRefresher: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: false,
            default: 3,
        },
    });


    return CertificateType;
};
