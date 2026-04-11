<template>
  <div class="min-h-screen bg-slate-50 pb-24">
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/dashboard" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft :size="20" class="text-slate-600" />
          </NuxtLink>
          <h1 class="text-lg font-bold text-slate-900">New Campaign</h1>
        </div>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6 space-y-8">
      <!-- Step 1: Recipients -->
      <section class="space-y-4">
        <div class="flex items-center justify-between">
          <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest">1. Recipients</h2>
          <span class="text-xs font-bold text-brand-600">{{ selectedContacts.length }} Selected</span>
        </div>

        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <div v-if="selectedContacts.length === 0" class="text-center py-4">
            <p class="text-sm text-slate-500 mb-3">No contacts selected</p>
            <NuxtLink to="/contacts" class="text-brand-600 text-sm font-bold hover:underline">
              Browse Contacts
            </NuxtLink>
          </div>
          <div v-else class="flex -space-x-2 overflow-hidden">
            <div v-for="contact in selectedContacts.slice(0, 5)" :key="contact.id"
              class="w-10 h-10 rounded-full border-2 border-white bg-brand-100 flex items-center justify-center text-xs font-bold text-brand-600">
              {{ contact.name?.[0] || '?' }}
            </div>
            <div v-if="selectedContacts.length > 5" class="w-10 h-10 rounded-full border-2 border-white bg-slate-100 flex items-center justify-center text-xs font-bold text-slate-500">
              +{{ selectedContacts.length - 5 }}
            </div>
          </div>
        </div>
      </section>

      <!-- Step 2: Message Template -->
      <section class="space-y-4">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest">2. Compose Message</h2>
        <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-4">
          <textarea
            v-model="template"
            placeholder="Hi {{firstName}}! Those new {{interest}} just arrived..."
            class="w-full h-32 text-slate-900 bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-300 resize-none"
          ></textarea>

          <div class="flex flex-wrap gap-2 pt-4 border-t border-slate-100">
            <button v-for="tag in ['firstName', 'interest', 'shopName']" :key="tag"
              @click="insertTag(tag)"
              class="px-3 py-1.5 bg-slate-50 text-slate-600 text-xs font-bold rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              @{{ tag }}
            </button>
          </div>
        </div>
      </section>

      <!-- Step 3: Interactive Preview -->
      <section class="space-y-4" v-if="previewMessage">
        <h2 class="text-sm font-bold text-slate-400 uppercase tracking-widest">3. Preview</h2>
        <div class="relative p-6 bg-slate-900 rounded-[2rem] overflow-hidden">
          <div class="absolute top-0 right-0 p-4">
            <Sparkles :size="20" class="text-brand-400 animate-pulse" />
          </div>
          <div class="flex items-start gap-3">
            <div class="w-10 h-10 rounded-full bg-brand-500 flex items-center justify-center text-white font-bold shrink-0">
              {{ selectedContacts[0]?.name?.[0] || '?' }}
            </div>
            <div class="space-y-1">
              <div class="text-[10px] font-bold text-white/40 uppercase tracking-widest">To: {{ selectedContacts[0]?.name || 'Customer' }}</div>
              <div class="p-4 bg-slate-800 rounded-2xl rounded-tl-none text-white text-sm leading-relaxed border border-white/5">
                {{ previewMessage }}
              </div>
            </div>
          </div>
        </div>
      </section>

      <div class="fixed bottom-6 left-4 right-4 max-w-lg mx-auto">
        <button
          @click="sendCampaign"
          :disabled="!isReady"
          class="group w-full py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-xl shadow-brand-600/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
        >
          <span v-if="!isSending">Send Campaign Now</span>
          <span v-else class="flex items-center gap-2">
            <Loader2 class="animate-spin" :size="20" />
            Sending...
          </span>
          <Send v-if="!isSending" :size="20" class="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ArrowLeft, Sparkles, Send, Loader2 } from 'lucide-vue-next'
import { personalizeMessage } from '~/utils/sms'

const route = useRoute()
const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const template = ref('Hey {{firstName}}! Thought you might like to know that we just got some new {{interest}} in at {{shopName}}. Stop by and check them out! 👟')
const selectedContacts = ref<any[]>([])
const isSending = ref(false)

const isReady = computed(() =>
  selectedContacts.value.length > 0 &&
  template.value.trim().length > 0 &&
  !isSending.value
)

const previewMessage = computed(() => {
  if (selectedContacts.value.length === 0) return ''
  return personalizeMessage(template.value, selectedContacts.value[0], {
    shopName: 'Our Boutique',
    neighborhood: 'SoHo'
  })
})

onMounted(async () => {
  if (!user.value) return navigateTo('/login')

  const contactId = route.query.contact
  if (contactId) {
    const { data } = await $supabase
      .from('contacts')
      .select('*')
      .eq('id', contactId)
      .single()
    if (data) selectedContacts.value = [data]
  } else {
    // Default to last 5 contacts for demo if none selected
    const { data } = await $supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
      .limit(5)
    if (data) selectedContacts.value = data
  }
})

function insertTag(tag: string) {
  template.value += ` {{${tag}}}`
}

async function sendCampaign() {
  if (!isReady.value) return
  isSending.value = true

  try {
    const data = await $fetch('/api/sms/send', {
      method: 'POST',
      body: {
        contacts: selectedContacts.value,
        template: template.value,
        shopName: 'Our Boutique',
        neighborhood: 'SoHo',
        campaignTitle: 'Spring Arrivals'
      }
    })

    if (data) {
      navigateTo('/dashboard')
    }
  } catch (e) {
    console.error('Failed to send campaign', e)
  } finally {
    isSending.value = false
  }
}
</script>