# blef-web

React + Vite + TypeScript frontend for Blef.

## Development

```bash
npm install
npm run dev
```

### Local Network Access (HTTPS)

The project uses `vite-plugin-mkcert` to provide HTTPS with locally-trusted certificates. No system configuration is needed.

To access the dev server from other devices on your local network:

```bash
npm run devlocal
```

The dev server will be available at:

```
https://blef-web.local:5173
```

On the first run, the plugin will automatically download `mkcert` and generate a trusted root CA. You may be prompted for your password to install it.

## Build

```bash
npm run build
npm run preview
```
