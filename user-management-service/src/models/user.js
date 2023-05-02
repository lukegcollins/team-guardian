const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
    const User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        firstName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        lastName: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                isEmail: true,
            },
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: false,
        },
        activeAt: {
            type: DataTypes.DATE,
            allowNull: true,
            unique: false,
        },
    });

    User.associate = (models) => {
        User.belongsTo(models.Role, {
            foreignKey: {
                name: "roleId",
                allowNull: false,
            },
        });
    };
    return User;
};
