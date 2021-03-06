'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Activity extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Activity.belongsToMany(models.User, { 
        through: models.UserActivity,
        as: 'users',
        foreignKey: 'activity_id'
      })
      Activity.hasMany(models.Group, {
        foreignKey: 'activity_id', 
        as: 'groups'
      })
      Activity.hasMany(models.UserActivity, {
        foreignKey: 'activity_id',
        //as: 'availabilities'
      })
    }

    toJSON() {
      return {...this.get(), id: undefined}
    }
  }
  Activity.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    name: DataTypes.STRING,
    type: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Activity',
    tableName: 'activities'
  });
  return Activity;
};