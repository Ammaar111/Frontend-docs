// Builds lesson `setup` code that defines a fake `fetch`, so API lessons run
// without a network and checks can control delays and failures.
//
// routes: { "GET /api/users/1": { status, body, text, delay, echo, network } }
//   status   HTTP status (default 200)
//   body     JSON body
//   text     raw body text instead (lets a lesson send malformed JSON)
//   delay    ms before the response (default `defaultDelay`)
//   echo     respond with { id: echo, ...requestBody } (for POST/PUT/PATCH)
//   network  true: reject with TypeError("Failed to fetch"), like a dropped connection
//
// The setup also exposes, to checks and to the page:
//   __requests  every request made: { method, url, body, headers, aborted }
//   __api       { offline, overrides, delays }: change behaviour mid-check
export function mockApi(routes, { defaultDelay = 15 } = {}) {
  return `
const __routes = ${JSON.stringify(routes)};
const __requests = [];
const __api = { offline: false, overrides: {}, delays: {} };
globalThis.__requests = __requests;
globalThis.__api = __api;

function __abortError() {
  const error = new Error("The operation was aborted.");
  error.name = "AbortError";
  return error;
}

function __response(status, body, text) {
  const raw = text !== undefined ? text : body === undefined ? "" : JSON.stringify(body);
  const statusText = { 200: "OK", 201: "Created", 204: "No Content", 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 429: "Too Many Requests", 500: "Internal Server Error", 503: "Service Unavailable" }[status] || "";
  return {
    ok: status >= 200 && status < 300,
    status,
    statusText,
    headers: { get: (name) => (String(name).toLowerCase() === "content-type" ? "application/json" : null) },
    json: async () => JSON.parse(raw),
    text: async () => raw,
  };
}

function fetch(input, options = {}) {
  const url = String(input).replace(/^https?:\\/\\/[^/]+/, "");
  const method = String(options.method || "GET").toUpperCase();
  const headers = options.headers || {};
  const record = { method, url, body: options.body === undefined ? null : options.body, headers, aborted: false };
  __requests.push(record);

  return new Promise((resolve, reject) => {
    if (options.signal && options.signal.aborted) {
      record.aborted = true;
      reject(__abortError());
      return;
    }
    const key = method + " " + url;
    const bare = method + " " + url.split("?")[0];
    const route = __api.overrides[key] || __api.overrides[bare] || __routes[key] || __routes[bare];
    const delay = __api.delays[key] ?? __api.delays[bare] ?? (route && route.delay) ?? ${defaultDelay};

    const timer = setTimeout(() => {
      if (__api.offline || (route && route.network)) {
        reject(new TypeError("Failed to fetch"));
        return;
      }
      if (!route) {
        resolve(__response(404, { error: "Not found" }));
        return;
      }
      let body = route.body;
      if (route.echo !== undefined) {
        let sent = {};
        try { sent = JSON.parse(options.body); } catch { sent = {}; }
        body = { id: route.echo, ...sent };
      }
      resolve(__response(route.status || 200, body, route.text));
    }, delay);

    if (options.signal) {
      options.signal.addEventListener("abort", () => {
        clearTimeout(timer);
        record.aborted = true;
        reject(__abortError());
      });
    }
  });
}
globalThis.__mockFetch = fetch;
`;
}
