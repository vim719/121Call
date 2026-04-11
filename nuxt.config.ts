export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss', '@nuxtjs/supabase'],
  
  supabase: {
    url: process.env.SUPABASE_URL,
    key: process.env.SUPABASE_ANON_KEY,
    redirect: false,
    redirectOptions: {
      login: '/login',
      callback: '/confirm',
      exclude: ['/', '/login', '/register', '/scanner', '/api/**']
    }
  },

  runtimeConfig: {
    httpsmsApiKey: process.env.HTTPSMS_API_KEY,
    googleVisionApiKey: process.env.GOOGLE_VISION_API_KEY,
    supabaseServiceKey: process.env.SUPABASE_SERVICE_KEY,
    public: {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseKey: process.env.SUPABASE_ANON_KEY
    }
  },

  app: {
    head: {
      title: '167Call - Smart Sales Assistant',
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