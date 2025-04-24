import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

export default defineConfig({
  site: 'https://pag-eve-v2.vercel.app/', // Cambia esto por tu dominio en Vercel
  output: 'server', // Cambia el modo de salida a server-rendered
});
