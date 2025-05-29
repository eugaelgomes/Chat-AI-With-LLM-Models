import { cookies } from 'next/headers';
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const cookieStore = await cookies(); // sem await
  let sessionId = cookieStore.get('sessionId')?.value;

  if (!sessionId) {
    sessionId = uuidv4();

    const response = new Response(JSON.stringify({ sessionId }), {
      headers: {
        'Content-Type': 'application/json',
        'Set-Cookie': `sessionId=${sessionId}; Path=/; HttpOnly; Secure=${process.env.NODE_ENV === 'production'}; SameSite=Lax; Max-Age=${60 * 60 * 24 * 7}`
      },
    });

    return response;
  }

  return new Response(JSON.stringify({ sessionId }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
