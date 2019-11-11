import * as typescript from 'typescript';

async function handleRequest(event) {
  const code = await event.request.text()
  const compilerOptions = {module: typescript.ModuleKind.CommonJS};
  const compiled = typescript.transpileModule(code, compilerOptions);
  return new Response(compiled.outputText);
}

// eslint-disable-next-line no-restricted-globals
addEventListener('fetch', event => {
  event.respondWith(handleRequest(event));
});
