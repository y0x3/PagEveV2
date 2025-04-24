import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import vercel from '@astrojs/vercel';

export default defineConfig({
  site: 'https://pag-eve-v2.vercel.app/', // Cambia esto por tu dominio en Vercel
  output: 'server', // Configura el proyecto como server-rendered
  adapter: vercel(), // Configura el adaptador de Vercel
  integrations: [react()],
});