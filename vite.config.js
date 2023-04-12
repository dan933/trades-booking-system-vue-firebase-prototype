import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import mkcert from "vite-plugin-mkcert";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), mkcert()],
  server: {
    proxy: {
      "/api": {
        target:
          "https://australia-southeast1-ajhomeservices-a31dd.cloudfunctions.net",
        changeOrigin: true,
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      // https://rollupjs.org/guide/en/#outputmanualchunks
      output: {},
    },
  },
});
