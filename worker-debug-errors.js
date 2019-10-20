async function handleRequest(event) {
  const body = {message: 'Hello mocha!'};
  return new Response(JSON.stringify(body), { status: 200 })
}

// A wrapper function which only debugs errors the DEBUG_ERRORS variable is set
async function handle(event) {
  // If we're in production the DEBUG_ERRORS variable will not be set
  if (typeof DEBUG_ERRORS === 'undefined' || !DEBUG_ERRORS) {
    return handleRequest(event);
  }

  // Debug crashes in test and development
  try {
    const res =  await handleRequest(event);
    return res;
  } catch(err) {
    console.log(err);
    debugger;
  }
}

// eslint-disable-next-line no-restricted-globals
addEventListener('fetch', event => {
  event.respondWith(handle(event));
});
