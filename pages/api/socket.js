import initializeSocket from "../../middleware/socket";

export default async function handler(req, res) {
  await initializeSocket(req, res);
  res.json({
    message: "Socket.IO initialized"
  });
}