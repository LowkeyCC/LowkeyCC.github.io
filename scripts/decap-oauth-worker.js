// Decap CMS — GitHub OAuth callback pour GitHub Pages
// Déployer sur Cloudflare Workers (gratuit) :
//   1. workers.dev -> "Create Worker" -> coller ce code
//   2. Settings -> Variables -> ajouter CLIENT_ID et CLIENT_SECRET (GitHub OAuth App)
//   3. Le sous-domaine obtenu (ex: carnival-cms.truc.workers.dev) va dans config.yml (auth_endpoint + app_id)

const SITE_URL = 'https://lowkeycc.github.io';

async function handleRequest(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  if (!code) return new Response('Missing code', { status: 400 });

  const resp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code
    })
  });
  const data = await resp.json();
  const token = data.access_token;
  if (!token) return new Response('No token: ' + JSON.stringify(data), { status: 400 });

  return Response.redirect(SITE_URL + '/admin/#/auth/' + token, 302);
}

addEventListener('fetch', (e) => e.respondWith(handleRequest(e.request)));
