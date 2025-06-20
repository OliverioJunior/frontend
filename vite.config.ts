import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";

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
});
