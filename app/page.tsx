'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import io, { Socket } from 'socket.io-client';

interface Message {
  text: string;
  timestamp: string;
}

const HomePage = () => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [status, setStatus] = useState<{
    type: string;
    message: string;
  } | null>(null);
  const [connectionStatus, setConnectionStatus] =
    useState<string>('Conectando...');

  useEffect(() => {
    // const socket = io();
    const socket = io("/", {
      path: '/api/socket/',
    });

    socket.on('connect', () => {
      setSocket(socket);
      setConnectionStatus('Conectado');
    });

    socket.on('disconnect', () => {
      setSocket(null);
      setConnectionStatus('Desconectado');
    });

    socket.on('connect_error', () => {
      setConnectionStatus('Error al conectar');
    });

    socket.on('loadMessages', (msgs: Message[]) => {
      setMessages(msgs);
    });

    socket.on('message', (msg: Message) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (socket && message.trim()) {
      socket.emit(
        'message',
        message,
        (response: { status: string; error?: string }) => {
          if (response.status === 'ok') {
            setStatus({
              type: 'success',
              message: '¡Mensaje enviado con éxito!',
            });
          } else {
            setStatus({
              type: 'error',
              message: response.error || 'Error al enviar el mensaje.',
            });
          }
        }
      );
      setMessage('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md w-full max-w-md p-6">
        <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">
          Chat con Next.js
        </h1>
        <div className="text-center mb-4">
          <span
            className={`p-2 rounded ${
              connectionStatus === 'Conectado'
                ? 'bg-green-200 text-green-800'
                : connectionStatus === 'Desconectado'
                ? 'bg-red-200 text-red-800'
                : 'bg-yellow-200 text-yellow-800'
            }`}
          >
            {connectionStatus}
          </span>
        </div>
        <div className="overflow-y-auto h-64 mb-4 bg-gray-50 p-4 rounded-lg shadow-inner">
          <ul className="space-y-3">
            {messages.map((msg, index) => (
              <li
                key={index}
                className="p-3 bg-blue-100 rounded-lg text-blue-900 shadow-sm"
              >
                {msg.text}
              </li>
            ))}
          </ul>
        </div>
        <form onSubmit={handleSubmit} className="flex items-center mb-4">
          <input
            type="text"
            value={message}
            onChange={handleInputChange}
            className="flex-grow p-3 border-t border-b border-l border-blue-300 rounded-l-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
            placeholder="Escribe tu mensaje..."
          />
          <button
            type="submit"
            className="p-3 bg-blue-500 text-white border-t border-b border-r border-blue-300 rounded-r-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            Enviar
          </button>
        </form>
        {status && (
          <div
            className={`p-3 rounded-lg text-center ${
              status.type === 'success'
                ? 'bg-green-200 text-green-800'
                : 'bg-red-200 text-red-800'
            }`}
          >
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
