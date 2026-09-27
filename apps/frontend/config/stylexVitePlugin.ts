import stylex from '@stylexjs/unplugin'
import type { Plugin } from 'vite'

/**
 * `@stylexjs/unplugin`'s Vite plugin starts a 150ms polling interval in its
 * `configureServer` hook and only clears it when the Vite HTTP server closes.
 * Vitest drives Vite without an HTTP server, so that interval is never cleared
 * and every run ends in a teardown timeout. Nothing the dev-server hook does
 * (the StyleX dev CSS route, the HMR style push, the dev runtime middleware) is
 * observable in a test run, so drop the hook when Vitest is the one running
 * Vite. The transform hooks the tests depend on are untouched.
 */
export function stylexVite(): Plugin {
  const plugin = stylex.vite() as Plugin
  if (!process.env.VITEST) return plugin
  const withoutDevServer: Plugin = { ...plugin }
  delete withoutDevServer.configureServer
  return withoutDevServer
}
