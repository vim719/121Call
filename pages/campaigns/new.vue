<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="max-w-lg mx-auto px-4 py-4 flex items-center gap-3">
        <NuxtLink to="/campaigns" class="header-btn">
          <ChevronLeft :size="20" />
        </NuxtLink>
        <h1 class="text-xl font-semibold text-slate-900">New Campaign</h1>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6">
      <div class="space-y-6">
        <!-- Step 1: Campaign Details -->
        <section class="form-section">
          <label class="form-label">Campaign Name</label>
          <input
            v-model="campaign.name"
            type="text"
            placeholder="e.g. Summer Sale 2024"
            class="form-input"
          />
        </section>

        <!-- Step 2: Recipients -->
        <section class="form-section">
          <div class="flex justify-between items-end mb-2">
            <label class="form-label mb-0">Recipients</label>
            <span class="text-xs text-brand-600 font-medium">{{ selectedContacts.length }} selected</span>
          </div>

          <div class="contact-selector-box">
            <div class="search-bar">
              <Search :size="16" class="text-slate-400" />
              <input
                v-model="contactSearch"
                type="text"
                placeholder="Search contacts..."
                class="bg-transparent border-none text-sm focus:ring-0 w-full"
              />
            </div>

            <div class="contacts-scroll-area">
              <div
                v-for="contact in filteredContacts"
                :key="contact.id"
                class="contact-selection-item"
                @click="toggleContact(contact.id)"
              >
                <div class="flex items-center gap-3">
                  <div class="checkbox" :class="{ checked: isSelected(contact.id) }">
                    <Check v-if="isSelected(contact.id)" :size="12" />
                  </div>
                  <div>
                    <p class="text-sm font-medium text-slate-900">{{ contact.name || 'Unknown' }}</p>
                    <p class="text-xs text-slate-500">{{ contact.phone }}</p>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex border-t border-slate-100">
              <button @click="selectAll" class="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Select All</button>
              <div class="w-px bg-slate-100"></div>
              <button @click="selectNone" class="flex-1 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50">Clear</button>
            </div>
          </div>
        </section>

        <!-- Step 3: Message Template -->
        <section class="form-section">
          <div class="flex justify-between items-end mb-2">
            <label class="form-label mb-0">Message Template</label>
            <span class="text-xs text-slate-400">{{ campaign.template.length }}/160</span>
          </div>
          <textarea
            v-model="campaign.template"
            rows="4"
            placeholder="Hey {{firstName}}! We have a special offer for you..."
            class="form-textarea"
          ></textarea>
          <div class="mt-2 flex flex-wrap gap-2">
            <button
              v-for="tag in ['{{firstName}}', '{{today}}', '{{shopName}}']"
              :key="tag"
              @click="insertTag(tag)"
              class="tag-pill"
            >
              + {{ tag }}
            </button>
          </div>
        </section>

        <button
          @click="sendCampaign"
          :disabled="!isReadyToSend || isSending"
          class="btn-primary w-full py-4 shadow-xl"
        >
          <div v-if="isSending" class="flex items-center gap-2">
            <Loader2 class="animate-spin" :size="20" />
            Sending...
          </div>
          <div v-else class="flex items-center gap-2">
            <Send :size="20" />
            Launch Campaign
          </div>
        </button>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Search, Check, Send, Loader2 } from 'lucide-vue-next'

const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const campaign = reactive({
  name: '',
  template: 'Hey {{firstName}}! This is {{shopName}}. Just wanted to let you know we have new items in stock today ({{today}}). Hope to see you soon!',
  contacts: [] as string[]
})

const allContacts = ref<any[]>([])
const contactSearch = ref('')
const isSending = ref(false)

onMounted(async () => {
  if (!user.value) return navigateTo('/login')

  const { data } = await $supabase
    .from('contacts')
    .select('*')
    .eq('user_id', user.value.id)
    .is('deleted_at', null)

  if (data) allContacts.value = data
})

