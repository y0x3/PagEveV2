import 'dotenv/config';

export const prerender = false; // Marca este endpoint como dinámico (server-rendered)

export async function POST() {
    const deployHookUrl = process.env.VERCEL_DEPLOY_HOOK_URL;
  
    if (!deployHookUrl) {
      return new Response(JSON.stringify({ error: 'Falta la URL del webhook de Vercel' }), { status: 500 });
    }
  
    try {
      const response = await fetch(deployHookUrl, {
        method: 'POST',
      });
  
      if (!response.ok) {
        const errorText = await response.text();
        return new Response(JSON.stringify({ error: 'Error al disparar el redeploy', details: errorText }), {
          status: response.status,
        });
      }
  
      return new Response(JSON.stringify({ message: 'Redeploy disparado exitosamente' }), { status: 200 });
    } catch (error) {
      return new Response(JSON.stringify({ error: 'Error al conectar con la API de Vercel' }), { status: 500 });
    }
  }
  