<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/dashboard" class="p-2 hover:bg-slate-100 rounded-xl transition-colors">
            <ArrowLeft :size="20" class="text-slate-600" />
          </NuxtLink>
          <h1 class="text-lg font-bold text-slate-900">Smart Scanner</h1>
        </div>
        <button v-if="contacts.length > 0" @click="resetScanner" class="text-sm font-medium text-brand-600">
          Reset
        </button>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6">
      <!-- Camera/Upload View -->
      <div v-if="!capturedImage && !isProcessing" class="space-y-6">
        <div class="relative aspect-[3/4] bg-slate-900 rounded-[2.5rem] overflow-hidden shadow-2xl">
          <video
            v-if="cameraActive"
            ref="videoRef"
            class="w-full h-full object-cover"
            autoplay
            playsinline
            muted
          />

          <div v-else class="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-4">
            <div class="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center">
              <Camera :size="32" />
            </div>
            <p class="font-medium">Camera is inactive</p>
          </div>

          <!-- Scanner Overlay -->
          <div class="absolute inset-8 pointer-events-none">
            <div class="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-brand-500 rounded-tl-xl"></div>
            <div class="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-brand-500 rounded-tr-xl"></div>
            <div class="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-brand-500 rounded-bl-xl"></div>
            <div class="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-brand-500 rounded-br-xl"></div>
          </div>

          <!-- Capture Button -->
          <div v-if="cameraActive" class="absolute bottom-8 left-0 right-0 flex justify-center">
            <button @click="capture" class="group relative w-20 h-20 flex items-center justify-center">
              <div class="absolute inset-0 bg-white/20 rounded-full scale-110 blur-sm group-active:scale-95 transition-transform"></div>
              <div class="w-16 h-16 bg-white rounded-full border-4 border-slate-900 group-active:scale-90 transition-transform shadow-xl"></div>
            </button>
          </div>
        </div>

        <div class="flex flex-col gap-3">
          <button v-if="!cameraActive" @click="startCamera" class="w-full py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-600/20 flex items-center justify-center gap-2">
            <Camera :size="20" />
            Open Camera
          </button>
          <label class="w-full py-4 bg-white text-slate-900 font-bold rounded-2xl border border-slate-200 shadow-sm flex items-center justify-center gap-2 cursor-pointer hover:bg-slate-50 transition-colors">
            <Upload :size="20" />
            Upload from Gallery
            <input type="file" accept="image/*" @change="handleFileUpload" hidden />
          </label>
        </div>
      </div>

      <!-- Processing State -->
      <div v-if="isProcessing" class="flex flex-col items-center justify-center py-20 gap-6">
        <div class="relative w-24 h-24">
          <div class="absolute inset-0 border-4 border-brand-100 rounded-full"></div>
          <div class="absolute inset-0 border-4 border-brand-600 rounded-full border-t-transparent animate-spin"></div>
          <div class="absolute inset-0 flex items-center justify-center">
            <Zap :size="32" class="text-brand-600 fill-brand-600/10" />
          </div>
        </div>
        <div class="text-center">
          <h2 class="text-xl font-bold text-slate-900 mb-1">AI Extracting...</h2>
          <p class="text-slate-500">Detecting phone numbers and names</p>
        </div>
      </div>

      <!-- Results View -->
      <div v-if="capturedImage && !isProcessing" class="space-y-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center gap-2 px-3 py-1 bg-emerald-50 border border-emerald-100 rounded-full text-emerald-600 text-xs font-bold uppercase tracking-wider">
            <Sparkles :size="14" />
            {{ contacts.length }} Contacts Found
          </div>
          <p class="text-xs text-slate-400 font-medium">Verify before importing</p>
        </div>

        <div class="space-y-3">
          <div v-for="(contact, index) in contacts" :key="contact.id"
            class="group p-4 bg-white rounded-2xl border border-slate-200 shadow-sm transition-all"
            :class="{ 'opacity-50 ring-1 ring-slate-100 grayscale-[0.5]': !contact.selected }"
          >
            <div class="flex items-center gap-4">
              <button @click="contact.selected = !contact.selected"
                class="w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all"
                :class="contact.selected ? 'bg-brand-600 border-brand-600 text-white' : 'border-slate-300'"
              >
                <Check :size="14" stroke-width="3" v-if="contact.selected" />
              </button>

              <div class="flex-1 space-y-2">
                <div class="flex gap-2">
                  <input
                    v-model="contact.name"
                    placeholder="Add name..."
                    class="flex-1 text-sm font-bold text-slate-900 bg-transparent border-none p-0 focus:ring-0 placeholder:text-slate-300"
                  />
                  <div class="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-slate-100 text-slate-500">
                    {{ contact.confidence }}
                  </div>
                </div>
                <input
                  v-model="contact.formatted"
                  class="w-full text-xs text-slate-500 bg-transparent border-none p-0 focus:ring-0"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="fixed bottom-6 left-4 right-4 max-w-lg mx-auto">
          <button
            @click="importContacts"
            :disabled="selectedCount === 0"
            class="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-900/20 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all active:scale-[0.98]"
          >
            Add {{ selectedCount }} Contacts
            <ArrowRight :size="20" />
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
import {
  ArrowLeft,
  Camera,
  Upload,
  Zap,
  Sparkles,
  Check,
  ArrowRight,
  CheckCircle2
} from 'lucide-vue-next'

