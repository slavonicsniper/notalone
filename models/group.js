'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Group extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Group.belongsTo(models.Activity, {
        foreignKey: 'activity_id', 
        as: 'activity'
      })
      Group.belongsToMany(models.User, { 
        through: models.UserGroup,
        as: 'users',
        foreignKey: 'group_id'
      })
    }
  }
  Group.init({
    name: DataTypes.STRING,
    activity_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Group',
  });
  return Group;
};