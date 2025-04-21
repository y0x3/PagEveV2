import 'dotenv/config';
import { v2 as cloudinary } from 'cloudinary';

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function get(req, res) {
  try {
    const { resources } = await cloudinary.search
      .expression('resource_type:image') // Devuelve todas las imágenes
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    const images = resources.map((file) => file.secure_url);
    return res.json({ images });
  } catch (error) {
    console.error('Error al obtener las imágenes:', error);
    return res.status(500).json({ error: 'Error al obtener las imágenes' });
  }
}

export async function GET() {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('Faltan variables de entorno:', { cloudName, apiKey, apiSecret });
    return new Response(JSON.stringify({ error: 'Faltan variables de entorno de Cloudinary' }), { status: 500 });
  }

  // URL con parámetros opcionales: orden descendente y límite de resultados
  const url = `https://api.cloudinary.com/v1_1/${cloudName}/resources/image?direction=desc&max_results=20`;

  // Autenticación básica
  let auth;
  try {
    auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  } catch (e) {
    const { Buffer } = await import('buffer');
    auth = Buffer.from(`${apiKey}:${apiSecret}`).toString('base64');
  }

  let response;
  try {
    response = await fetch(url, {
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

  return new Response(JSON.stringify({ images }), {
    headers: { 'Content-Type': 'application/json' },
  });
}