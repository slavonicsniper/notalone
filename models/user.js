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
        as: 'availabilities'
      })
      User.belongsToMany(models.Activity, { 
        through: models.UserActivity,
        as: 'activities',
        foreignKey: 'user_id'
      })
      User.belongsToMany(models.Group, { 
        through: models.UserGroup,
        as: 'groups',
        foreignKey: 'user_id'
      })
    }
  }
  User.init({
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    uuid: DataTypes.UUID,
    email: DataTypes.STRING,
    city: DataTypes.STRING,
    country: DataTypes.STRING,
    age: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};