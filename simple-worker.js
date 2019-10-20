async function handleRequest(event) {
  const body = {message: 'Hello mocha!'};
  return new Response(JSON.stringify(body), { status: 200 })
}

// eslint-disable-next-line no-restricted-globals
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});
