import { getRequestContext } from "@cloudflare/next-on-pages";


export const runtime = 'edge'

export async function GET() {

  // In the edge runtime you can use Bindings that are available in your application
  // (for more details see:
  //    - https://developers.cloudflare.com/pages/framework-guides/deploy-a-nextjs-site/#use-bindings-in-your-nextjs-application
  //    - https://developers.cloudflare.com/pages/functions/bindings/
  // )
  //
  // KV Example:
  const res = await getRequestContext().env.DB.prepare('SELECT * FROM users').all();
  console.log(res);

  return new Response(JSON.stringify(res))
}
