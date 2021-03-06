'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserActivity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      UserActivity.belongsTo(models.User, {
        foreignKey: 'user_id', 
        //as: 'user'
      })
      UserActivity.belongsTo(models.Activity, {
        foreignKey: 'activity_id', 
        //as: 'user'
      })      
    }
  }
  UserActivity.init({
    user_id: DataTypes.INTEGER,
    activity_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'UserActivity',
    tableName: 'users_activities'
  });
  return UserActivity;
};