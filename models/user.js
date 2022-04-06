const bcrypt = require('bcrypt')
'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Availability, {
        foreignKey: 'user_id', 
        //as: 'availabilities'
      })
      User.hasMany(models.UserActivity, {
        foreignKey: 'user_id', 
        //as: 'availabilities'
      })
      User.belongsToMany(models.Activity, { 
        through: models.UserActivity,
        //as: 'activities',
        foreignKey: 'user_id'
      })
      User.belongsToMany(models.Group, { 
        through: models.UserGroup,
        //as: 'groups',
        foreignKey: 'user_id'
      })
    }

    toJSON() {
      return {...this.get(), id: undefined, password: undefined, confirmation_status: undefined, confirmation_code: undefined}
    }

    async validPassword(password) {
      return await bcrypt.compare(password, this.password);
  }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    email: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    age: DataTypes.INTEGER,
    confirmation_status: {
      type: DataTypes.STRING,
      defaultValue: 'Pending',
      validate: {
        isIn: [['Pending', 'Active']]
      }
    },
    confirmation_code: {
      type: DataTypes.STRING,
      unique: true
    }
  }, {
    sequelize,
    modelName: 'User',
    tableName: 'users',
    hooks: {
      beforeCreate: async (user) => {
        if(user.password) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
      beforeUpdate: async (user) => {
        if(user.changed('password')) {
          user.password = await bcrypt.hash(user.password, 10)
        }
      },
    }
  });
  return User;
};