const filteredContacts = computed(() => {
  if (!contactSearch.value) return allContacts.value
  const q = contactSearch.value.toLowerCase()
  return allContacts.value.filter(c =>
    c.name?.toLowerCase().includes(q) ||
    c.phone?.includes(q)
  )
})

const selectedContacts = computed(() => {
  return allContacts.value.filter(c => campaign.contacts.includes(c.id))
})

const isReadyToSend = computed(() => {
  return campaign.name.trim() && campaign.template.trim() && campaign.contacts.length > 0
})

function isSelected(id: string) {
  return campaign.contacts.includes(id)
}

function toggleContact(id: string) {
  const index = campaign.contacts.indexOf(id)
  if (index === -1) campaign.contacts.push(id)
  else campaign.contacts.splice(index, 1)
}

function selectAll() {
  campaign.contacts = allContacts.value.map(c => c.id)
}

function selectNone() {
  campaign.contacts = []
}

function insertTag(tag: string) {
  campaign.template += ` ${tag}`
}

async function sendCampaign() {
  if (!isReadyToSend.value || isSending.value) return
  isSending.value = true

  try {
    // 1. Create campaign in database
    const { data: campaignData, error: campaignError } = await $supabase
      .from('campaigns')
      .insert({
        user_id: user.value?.id,
        name: campaign.name,
        message_template: campaign.template,
        total_recipients: campaign.contacts.length,
        status: 'sending'
      })
      .select()
      .single()

    if (campaignError) throw campaignError

    // 2. Dispatch SMS via API
    const response = await fetch('/api/sms/send', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contacts: selectedContacts.value,
        template: campaign.template,
        shopName: 'My Shop', // Should come from profile
        neighborhood: 'Downtown',
        campaignTitle: campaign.name
      })
    })

    const result = await response.json()

    // 3. Update campaign status
    await $supabase
      .from('campaigns')
      .update({
        status: 'completed',
        sent_count: result.summary?.total || result.results?.length || 0,
        delivered_count: result.results?.filter((r: any) => r.status === 'delivered').length || 0
      })
      .eq('id', campaignData.id)

    navigateTo('/campaigns')
  } catch (e) {
    console.error('Failed to send campaign:', e)
    alert('Failed to send campaign. Please check your settings and try again.')
  } finally {
    isSending.value = false
  }
}
</script>

<style scoped>
.header-btn {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  border-radius: 0.75rem;
  color: #475569;
}

.form-section {
  display: flex;
  flex-direction: column;
}

.form-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: #475569;
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  font-size: 0.9375rem;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.contact-selector-box {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  overflow: hidden;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #F1F5F9;
}

.contacts-scroll-area {
  max-height: 240px;
  overflow-y: auto;
}

.contact-selection-item {
  padding: 0.75rem 1rem;
  border-bottom: 1px solid #F8FAFC;
  cursor: pointer;
  transition: background 0.2s;
}

.contact-selection-item:hover {
  background: #F8FAFC;
}

.checkbox {
  width: 20px;
  height: 20px;
  border: 2px solid #E2E8F0;
  border-radius: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  transition: all 0.2s;
}

.checkbox.checked {
  background: #007AFF;
  border-color: #007AFF;
}

.form-textarea {
  width: 100%;
  padding: 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  font-size: 0.9375rem;
  resize: none;
  transition: all 0.2s;
}

.form-textarea:focus {
  outline: none;
  border-color: #007AFF;
  box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
}

.tag-pill {
  font-size: 0.75rem;
  font-weight: 500;
  padding: 0.375rem 0.75rem;
  background: #EFF6FF;
  color: #2563EB;
  border: 1px solid #DBEAFE;
  border-radius: 2rem;
  transition: all 0.2s;
}

.tag-pill:hover {
  background: #DBEAFE;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 700;
  border: none;
  border-radius: 1.25rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-primary:not(:disabled):hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 24px rgba(0, 122, 255, 0.3);
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}
</style>