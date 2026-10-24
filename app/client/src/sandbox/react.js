// React lessons: the learner's JSX is compiled with Sucrase, run once to
// define its components, then each check mounts a fresh copy of the
// component and interacts with it.
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as ReactDOMClient from 'react-dom/client';
import * as ReactRouter from 'react-router-dom';
import { transform } from 'sucrase';
import {
  LearnerSyntaxError,
  addStyle,
  compileProgram,
  createState,
  describeFatal,
  domHelpers,
  installEnvironment,
  newGuard,
  runChecks,
  settle,
} from './harness.js';

let currentPath = '/';

// The sandbox's origin is opaque, so the History API cannot change its URL.
// Browser routers become memory routers, starting at the path a check asks for.
const router = {
  ...ReactRouter,
  BrowserRouter: (props) => React.createElement(ReactRouter.MemoryRouter, { initialEntries: [currentPath], ...props }),
  HashRouter: (props) => React.createElement(ReactRouter.MemoryRouter, { initialEntries: [currentPath], ...props }),
  createBrowserRouter: (routes, options) => ReactRouter.createMemoryRouter(routes, { initialEntries: [currentPath], ...options }),
  createHashRouter: (routes, options) => ReactRouter.createMemoryRouter(routes, { initialEntries: [currentPath], ...options }),
};

const MODULES = {
  react: React,
  'react-dom': ReactDOM,
  'react-dom/client': ReactDOMClient,
  'react-router-dom': router,
  'react-router': router,
};

function requireModule(name) {
  if (MODULES[name]) return MODULES[name];
  if (/\.(css|scss|svg|png|jpe?g)$/.test(name)) return {};
  throw new Error(`"${name}" cannot be imported here. This sandbox has react, react-dom and react-router-dom.`);
}

class Boundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { error: null };
  }
  static getDerivedStateFromError(error) {
    return { error };
  }
  componentDidCatch(error) {
    this.props.onError(error);
  }
  render() {
    return this.state.error ? React.createElement('div', { 'data-sandbox-crash': '' }) : this.props.children;
  }
}

export function compileJsx(code) {
  try {
    return transform(code, {
      transforms: ['jsx', 'imports'],
      production: true,
      jsxRuntime: 'classic',
      filePath: 'App.jsx',
    }).code;
  } catch (err) {
    const message = String(err.message)
      .replace(/^Error transforming App\.jsx:\s*/, '')
      .replace(/\s*\((\d+):(\d+)\)$/, (match, line, column) => ` (line ${line}, column ${Number(column) + 1})`);
    throw new LearnerSyntaxError(`SyntaxError: ${message}`);
  }
}

export async function runReactJob(job) {
  const { config, code, checks } = job;
  const state = createState();
  const guard = newGuard();
  installEnvironment(state);
  if (config.fixture?.css) addStyle(config.fixture.css, 'fixture');

  const componentName = config.component === undefined ? 'App' : config.component;
  const expose = [...new Set([...(componentName ? [componentName] : []), ...(config.expose ?? [])])];
  const moduleExports = {};
  const prelude = {
    React,
    console: state.console,
    require: requireModule,
    exports: moduleExports,
    module: { exports: moduleExports },
    useState: React.useState,
    useEffect: React.useEffect,
    useLayoutEffect: React.useLayoutEffect,
    useRef: React.useRef,
    useContext: React.useContext,
    useReducer: React.useReducer,
    useMemo: React.useMemo,
    useCallback: React.useCallback,
    useId: React.useId,
    createContext: React.createContext,
    Fragment: React.Fragment,
    memo: React.memo,
    Component: React.Component,
  };

  // A page root for lessons that call createRoot() themselves.
  document.body.innerHTML = '<div id="root"></div>';

  let exposed;
  try {
    const program = compileProgram(compileJsx(code), {
      prelude,
      setup: config.setup ?? '',
      expose,
      checkSyntax: false,
    });
    guard.arm();
    exposed = await program(guard);
    await settle();
  } catch (err) {
    return { fatal: describeFatal(err, guard), logs: state.logs };
  }

  if (moduleExports.default && componentName && !exposed[componentName]) exposed[componentName] = moduleExports.default;
  const App = componentName ? exposed[componentName] : null;
  if (componentName && typeof App !== 'function') {
    return {
      fatal: `no component named ${componentName} was found. Write function ${componentName}() { ... } (or export default it).`,
      logs: state.logs,
    };
  }

  let current = null;
  const unmount = () => {
    if (!current) return;
    try {
      current.root.unmount();
    } catch {
      // A component that throws during unmount should not stop the next check.
    }
    current.container.remove();
    current = null;
  };

  const render = async (element, { path = '/' } = {}) => {
    unmount();
    document.getElementById('root')?.remove();
    currentPath = path;
    const container = document.createElement('div');
    container.id = 'root';
    document.body.append(container);
    const root = ReactDOMClient.createRoot(container, {
      onUncaughtError: (error) => state.errors.push(String(error?.message ?? error)),
    });
    current = { root, container, crash: null };
    const mounted = current;
    ReactDOM.flushSync(() => {
      root.render(
        React.createElement(Boundary, { onError: (error) => (mounted.crash ??= error) }, element),
      );
    });
    await settle();
    return { container, ...domHelpers(() => container) };
  };

  // Mount once before the checks: a component that cannot render at all is
  // a fatal error, reported once instead of under every check.
  if (App) {
    await render(React.createElement(App));
    if (current.crash) return { fatal: `your component crashed while rendering: ${describeFatal(current.crash)}`, logs: state.logs };
  }

  const prepare = async () => {
    const view = App ? await render(React.createElement(App)) : { container: document.body, ...domHelpers() };
    return {
      ...view,
      render,
      el: React.createElement,
      React,
      App,
      exposed,
      document,
      window,
      logs: state.logs,
      alerts: state.alerts,
      submits: state.submits,
      navigations: state.navigations,
      errors: state.errors,
      storage: window.localStorage,
      source: code,
      state,
    };
  };

  const results = await runChecks(checks, prepare, { guard, state, crashed: () => current?.crash ?? null });
  unmount();
  return { results, logs: state.logs };
}
