import 'dotenv/config';

export async function GET({ url }) {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Faltan variables de entorno:', { cloudName, apiKey, apiSecret });
    return new Response(JSON.stringify({ error: 'Faltan variables de entorno de Cloudinary' }), { status: 500 });
  }

  // Obtén el cursor de la URL de la solicitud
  const nextCursor = url.searchParams.get('next_cursor') || '';

  const apiUrl = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?direction=desc&max_results=20${nextCursor ? `&next_cursor=${nextCursor}` : ''}`;

  let auth;
  try {
    auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  } catch (e) {
    const { Buffer } = await import('buffer');
    auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  }

  let response;
  try {
    response = await fetch(apiUrl, {
      headers: {
        Authorization: `Basic ${auth}`,
      },
    });
  } catch (err) {
    console.error('Error al hacer fetch:', err);
    return new Response(JSON.stringify({ error: 'Error al conectar con Cloudinary' }), { status: 500 });
  }

  if (!response.ok) {
    const text = await response.text();
    console.error('Error al obtener imágenes de Cloudinary:', text);
    return new Response(JSON.stringify({ 
      error: 'Error al obtener imágenes', 
      status: response.status, 
      details: text 
    }), { status: response.status });
  }

  const data = await response.json();
  const images = data.resources.map(img => img.secure_url);

  return new Response(JSON.stringify({ 
    images, 
    next_cursor: data.next_cursor || null // Devuelve el cursor para la siguiente página
  }), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'no-store', // Desactiva el caché
    },
  });
}