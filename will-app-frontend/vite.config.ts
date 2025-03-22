import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

//https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  base: "/"
// server: {
//   host: '127.0.0.1', // Set host to 127.0.0.1
//   port: 3000,        // Set port to 3000
// },
})