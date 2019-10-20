async function handleRequest(event) {
  const { request } = event;
  // Fetch the response from the backend
  const response = await fetch(request);
  // The response is originally immutable, so we have to clone it in order to
  // set the cache headers.
  // https://community.cloudflare.com/t/how-can-we-remove-cookies-from-request-to-avoid-being-sent-to-origin/35239/2
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('my-header', 'some token');
  return newResponse;
}

// eslint-disable-next-line no-restricted-globals
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});
