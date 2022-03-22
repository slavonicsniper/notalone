'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Availability extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Availability.belongsTo(models.User, {
        foreignKey: 'user_id', 
        as: 'user'
      })
    }

    toJSON() {
      return {...this.get(), id: undefined, user_id: undefined}
    }
  }
  Availability.init({
    day: DataTypes.STRING,
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    start_time: DataTypes.STRING,
    end_time: DataTypes.STRING,
    user_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Availability',
    tableName: 'availabilities'
  });
  return Availability;
};