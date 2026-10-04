import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { resolve } from 'path'

export default defineConfig({
    plugins: [react()],
    build: {
        chunkSizeWarningLimit: 900,
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                admin: resolve(__dirname, 'admin.html')
            },
            output: {
                manualChunks(id) {
                    if (id.includes('node_modules/jspdf')) {
                        return 'jspdf';
                    }
                    if (id.includes('node_modules/html2canvas')) {
                        return 'html2canvas';
                    }
                    if (id.includes('node_modules/firebase') || id.includes('node_modules/@firebase')) {
                        return 'firebase';
                    }
                    if (id.includes('node_modules/lucide-react')) {
                        return 'icons';
                    }
                }
            }
        }
    },
    server: {
        host: true,
        port: 3000,
        open: true
    }
})
