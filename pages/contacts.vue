<template>
  <div class="min-h-screen bg-gradient-to-br from-surface-100 via-surface-50 to-white">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div>
          <h1 class="text-xl font-semibold text-slate-900">Contacts</h1>
          <p class="text-sm text-slate-500">{{ contacts.length }} customers</p>
        </div>
        <NuxtLink to="/scanner" class="btn-icon">
          <ScanLine :size="22" />
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6">
      <!-- Search -->
      <div class="relative mb-6">
        <Search :size="18" class="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Search by name or phone..."
          class="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
        />
      </div>

      <!-- Import Options -->
      <div class="flex gap-3 mb-6">
        <NuxtLink to="/scanner" class="import-card">
          <div class="import-icon scan">
            <ScanLine :size="20" />
          </div>
          <span>Scan</span>
        </NuxtLink>
        <button @click="showImportModal = true" class="import-card">
          <div class="import-icon upload">
            <Upload :size="20" />
          </div>
          <span>Import CSV</span>
        </button>
      </div>

      <!-- Contacts List -->
      <div v-if="filteredContacts.length > 0" class="contacts-list">
        <div
          v-for="contact in filteredContacts"
          :key="contact.id"
          class="contact-card"
        >
          <div class="contact-avatar">
            {{ getInitials(contact.name) }}
          </div>
          <div class="contact-details">
            <h3 class="contact-name">{{ contact.name || 'Unknown' }}</h3>
            <p class="contact-phone">{{ formatMaskedPhone(contact.phone) }}</p>
            <div v-if="contact.tags?.length" class="contact-tags">
              <span v-for="tag in contact.tags" :key="tag" class="tag">{{ tag }}</span>
            </div>
          </div>
          <div class="contact-actions">
            <button @click="sendMessage(contact)" class="action-btn">
              <MessageSquare :size="18" />
            </button>
          </div>
        </div>
      </div>

      <!-- Empty State -->
      <div v-else class="empty-state">
        <div class="empty-icon">
          <Users :size="48" />
        </div>
        <h3>No contacts yet</h3>
        <p>Scan a business card or import from your POS to get started.</p>
        <NuxtLink to="/scanner" class="btn-primary">
          <ScanLine :size="18" />
          Scan Your First Card
        </NuxtLink>
      </div>
    </main>

    <!-- Import Modal -->
    <Teleport to="body">
      <div v-if="showImportModal" class="modal-overlay" @click.self="showImportModal = false">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Import Contacts</h2>
            <button @click="showImportModal = false" class="close-btn">
              <X :size="20" />
            </button>
          </div>
          
          <div class="upload-zone" @dragover.prevent @drop="handleDrop">
            <Upload :size="32" />
            <p>Drag & drop your CSV file here</p>
            <span>or</span>
            <label class="upload-label">
              Browse Files
              <input type="file" accept=".csv,.xlsx" @change="handleFileSelect" hidden />
            </label>
          </div>

          <div v-if="uploadProgress > 0" class="progress-bar">
            <div class="progress-fill" :style="{ width: uploadProgress + '%' }"></div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ScanLine, Upload, Search, Users, MessageSquare, X } from 'lucide-vue-next'

const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const searchQuery = ref('')
const showImportModal = ref(false)
const uploadProgress = ref(0)
const contacts = ref<any[]>([])

const filteredContacts = computed(() => {
  if (!searchQuery.value) return contacts.value
  
  const query = searchQuery.value.toLowerCase()
  return contacts.value.filter(c => 
    c.name?.toLowerCase().includes(query) ||
    c.phone?.includes(query)
  )
})

onMounted(async () => {
  if (user.value) {
    const { data } = await $supabase
      .from('contacts')
      .select('*')
      .eq('user_id', user.value.id)
      .order('created_at', { ascending: false })
    
    if (data) contacts.value = data
  }
})

watch(user, async (newUser) => {
  if (newUser) {
    const { data } = await $supabase
      .from('contacts')
      .select('*')
      .eq('user_id', newUser.id)
      .order('created_at', { ascending: false })
    
    if (data) contacts.value = data
  }
})

function getInitials(name: string): string {
  if (!name) return '?'
  return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
}

function formatMaskedPhone(phone: string): string {
  if (!phone) return ''
  const digits = phone.replace(/\D/g, '')
  if (digits.length >= 4) {
    return `•••-•••-${digits.slice(-4)}`
  }
  return phone
}

function sendMessage(contact: any) {
  navigateTo(`/campaigns/new?contact=${contact.id}`)
}

async function handleFileSelect(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  await importFile(file)
}

async function handleDrop(event: DragEvent) {
  const file = event.dataTransfer?.files[0]
  if (!file) return

  await importFile(file)
}

async function importFile(file: File) {
  uploadProgress.value = 10
  
  const formData = new FormData()
  formData.append('file', file)
  
  const { data, error } = await $supabase.functions.invoke('import-contacts', {
    body: formData
  })
  
  if (error) {
    console.error('Import failed:', error)
  } else {
    showImportModal.value = false
    if (user.value) {
      const { data: newContacts } = await $supabase
        .from('contacts')
        .select('*')
        .eq('user_id', user.value.id)
      
      if (newContacts) contacts.value = newContacts
    }
  }
  
  uploadProgress.value = 0
}
</script>

<style scoped>
.btn-icon {
  width: 44px;
  height: 44px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  color: white;
  border-radius: 1rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 600;
  border-radius: 1rem;
}

.import-card {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
}

.import-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
}

.import-icon.scan {
  background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
  color: #059669;
}

.import-icon.upload {
  background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
  color: #2563EB;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.contact-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1.25rem;
  transition: all 0.2s;
}

.contact-card:hover {
  border-color: #CBD5E1;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}

.contact-avatar {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 1rem;
}

.contact-details {
  flex: 1;
}

.contact-name {
  font-weight: 600;
  color: #1e293b;
}

.contact-phone {
  font-size: 0.875rem;
  color: #64748b;
}

.contact-tags {
  display: flex;
  gap: 0.375rem;
  margin-top: 0.375rem;
}

.tag {
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: #F1F5F9;
  color: #475569;
  border-radius: 0.5rem;
}

.contact-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  width: 36px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  color: #475569;
  border-radius: 0.75rem;
  transition: all 0.2s;
}

.action-btn:hover {
  background: #007AFF;
  color: white;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  color: #94A3B8;
  border-radius: 2rem;
  margin-bottom: 1.5rem;
}

.empty-state h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 0.5rem;
}

.empty-state p {
  font-size: 0.875rem;
  color: #64748b;
  margin-bottom: 1.5rem;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 100;
}

.modal-content {
  width: 90%;
  max-width: 400px;
  background: white;
  border-radius: 1.5rem;
  padding: 1.5rem;
}

.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.close-btn {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #F1F5F9;
  border-radius: 0.75rem;
}

.upload-zone {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  padding: 2rem;
  border: 2px dashed #E2E8F0;
  border-radius: 1rem;
  color: #64748b;
}

.upload-zone p {
  font-weight: 500;
}

.upload-zone span {
  font-size: 0.875rem;
  color: #94A3B8;
}

.upload-label {
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 500;
  border-radius: 0.75rem;
  cursor: pointer;
}

.progress-bar {
  height: 4px;
  background: #E2E8F0;
  border-radius: 2px;
  margin-top: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007AFF 0%, #5856D6 100%);
  transition: width 0.3s;
}
</style>