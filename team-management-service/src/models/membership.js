// Import required modules and files
const { DataTypes } = require("sequelize");

/**
 * 
 * @param {object} sequelize - sequelize object
 * @returns {object} Membership model
 * @exports Membership model
 * @example const Membership = require('./membership.js')(sequelize, Sequelize);
 */
module.exports = (sequelize) => {
    const Membership = sequelize.define("Membership", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
        },
        isManager: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            default: false,
        },
    });

    Membership.associate = (models) => {
        Membership.belongsTo(models.Team, {
            foreignKey: {
                name: "teamId",
                allowNull: false,
                onDelete: "CASCADE", // Automatically delete associated memberships
            },
        });
    };

    return Membership;
};
