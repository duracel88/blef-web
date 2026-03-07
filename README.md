# blef-web

React + Vite + TypeScript frontend for Blef.

## Development

```bash
npm install
npm run dev
```

### Local Network Access (mDNS)

To access the dev server from other devices on your local network (phones, tablets, other machines):

```bash
npm run devlocal
```

This starts Vite with `--host` flag, binding to `0.0.0.0` so the server is accessible on all network interfaces.

#### Accessing from other devices

Once running, the terminal will show the network URL (e.g. `http://192.168.1.x:5173`).

You can also use your machine's mDNS hostname:

```
http://<your-hostname>.local:5173
```

To find your hostname:

- **macOS/Linux**: run `hostname` in terminal
- **Windows**: run `hostname` in Command Prompt

mDNS (`.local` domains) works out of the box on macOS (Bonjour) and most Linux distributions (Avahi). On Windows, Bonjour or iTunes installation enables mDNS resolution.

#### Custom mDNS Hostname

By default, your dev server is accessible at `http://<your-machine-hostname>.local:5173`. To use a fixed name like `blef-web.local` instead:

**Linux (Avahi)**

Edit `/etc/avahi/avahi-daemon.conf`:

```ini
[server]
host-name=blef-web
```

Then restart Avahi:

```bash
sudo systemctl restart avahi-daemon
```

**macOS (Bonjour)**

```bash
sudo scutil --set LocalHostName blef-web
```

After setup, start the dev server and access it at:

```
http://blef-web.local:5173
```

> **Note**: This changes the mDNS hostname for your entire machine, not just this project. Other devices on the network will see your machine as `blef-web.local`.

## Build

```bash
npm run build
npm run preview
```
