import { defineConfig } from 'vite';
import { resolve, dirname } from 'node:path';
import { readdirSync, existsSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const root = dirname(fileURLToPath(import.meta.url));

// Every folder in /projects with an index.html becomes its own page.
const projectInputs = Object.fromEntries(
  readdirSync(resolve(root, 'projects'), { withFileTypes: true })
    .filter((d) => d.isDirectory() && existsSync(resolve(root, 'projects', d.name, 'index.html')))
    .map((d) => [`project-${d.name}`, resolve(root, 'projects', d.name, 'index.html')])
);

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(root, 'index.html'),
        about: resolve(root, 'about/index.html'),
        contact: resolve(root, 'contact/index.html'),
        ...projectInputs,
      },
    },
  },
});
