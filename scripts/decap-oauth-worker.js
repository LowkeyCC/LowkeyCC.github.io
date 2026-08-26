const CLIENT_ID = 'Ov23li3mlsNwQiC8S3rE';
const CLIENT_SECRET = '54bcfbffe476d6e81a4842a26d80d6d00daf506b';
const REDIRECT_URI = 'https://jekyll.lowkeycc54.workers.dev/callback';

function html(body) {
  return new Response(
    '<!doctype html><html><head><meta charset="utf-8"></head><body>' + body + '</body></html>',
    { headers: { 'content-type': 'text/html; charset=utf-8' } }
  );
}

async function handleRequest(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');

  // Étape 1 : la popup vient d'ouvrir (aucun code). On prévient Decap ("authorizing")
  // puis on redirige la popup vers GitHub pour l'autorisation.
  if (!code) {
    const scope = url.searchParams.get('scope') || 'repo';
    const ghAuth = 'https://github.com/login/oauth/authorize'
      + '?client_id=' + encodeURIComponent(CLIENT_ID)
      + '&redirect_uri=' + encodeURIComponent(REDIRECT_URI)
      + '&scope=' + encodeURIComponent(scope)
      + '&state=' + encodeURIComponent(url.searchParams.get('state') || 'x');
    return html(
      '<script>'
      + 'try { if (window.opener) window.opener.postMessage("authorizing:github", "*"); } catch (e) {}'
      + 'window.location.href = ' + JSON.stringify(ghAuth) + ';'
      + '</script>'
    );
  }

  // GitHub a redirigé la popup vers nous avec un code (ou une erreur).
  if (url.searchParams.has('error')) {
    const err = url.searchParams.get('error_description') || url.searchParams.get('error');
    return html(
      '<script>'
      + 'try { if (window.opener) window.opener.postMessage("authorization:github:error:" + JSON.stringify({ message: '
      + JSON.stringify(err) + ' }), "*"); } catch (e) {}'
      + 'window.close();'
      + '</script>'
    );
  }

  // Étape 2 : on échange le code contre un token GitHub.
  const resp = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      code,
      redirect_uri: REDIRECT_URI,
    }),
  });
  const data = await resp.json();
  const token = data.access_token;

  if (!token) {
    return html(
      '<script>'
      + 'try { if (window.opener) window.opener.postMessage("authorization:github:error:" + JSON.stringify({ message: "No access_token" }), "*"); } catch (e) {}'
      + 'window.close();'
      + '</script>'
    );
  }

  // Étape 3 : on renvoie le token à Decap via postMessage, puis on ferme la popup.
  return html(
    '<script>'
    + 'try { if (window.opener) window.opener.postMessage("authorization:github:success:" + JSON.stringify({ token: '
    + JSON.stringify(token) + ' }), "*"); } catch (e) {}'
    + 'window.close();'
    + '</script>'
  );
}

addEventListener('fetch', (e) => e.respondWith(handleRequest(e.request)));
