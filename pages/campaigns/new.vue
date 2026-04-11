<template>
  <div class="campaign-page pb-24">
    <header class="page-header sticky top-0 z-50">
      <div class="container flex justify-between items-center h-16">
        <NuxtLink to="/dashboard" class="back-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10L9 6M5 10L9 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          Back
        </NuxtLink>
        <h1 class="header-title">New Campaign</h1>
        <div class="w-10"></div>
      </div>
    </header>

    <main class="container py-8 space-y-10">
      <!-- Recipients Selection -->
      <section class="section-card reveal visible">
        <div class="card-header">
          <div class="step-num">01</div>
          <h2 class="card-title">Select Recipients</h2>
          <span class="badge" v-if="selectedContacts.length">{{ selectedContacts.length }} Selected</span>
        </div>

        <div class="recipients-grid pt-4">
          <div v-if="contacts.length === 0" class="empty-state">
            <p>No contacts found. Scan some cards first!</p>
            <NuxtLink to="/scanner" class="link">Go to Scanner</NuxtLink>
          </div>
          <div v-else class="contact-chips">
            <button
              v-for="contact in contacts"
              :key="contact.id"
              @click="toggleContact(contact)"
              class="contact-chip"
              :class="{ active: isSelected(contact) }"
            >
              <div class="chip-avatar">{{ contact.name?.[0] || '?' }}</div>
              <span class="chip-name">{{ contact.name || contact.phone }}</span>
            </button>
          </div>
        </div>
      </section>

      <!-- Message Template -->
      <section class="section-card reveal visible" style="transition-delay: 0.1s;">
        <div class="card-header">
          <div class="step-num">02</div>
          <h2 class="card-title">Compose Personal Note</h2>
        </div>

        <div class="template-box mt-4">
          <textarea
            v-model="template"
            placeholder="Hey {{firstName}}! Thought of you today..."
            class="template-input"
          ></textarea>

          <div class="tag-bar">
            <button v-for="tag in ['firstName', 'interest', 'shopName']" :key="tag"
              @click="insertTag(tag)"
              class="tag-btn"
            >
              @{{ tag }}
            </button>
          </div>
        </div>
      </section>

      <!-- Live Preview -->
      <section class="section-card reveal visible" style="transition-delay: 0.2s;" v-if="previewMessage">
        <div class="card-header">
          <div class="step-num">03</div>
          <h2 class="card-title">Personalization Preview</h2>
        </div>

        <div class="preview-mockup mt-6">
          <div class="preview-bubble shadow-lg animate-fade-in">
            <div class="preview-meta">
              <span class="to">To: {{ selectedContacts[0]?.name || 'Customer' }}</span>
              <span class="from">From: Your Real Number</span>
            </div>
            <p class="preview-text">{{ previewMessage }}</p>
            <div class="preview-footer">
              <span class="chars">✓ {{ previewMessage.length }} chars</span>
              <span class="ai-badge">✨ AI Personalized</span>
            </div>
          </div>
        </div>
      </section>

      <div class="fixed-bottom">
        <div class="container">
          <button
            @click="sendCampaign"
            :disabled="!isReady"
            class="btn-primary w-full shadow-2xl flex items-center justify-center gap-3"
          >
            <template v-if="!isSending">
              Send to {{ selectedContacts.length }} Regulars
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M17 3L3 10L8 12L10 17L17 3Z" stroke="white" stroke-width="2" stroke-linejoin="round"></path></svg>
            </template>
            <template v-else>
              <div class="spinner"></div>
              Dispatching Campaign...
            </template>
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { personalizeMessage } from '~/utils/sms'

const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const contacts = ref<any[]>([])
const selectedIds = ref<Set<string>>(new Set())
const template = ref('Hey {{firstName}}! Those new {{interest}} just landed at {{shopName}} — thought of you immediately. Come check them out! 👟')
const isSending = ref(false)

const selectedContacts = computed(() => contacts.value.filter(c => selectedIds.value.has(c.id)))

const isReady = computed(() =>
  selectedContacts.value.length > 0 &&
  template.value.trim().length > 0 &&
  !isSending.value
)

const previewMessage = computed(() => {
  if (selectedContacts.value.length === 0) return ''
  return personalizeMessage(template.value, selectedContacts.value[0], {
    shopName: 'Main St Boutique',
    neighborhood: 'SoHo'
  })
})

onMounted(async () => {
  if (!user.value) return navigateTo('/login')

  const { data } = await $supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })

  if (data) contacts.value = data
})

