import initializeSocket from '../../../middleware/socket';
import { NextResponse } from "next/server";

export async function GET(req) {
  await initializeSocket(req, Response);
  Response.json({ message: 'Socket.IO initialized' });
}
