import { defineConfig, PluginOption } from 'vite';
import react from '@vitejs/plugin-react';
import { ghPages } from 'vite-plugin-gh-pages';

export default defineConfig({
  base: '/go-corona-go/', // 👈 Your repo name
  plugins: [react(), ghPages() as unknown as PluginOption],
});