function toggleContact(contact: any) {
  if (selectedIds.value.has(contact.id)) {
    selectedIds.value.delete(contact.id)
  } else {
    selectedIds.value.add(contact.id)
  }
}

function isSelected(contact: any) {
  return selectedIds.value.has(contact.id)
}

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
        shopName: 'Main St Boutique',
        neighborhood: 'SoHo',
        campaignTitle: 'Personal Outreach'
      }
    })

    if (data) {
      navigateTo('/dashboard')
    }
  } catch (e) {
    console.error('Failed to send campaign', e)
    alert('Failed to send campaign. Please check your SMS gateway configuration.')
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
.campaign-page {
  --blue: #1352F0;
  --blue-pale: #E0EAFF;
  --orange: #FF5C35;
  --orange-dark: #E0401B;
  --green: #0DBA7F;
  --green-pale: #E8FAF3;
  --ink: #08091A;
  --ink-2: #3D4561;
  --ink-3: #8A91AB;
  --border: rgba(19,82,240,.1);
  --r-lg: 24px;
  --r-full: 9999px;

  background: #EEF4FF;
  min-height: 100vh;
}

.container { max-width: 600px; margin: 0 auto; padding: 0 20px; }

.page-header {
  background: rgba(238,244,255,.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
}

.back-link { display: flex; align-items: center; gap: 4px; font-weight: 600; font-size: 14px; color: var(--ink-2); }
.header-title { font-size: 16px; font-weight: 800; }

.section-card {
  background: white;
  border-radius: var(--r-lg);
  padding: 24px;
  border: 1px solid var(--border);
}

.card-header { display: flex; align-items: center; gap: 12px; }
.step-num { font-family: serif; font-style: italic; font-size: 24px; font-weight: 900; color: var(--blue); opacity: 0.3; }
.card-title { font-size: 18px; font-weight: 800; color: var(--ink); }
.badge { background: var(--blue-pale); color: var(--blue); font-size: 11px; font-weight: 700; padding: 4px 10px; border-radius: var(--r-full); }

.contact-chips { display: flex; flex-wrap: wrap; gap: 8px; }
.contact-chip {
  display: flex; align-items: center; gap: 8px;
  padding: 6px 12px 6px 6px; border-radius: var(--r-full);
  background: var(--bg-2, #F5F9FF); border: 1px solid var(--border);
  transition: all .2s;
}
.contact-chip.active { background: var(--blue); color: white; border-color: var(--blue); }
.chip-avatar { width: 24px; height: 24px; background: rgba(0,0,0,0.05); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: 800; }
.contact-chip.active .chip-avatar { background: rgba(255,255,255,0.2); }
.chip-name { font-size: 12px; font-weight: 600; }

.template-box { background: #FAFCFF; border: 1px solid var(--border); border-radius: 16px; overflow: hidden; }
.template-input { width: 100%; min-height: 140px; padding: 16px; border: none; background: none; font-size: 15px; line-height: 1.6; color: var(--ink); resize: none; outline: none; }
.tag-bar { padding: 12px; border-top: 1px solid var(--border); display: flex; gap: 8px; flex-wrap: wrap; }
.tag-btn { background: white; border: 1px solid var(--border); padding: 6px 12px; border-radius: 8px; font-size: 11px; font-weight: 700; color: var(--ink-2); }

.preview-bubble {
  background: var(--blue); color: white;
  border-radius: 20px 20px 4px 20px;
  padding: 20px; position: relative;
}
.preview-meta { display: flex; justify-content: space-between; font-size: 10px; font-weight: 700; text-transform: uppercase; opacity: 0.6; letter-spacing: .05em; margin-bottom: 8px; }
.preview-text { font-size: 14px; line-height: 1.6; }
.preview-footer { display: flex; justify-content: space-between; align-items: center; margin-top: 16px; padding-top: 12px; border-top: 1px solid rgba(255,255,255,0.1); }
.chars { font-size: 10px; font-weight: 700; opacity: 0.6; }
.ai-badge { background: rgba(255,255,255,0.15); font-size: 9px; font-weight: 800; padding: 3px 8px; border-radius: var(--r-full); }

.fixed-bottom { position: fixed; bottom: 0; left: 0; right: 0; padding: 20px 0; background: linear-gradient(transparent, #EEF4FF 30%); pointer-events: none; z-index: 100; }
.fixed-bottom button { pointer-events: auto; }

.btn-primary { background: var(--orange); color: white; padding: 18px 24px; border-radius: var(--r-full); font-weight: 800; font-size: 16px; border: none; }
.btn-primary:disabled { opacity: 0.5; }

.spinner { width: 20px; height: 20px; border: 3px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin .8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>