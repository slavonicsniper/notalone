'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class InboxMessage extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      InboxMessage.belongsTo(models.User, {
        foreignKey: 'from',
        as: 'sender' 
      })
      InboxMessage.belongsTo(models.User, {
        foreignKey: 'to',
        as: 'receiver' 
      })
    }
    
    toJSON() {
      return {...this.get(), id: undefined, to: undefined, from: undefined}
    }
  }
  InboxMessage.init({
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4
    },
    from: DataTypes.UUID,
    to: DataTypes.UUID,
    message: DataTypes.STRING,
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    }
  }, {
    sequelize,
    modelName: 'InboxMessage',
    tableName: 'inbox_messages'
  });
  return InboxMessage;
};