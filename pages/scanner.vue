<template>
  <div class="scanner-page">
    <header class="page-header">
      <div class="container flex justify-between items-center">
        <NuxtLink to="/dashboard" class="back-link">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M15 10H5M5 10L9 6M5 10L9 14" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path></svg>
          Back
        </NuxtLink>
        <h1 class="header-title">Smart Import</h1>
        <button v-if="contacts.length > 0" @click="resetScanner" class="reset-btn">Reset</button>
      </div>
    </header>

    <main class="container py-8">
      <div v-if="!capturedImage && !isProcessing" class="setup-view">
        <div class="scan-card">
          <div class="camera-preview">
            <video v-if="cameraActive" ref="videoRef" autoplay playsinline muted></video>
            <div v-else class="camera-placeholder">
              <div class="placeholder-icon">📸</div>
              <p>Camera is inactive</p>
            </div>
            <div class="scan-overlay">
              <div class="scan-line"></div>
              <div class="corners">
                <div class="corner tl"></div><div class="corner tr"></div>
                <div class="corner bl"></div><div class="corner br"></div>
              </div>
            </div>
          </div>

          <div class="action-bar">
            <button v-if="!cameraActive" @click="startCamera" class="btn-primary w-full">
              Open Camera
            </button>
            <button v-else @click="capture" class="btn-capture">
              <div class="capture-inner"></div>
            </button>

            <div class="divider text-center my-4 text-xs font-bold text-slate-400">OR</div>

            <label class="btn-secondary w-full cursor-pointer text-center block">
              Upload from Gallery
              <input type="file" accept="image/*" @change="handleFileUpload" hidden />
            </label>
          </div>
        </div>

        <div class="help-section mt-8">
          <h3 class="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Tips for better accuracy</h3>
          <ul class="space-y-3">
            <li class="help-item">
              <div class="help-icon">💡</div>
              <span>Ensure good lighting and avoid shadows on the paper.</span>
            </li>
            <li class="help-item">
              <div class="help-icon">🎯</div>
              <span>Keep the camera steady and parallel to the text.</span>
            </li>
          </ul>
        </div>
      </div>

      <div v-if="isProcessing" class="processing-view py-20 text-center">
        <div class="loader-wrap mb-8">
          <div class="loader-circle"></div>
          <div class="loader-icon">🔍</div>
        </div>
        <h2 class="text-2xl font-bold text-slate-900 mb-2">Reading handwritten note…</h2>
        <p class="text-slate-500">Extracting names and phone numbers</p>
      </div>

      <div v-if="capturedImage && !isProcessing" class="results-view space-y-6 animate-fade-in">
        <div class="results-header flex justify-between items-center">
          <div class="badge-count">
            <span class="dot"></span>
            {{ contacts.length }} numbers ready to import
          </div>
          <p class="text-xs font-semibold text-slate-400">Source: {{ source }}</p>
        </div>

        <div class="results-list space-y-3">
          <div v-for="contact in contacts" :key="contact.id" class="result-card" :class="{ 'is-skipped': !contact.selected }">
            <div class="result-main">
              <div class="result-info">
                <input v-model="contact.formatted" class="phone-input" />
                <div class="inferred-row">
                  <span class="label">Inferred name:</span>
                  <input v-model="contact.name" class="name-input" placeholder="Unknown" />
                </div>
              </div>
              <div class="result-meta">
                <div class="confidence" :class="'conf-' + contact.confidence">● {{ contact.confidence }}</div>
                <div class="actions">
                  <button @click="contact.selected = true" class="ocr-btn keep" :class="{ active: contact.selected }">Keep</button>
                  <button @click="contact.selected = false" class="ocr-btn skip" :class="{ active: !contact.selected }">Skip</button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="sticky-footer py-6">
          <button @click="importContacts" class="btn-primary w-full shadow-xl" :disabled="selectedCount === 0">
            Import {{ selectedCount }} Contacts
          </button>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup lang="ts">
interface Contact {
  id: string
  phone: string
  formatted: string
  name: string
  confidence: 'high' | 'medium' | 'low'
  selected: boolean
}

const videoRef = ref<HTMLVideoElement | null>(null)
const cameraActive = ref(false)
const isProcessing = ref(false)
const capturedImage = ref('')
const contacts = ref<Contact[]>([])
const source = ref('')
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

async function extractPhones(imageData: string) {
  isProcessing.value = true
  try {
    const data = await $fetch('/api/ocr/extract', {
      method: 'POST',
      body: { image: imageData }
    }) as any
    if (data?.success) {
      contacts.value = data.contacts.map((c: any) => ({
        ...c,
        name: c.inferredName || '',
        selected: c.confidence !== 'low'
      }))
      source.value = data.source
    }
  } catch (e) {
    console.error('OCR failed', e)
  } finally {
    isProcessing.value = false
  }
}

async function capture() {
  if (!videoRef.value) return
  const canvas = document.createElement('canvas')
  canvas.width = videoRef.value.videoWidth
  canvas.height = videoRef.value.videoHeight
  canvas.getContext('2d')?.drawImage(videoRef.value, 0, 0)
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.8)
  stopCamera()
  await extractPhones(capturedImage.value)
}

