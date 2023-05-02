// Import required modules and files
const { DataTypes } = require("sequelize");

/**
 * Team model
 * @param {object} sequelize - sequelize object
 * @returns {object} Team model
 * @exports Team model
 * @example const Team = require('./team.js')(sequelize, Sequelize);
 */
module.exports = (sequelize) => {
    const Team = sequelize.define("Team", {
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
    });

    // Team.associate = (models) => {
    //     Team.hasMany(models.Membership, {
    //         foreignKey: {
    //             name: "teamId",
    //             allowNull: false,
    //         },
    //     });
    // };

    return Team;
};
