import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';
import path from 'path';
import 'dotenv/config';

// Configura Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

async function generateCloudinaryJSON() {
  try {
    const { resources } = await cloudinary.search
      .expression('resource_type:image') // Devuelve todas las imágenes
      .sort_by('public_id', 'desc')
      .max_results(30)
      .execute();

    const images = resources.map((file) => file.secure_url);

    // Ruta donde se guardará el archivo JSON
    const outputPath = path.join(process.cwd(), 'public', 'api', 'cloudinary-list.json');

    // Guarda las URLs en un archivo JSON
    fs.writeFileSync(outputPath, JSON.stringify({ images }, null, 2));
    console.log(`Archivo JSON generado en: ${outputPath}`);
  } catch (error) {
    console.error('Error al generar el archivo JSON:', error);
  }
}

generateCloudinaryJSON();