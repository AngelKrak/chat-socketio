import { NextResponse } from 'next/server';

// Función para obtener la dirección IP desde una API externa
async function getIPAddress() {
  try {
    const response = await fetch('https://echo.free.beeceptor.com');
    if (!response.ok) {
      throw new Error('Failed to fetch IP address');
    }
    const data = await response.text();
    console.log(data);
    return data; // Devuelve la dirección IP obtenida
  } catch (error) {
    console.error('Error fetching IP address:', error.message);
    return null;
  }
}

// Función GET para manejar la solicitud GET a /api
export async function GET(request) {
  try {
    const ipAddress = await getIPAddress();
    return NextResponse.json(ipAddress, { status: 200 });
  } catch (error) {
    console.error('Error handling GET request:', error.message);
    return NextResponse.json(
      { error: 'Failed to fetch IP address' },
      { status: 500 }
    );
  }
}