interface Contact {
  id: string
  phone: string
  formatted: string
  name?: string
  confidence: 'high' | 'medium' | 'low'
  selected: boolean
}

const videoRef = ref<HTMLVideoElement | null>(null)
const cameraActive = ref(false)
const isProcessing = ref(false)
const capturedImage = ref('')
const contacts = ref<Contact[]>([])
const stream = ref<MediaStream | null>(null)

const selectedCount = computed(() => contacts.value.filter(c => c.selected).length)

async function startCamera() {
  try {
    stream.value = await navigator.mediaDevices.getUserMedia({
      video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } }
    })

    if (videoRef.value) {
      videoRef.value.srcObject = stream.value
      await videoRef.value.play()
      cameraActive.value = true
    }
  } catch (e) {
    console.error('Camera error:', e)
  }
}

function stopCamera() {
  if (stream.value) {
    stream.value.getTracks().forEach(track => track.stop())
    stream.value = null
  }
  cameraActive.value = false
}

async function extractPhonesFromCanvas(canvas: HTMLCanvasElement): Promise<Contact[]> {
  const imageData = canvas.toDataURL('image/jpeg', 0.8)
  
  try {
    const data = await $fetch('/api/ocr/extract', {
      method: 'POST',
      body: { image: imageData }
    }) as any

    if (data?.success) {
      return data.contacts.map((c: any) => ({
        ...c,
        selected: c.confidence !== 'low'
      }))
    }
  } catch (e) {
    console.error('OCR API failed', e)
  }
  return []
}

async function capture() {
  if (!videoRef.value) return
  
  const video = videoRef.value
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(video, 0, 0)
  
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.8)
  isProcessing.value = true
  
  stopCamera()
  
  contacts.value = await extractPhonesFromCanvas(canvas)
  isProcessing.value = false
}

async function handleFileUpload(event: Event) {
  const input = event.target as HTMLInputElement
  const file = input.files?.[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = () => {
    capturedImage.value = reader.result as string
    isProcessing.value = true
    
    const img = new Image()
    img.onload = async () => {
      const canvas = document.createElement('canvas')
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext('2d')
      ctx?.drawImage(img, 0, 0)
      
      contacts.value = await extractPhonesFromCanvas(canvas)
      isProcessing.value = false
    }
    img.src = reader.result as string
  }
  reader.readAsDataURL(file)
}

function resetScanner() {
  capturedImage.value = ''
  contacts.value = []
  isProcessing.value = false
  stopCamera()
}

async function importContacts() {
  const user = useSupabaseUser()
  if (!user.value) {
    navigateTo('/login')
    return
  }

  const { $supabase } = useNuxtApp()
  const selectedContacts = contacts.value.filter(c => c.selected)
  
  for (const contact of selectedContacts) {
    await $supabase.from('contacts').insert({
      user_id: user.value.id,
      phone: contact.phone,
      name: contact.name || null,
      source: 'ocr',
      confidence: contact.confidence
    })
  }

  navigateTo('/contacts')
}

onUnmounted(() => stopCamera())
</script>

<style scoped>
input::placeholder {
  color: #CBD5E1;
}
</style>