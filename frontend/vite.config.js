import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  build:{
    rollupOptions: {
      external: ['firebase/app', 'firebase/auth','firebase/firestore']
    }
  },

  plugins: [react()],

  server:{
    open:true,
  },
})