async function handleFileUpload(event: Event) {
  const file = (event.target as HTMLInputElement).files?.[0]
  if (!file) return
  const reader = new FileReader()
  reader.onload = async () => {
    capturedImage.value = reader.result as string
    await extractPhones(capturedImage.value)
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
  const { $supabase } = useNuxtApp()
  const user = useSupabaseUser()
  if (!user.value) return navigateTo('/login')
  
  const selected = contacts.value.filter(c => c.selected)
  for (const c of selected) {
    await $supabase.from('contacts').upsert({
      user_id: user.value.id,
      phone: c.phone,
      name: c.name || null,
      source: 'ocr',
      confidence: c.confidence
    })
  }
  navigateTo('/dashboard')
}

onUnmounted(() => stopCamera())
</script>

<style scoped>
.scanner-page {
  --blue: #1352F0;
  --green: #0DBA7F;
  --green-pale: #E8FAF3;
  --orange: #FF5C35;
  --orange-pale: #FFF3EF;
  --surface-alt: #F0F5FF;
  --ink: #08091A;
  --ink-2: #3D4561;
  --ink-3: #8A91AB;
  --border: rgba(19,82,240,.1);
  --r-lg: 24px;
  --r-full: 9999px;

  min-height: 100vh;
  background: #EEF4FF;
  color: var(--ink);
}

.container { max-width: 600px; margin: 0 auto; padding: 0 20px; }

.page-header {
  background: rgba(238,244,255,.85);
  backdrop-filter: blur(20px);
  border-bottom: 1px solid var(--border);
  height: 64px;
  display: flex;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 50;
}

.back-link { display: flex; align-items: center; gap: 4px; font-weight: 600; font-size: 14px; color: var(--ink-2); }
.header-title { font-size: 16px; font-weight: 800; }
.reset-btn { font-size: 13px; font-weight: 700; color: var(--blue); background: none; }

.camera-preview {
  position: relative;
  aspect-ratio: 3/4;
  background: var(--ink);
  border-radius: var(--r-lg);
  overflow: hidden;
  box-shadow: 0 20px 40px rgba(8,9,26,.2);
}

video { width: 100%; height: 100%; object-fit: cover; }
.camera-placeholder { height: 100%; display: flex; flex-direction: column; align-items: center; justify-content: center; color: var(--ink-3); gap: 12px; }
.placeholder-icon { font-size: 40px; opacity: .4; }

.scan-overlay { position: absolute; inset: 24px; pointer-events: none; }
.scan-line { position: absolute; left: 0; right: 0; height: 2px; background: linear-gradient(90deg, transparent, var(--blue), transparent); animation: scan 2s ease-in-out infinite; }
@keyframes scan { 0%,100% { top: 10%; } 50% { top: 90%; } }

.corner { position: absolute; width: 20px; height: 20px; border-color: var(--blue); border-width: 3px; border-style: solid; }
.tl { top: 0; left: 0; border-right: 0; border-bottom: 0; border-radius: 8px 0 0 0; }
.tr { top: 0; right: 0; border-left: 0; border-bottom: 0; border-radius: 0 8px 0 0; }
.bl { bottom: 0; left: 0; border-right: 0; border-top: 0; border-radius: 0 0 0 8px; }
.br { bottom: 0; right: 0; border-left: 0; border-top: 0; border-radius: 0 0 8px 0; }

.action-bar { padding: 24px; background: white; border-radius: 0 0 var(--r-lg) var(--r-lg); border: 1px solid var(--border); border-top: none; }

.btn-primary { background: var(--orange); color: white; padding: 14px 24px; border-radius: var(--r-full); font-weight: 700; font-size: 16px; border: none; }
.btn-secondary { background: var(--surface-alt); color: var(--ink-2); padding: 12px 24px; border-radius: var(--r-full); font-weight: 600; font-size: 14px; border: 1px solid var(--border); }

.btn-capture { width: 72px; height: 72px; border-radius: 50%; border: 4px solid white; padding: 4px; background: none; margin: 0 auto; display: block; }
.capture-inner { width: 100%; height: 100%; background: white; border-radius: 50%; }

.badge-count { background: var(--green-pale); color: #0A8B5E; padding: 6px 14px; border-radius: var(--r-full); font-size: 13px; font-weight: 700; display: flex; align-items: center; gap: 8px; }
.dot { width: 6px; height: 6px; background: var(--green); border-radius: 50%; }

.result-card { background: white; border-radius: 16px; padding: 16px; border: 1px solid var(--border); transition: all .2s; }
.result-card.is-skipped { opacity: .5; grayscale: 1; }

.result-main { display: flex; flex-direction: column; gap: 12px; }
.phone-input { font-size: 16px; font-weight: 800; color: var(--ink); background: none; border: none; padding: 0; width: 100%; font-family: monospace; }
.inferred-row { display: flex; align-items: center; gap: 6px; font-size: 12px; }
.inferred-row .label { color: var(--ink-3); }
.name-input { font-weight: 600; color: var(--ink-2); background: none; border: none; padding: 0; flex: 1; }

.result-meta { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border); padding-top: 12px; margin-top: 4px; }
.confidence { font-size: 11px; font-weight: 700; text-transform: uppercase; }
.conf-high { color: var(--green); }
.conf-medium { color: #F59E0B; }
.conf-low { color: var(--orange); }

.ocr-btn { padding: 6px 14px; border-radius: var(--r-full); font-size: 11px; font-weight: 700; background: var(--surface-alt); color: var(--ink-3); border: 1px solid var(--border); }
.ocr-btn.keep.active { background: var(--green-pale); color: #0A8B5E; border-color: rgba(13,186,127,.3); }
.ocr-btn.skip.active { background: var(--orange-pale); color: #C0361A; border-color: rgba(255,92,53,.2); }

.loader-wrap { position: relative; width: 80px; height: 80px; margin: 0 auto; }
.loader-circle { position: absolute; inset: 0; border: 4px solid var(--blue-pale); border-top-color: var(--blue); border-radius: 50%; animation: spin 1s linear infinite; }
.loader-icon { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 32px; }
@keyframes spin { to { transform: rotate(360deg); } }

.animate-fade-in { animation: fadeIn .4s ease-out; }
@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
</style>