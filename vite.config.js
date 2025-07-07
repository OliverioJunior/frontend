
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

export default defineConfig({
  plugins: [react()],
  server: {
    host: true, // escuta em 0.0.0.0 para expor fora do container
    port: 5173, // porta padrão do Vite
    watch: {
      usePolling: true, // polling para detectar mudanças em volumes montados
      interval: 1000, // intervalo de polling em ms (opcional)
    },
  },
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./setupTest.ts"],
    include: ["tests/**/*.test.{ts,tsx}"],
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "src"),
    },
  },
});
