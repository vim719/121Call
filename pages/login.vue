<template>
  <div class="min-h-screen flex items-center justify-center p-4">
    <div class="w-full max-w-sm">
      <!-- Logo -->
      <div class="text-center mb-8">
        <div class="logo-icon">
          <Zap :size="28" />
        </div>
        <h1 class="text-2xl font-semibold mt-4 text-slate-900">Welcome to 167Call</h1>
        <p class="text-sm text-slate-500 mt-1">Your smart sales assistant</p>
      </div>

      <!-- Auth Form -->
      <div class="auth-card">
        <div class="tabs">
          <button 
            :class="['tab', { active: isLogin }]" 
            @click="isLogin = true"
          >
            Sign In
          </button>
          <button 
            :class="['tab', { active: !isLogin }]" 
            @click="isLogin = false"
          >
            Sign Up
          </button>
        </div>

        <form @submit.prevent="handleSubmit" class="form-space">
          <div v-if="!isLogin" class="form-group">
            <label class="label">Business Name</label>
            <input
              v-model="form.businessName"
              type="text"
              placeholder="Your store name"
              class="input"
            />
          </div>

          <div class="form-group">
            <label class="label">Email</label>
            <input
              v-model="form.email"
              type="email"
              placeholder="you@example.com"
              class="input"
              required
            />
          </div>

          <div class="form-group">
            <label class="label">Password</label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                placeholder="••••••••"
                class="input pr-12"
                required
              />
              <button 
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400"
              >
                <component :is="showPassword ? EyeOff : Eye" :size="18" />
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            class="submit-btn"
            :disabled="loading"
          >
            <Loader2 v-if="loading" :size="20" class="animate-spin" />
            <span v-else>{{ isLogin ? 'Sign In' : 'Create Account' }}</span>
          </button>
        </form>

        <div class="divider">
          <span>or continue with</span>
        </div>

        <button @click="signInWithGoogle" class="social-btn">
          <svg class="w-5 h-5" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.96 20.3 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.96 3.7 2.18 7.07l2.85 2.22c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      </div>

      <p class="terms">
        By continuing, you agree to our 
        <a href="#">Terms</a> and <a href="#">Privacy Policy</a>
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Zap, Eye, EyeOff, Loader2 } from 'lucide-vue-next'

definePageMeta({
  layout: false
})

const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const isLogin = ref(true)
const loading = ref(false)
const showPassword = ref(false)

const form = reactive({
  email: '',
  password: '',
  businessName: ''
})

watch(user, (newUser) => {
  if (newUser) {
    navigateTo('/dashboard')
  }
}, { immediate: true })

async function handleSubmit() {
  loading.value = true
  
  try {
    if (isLogin.value) {
      const { error } = await $supabase.auth.signInWithPassword({
        email: form.email,
        password: form.password
      })
      
      if (error) throw error
    } else {
      const { data, error } = await $supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: {
            business_name: form.businessName
          }
        }
      })
      
      if (error) throw error
      
      if (data.user) {
        await $supabase.from('user_profiles').insert({
          id: data.user.id,
          business_name: form.businessName
        })
      }
    }
    
    navigateTo('/dashboard')
  } catch (error: any) {
    console.error(' Auth error:', error)
    alert(error.message)
  } finally {
    loading.value = false
  }
}

async function signInWithGoogle() {
  loading.value = true
  
  try {
    const { error } = await $supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: window.location.origin + '/confirm'
      }
    })
    
    if (error) throw error
  } catch (error: any) {
    console.error('Google sign-in error:', error)
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.logo-icon {
  width: 56px;
  height: 56px;
  margin: 0 auto;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
}

.auth-card {
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 1.5rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08);
}

.tabs {
  display: flex;
  background: #F1F5F9;
  border-radius: 0.75rem;
  padding: 0.25rem;
  margin-bottom: 1.5rem;
}

.tab {
  flex: 1;
  padding: 0.625rem;
  background: transparent;
  border: none;
  border-radius: 0.5rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #64748b;
  cursor: pointer;
  transition: all 0.2s;
}

.tab.active {
  background: white;
  color: #1e293b;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
}

.form-space {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.375rem;
}

.label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.input {
  padding: 0.75rem 1rem;
  background: #F8FAFC;
  border: 1px solid #E2E8F0;
  border-radius: 0.75rem;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.input:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 3px rgba(0, 122, 255, 0.1);
}

.pr-12 {
  padding-right: 3rem;
}

.submit-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: all 0.2s;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
}

.submit-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.divider {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin: 1.5rem 0;
}

.divider::before,
.divider::after {
  content: '';
  flex: 1;
  height: 1px;
  background: #E2E8F0;
}

.divider span {
  font-size: 0.75rem;
  color: #94A3B8;
}

.social-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.75rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 0.75rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #1e293b;
  cursor: pointer;
  transition: all 0.2s;
}

.social-btn:hover {
  background: #F8FAFC;
  border-color: #CBD5E1;
}

.terms {
  text-align: center;
  font-size: 0.75rem;
  color: #94A3B8;
  margin-top: 1.5rem;
}

.terms a {
  color: #007AFF;
  text-decoration: none;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>