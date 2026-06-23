// for hot refresh on the client-side
// otherwise it would need a full page reload
// also since we are using hono, we need to inject the refresh script ourselves
// vitejs/vite#1984

/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import RefreshRuntime from '/@react-refresh';
RefreshRuntime.injectIntoGlobalHook(window);
window.$RefreshReg$ = () => {};
window.$RefreshSig$ = () => (type) => type;
window.__vite_plugin_react_preamble_installed__ = true;
