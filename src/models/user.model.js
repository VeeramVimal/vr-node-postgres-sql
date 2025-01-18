const { roles } = require('../config/roles');
const bcrypt = require('bcryptjs');
const { USER } = require('../constants/tables');

module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define(
        USER, {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING(50),
                allowNull: false
            },
            phoneNumber: {
                type: DataTypes.STRING(100),
                allowNull: true
            },
            email: {
                type: DataTypes.STRING(100),
                allowNull: false
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                required: true,
                trim: true,
                minlength: 8,
                validate(value) {
                    if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
                        throw new Error('Password must contain at least one letter and one number');
                    }
                },
            },
            roleName: {
                type: DataTypes.ENUM,
                allowNull: false,
                values: roles,
                defaultValue: 'user',
            },
            userStatus: {
                type: DataTypes.ENUM,
                allowNull: false,
                values: ["Active", "in-active"],
                defaultValue: 'Active',
            },
            isVerified: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            createdBy: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            createdAt: {
                type: DataTypes.DATE(3),
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            },
            updatedBy: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
            updatedAt: {
                type: DataTypes.DATE(3),
                defaultValue: sequelize.literal('CURRENT_TIMESTAMP')
            }
        }, {
            timestamps: false,
            tableName: "users",
        });
        User.associate = function (models) {
        };
    
        User.beforeCreate(async (user) => {
            user.password = await bcrypt.hash(user.password, 8);
        });
    
        User.beforeUpdate(async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 8);
            }
        });
    
        User.prototype.isPasswordMatch = async function (password) {
            const user = this;
            return bcrypt.compare(password, user.password);
        };
        User.prototype.toJSON = function () {
            var values = Object.assign({}, this.get());
    
            delete values.password;
            return values;
        }
    
        User.sync();
        return User;
}