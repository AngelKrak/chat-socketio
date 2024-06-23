// models/Message.js
import { DataTypes } from 'sequelize';
import sequelize from '../lib/sequelize';

const Message = sequelize.define('Message', {
  text: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  timestamp: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

export default Message;
