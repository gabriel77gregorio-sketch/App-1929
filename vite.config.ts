import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Garante que assets usem caminhos relativos, funcionando tanto em subdiretórios (GitHub Pages) quanto na raiz (Vercel/Netlify)
})
