import 'dotenv/config';

export async function POST() {
  const vercelToken = process.env.VERCEL_DEPLOY_TOKEN; // Token de Vercel
  const vercelProject = process.env.VERCEL_PROJECT_NAME; // Nombre del proyecto en Vercel
  const vercelTeam = process.env.VERCEL_TEAM_NAME; // Opcional: Nombre del equipo en Vercel

  if (!vercelToken || !vercelProject) {
    return new Response(JSON.stringify({ error: 'Faltan variables de entorno para Vercel' }), { status: 500 });
  }

  const url = `https://api.vercel.com/v1/integrations/deploy/${vercelProject}${
    vercelTeam ? `?teamId=${vercelTeam}` : ''
  }`;

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${vercelToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        force: true, // Fuerza un nuevo despliegue
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error al disparar el redeploy:', errorText);
      return new Response(JSON.stringify({ error: 'Error al disparar el redeploy', details: errorText }), {
        status: response.status,
      });
    }

    return new Response(JSON.stringify({ message: 'Redeploy disparado exitosamente' }), { status: 200 });
  } catch (error) {
    console.error('Error al conectar con la API de Vercel:', error);
    return new Response(JSON.stringify({ error: 'Error al conectar con la API de Vercel' }), { status: 500 });
  }
}