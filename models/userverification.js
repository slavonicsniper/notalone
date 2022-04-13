'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserVerification extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  UserVerification.init({
    email_confirmation: DataTypes.STRING,
    password_reset: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'UserVerification',
    tableName: 'user_verifications'
  });
  return UserVerification;
};