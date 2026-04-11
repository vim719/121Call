export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  
  supabase: {
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login', '/register', '/scanner', '/api/**']
    }
  },

  supabase: {
    url: 'https://ikeggsjzytrrdgnqebkb.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZWdnc2p6eXRycmRnbnFlYmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NzQzNTAsImV4cCI6MjA5MTQ1MDM1MH0.H4BPwZ6naBpF9ZHeqhfdLzzcQmA9UOn4nYWmjlGUNHE',
    redirect: false
  },

  runtimeConfig: {
    httpsmsApiKey: process.env.HTTPSMS_API_KEY || '',
    googleVisionApiKey: process.env.GOOGLE_VISION_API_KEY || '',
    supabaseServiceKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZWdnc2p6eXRycmRnbnFlYmtiIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3NTg3NDM1MCwiZXhwIjoyMDkxNDUwMzUwfQ.aSrcu2CyboW-RNHzxsNHdMh1o74hk8qapnF2NyTxx9c',
    public: {
      supabaseUrl: 'https://ikeggsjzytrrdgnqebkb.supabase.co',
      supabaseKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImlrZWdnc2p6eXRycmRnbnFlYmtiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU4NzQzNTAsImV4cCI6MjA5MTQ1MDM1MH0.H4BPwZ6naBpF9ZHeqhfdLzzcQmA9UOn4nYWmjlGUNHE'
    }
  },

  app: {
    head: {
      title: '121Call - Smart Sales Assistant',
      meta: [
        { name: 'description', content: 'Your AI-powered retail sales assistant for personalized SMS campaigns' },
        { name: 'theme-color', content: '#007AFF' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
      ],
      link: [
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'manifest', href: '/manifest.json' }
      ]
    }
  },

  compatibilityDate: '2024-04-03'
})