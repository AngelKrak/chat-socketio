import { Server } from 'socket.io';
import sequelize from '../lib/sequelize';
import Message from '../models/Message';

let io;

const initializeSocket = async (req, res) => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }

  if (!io) {
    await sequelize.sync();
    console.log('Database connected successfully');

    console.log('Initializing Socket.IO');

    // io = new Server(res.socket.server);
    io = new Server(res.socket.server, {
      path: '/api/socket',
      addTrailingSlash: false,
    });
    res.socket.server.io = io;

    io.on('connection', async (socket) => {
      console.log('New client connected');

      // Enviar los mensajes existentes al cliente
      const messages = await Message.findAll({ order: [['timestamp', 'ASC']] });
      socket.emit('loadMessages', messages);

      socket.on('message', async (msg, callback) => {
        console.log('Message received:', msg);

        try {
          // Guardar el mensaje en la base de datos
          const message = await Message.create({ text: msg });

          io.emit('message', message); // Broadcast the message to all clients

          /*io.emit('message', {
            text: msg,
            timestamp: '2024-03-28',
          });*/
          if (callback) callback({ status: 'ok' }); // Enviar confirmación al cliente
        } catch (error) {
          console.error('Error saving message:', error);
          if (callback)
            callback({ status: 'error', error: 'Failed to save message' }); // Enviar error al cliente
        }
      });

      socket.on('disconnect', () => {
        console.log('Client disconnected');
      });
    });
  }
  return res;
};

export default initializeSocket;
