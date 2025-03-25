import { getRequestContext } from "@cloudflare/next-on-pages"; 


export const runtime = 'edge'

export async function GET() {

  const data = await getRequestContext().env.DB.prepare('SELECT * FROM users').all();
  console.log(data.results);

  return new Response(JSON.stringify(data.results))
}
