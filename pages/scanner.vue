<template>
  <div class="page-container">
    <div class="scanner-card">
      <div class="scanner-header">
        <div class="header-content">
          <div class="icon-wrapper">
            <ScanLine :size="24" />
          </div>
          <div>
            <h1 class="title">Smart Scanner</h1>
            <p class="subtitle">Capture contacts from any paper</p>
          </div>
        </div>
      </div>

      <div class="camera-frame" :class="{ 'is-processing': isProcessing }">
        <video 
          v-if="cameraActive && !isProcessing" 
          ref="videoRef" 
          class="camera-feed"
          autoplay 
          playsinline
          muted
        />
        
        <div v-else-if="!cameraActive && !capturedImage" class="camera-placeholder">
          <Camera :size="48" />
          <p>Tap to activate camera</p>
        </div>

        <img 
          v-if="capturedImage" 
          :src="capturedImage" 
          class="captured-image"
          alt="Captured"
        />

        <div v-if="isProcessing" class="processing-overlay">
          <div class="processing-content">
            <Loader2 :size="32" class="animate-spin" />
            <span>Extracting contacts...</span>
          </div>
        </div>

        <div class="scan-overlay">
          <div class="corner top-left"></div>
          <div class="corner top-right"></div>
          <div class="corner bottom-left"></div>
          <div class="corner bottom-right"></div>
        </div>

        <button 
          v-if="cameraActive && !isProcessing && !capturedImage"
          @click="capture" 
          class="capture-button"
          :disabled="isCapturing"
        >
          <div class="capture-ring">
            <div class="capture-inner"></div>
          </div>
        </button>
      </div>

      <div class="results-section" v-if="contacts.length > 0">
        <div class="results-header">
          <CheckCircle2 :size="20" class="text-emerald-500" />
          <span>{{ contacts.length }} contacts found</span>
        </div>
        
        <div class="contacts-list">
          <div 
            v-for="contact in contacts" 
            :key="contact.id"
            class="contact-item"
            :class="{ 'low-confidence': contact.confidence === 'low' }"
          >
            <div class="contact-info">
              <span class="contact-name">{{ contact.name || 'Unknown' }}</span>
              <span class="contact-phone">{{ contact.formatted }}</span>
            </div>
            <div class="confidence-badge" :class="contact.confidence">
              {{ contact.confidence }}
            </div>
          </div>
        </div>

        <div class="action-buttons">
          <button @click="resetScanner" class="btn-secondary">
            Scan Again
          </button>
          <button @click="importContacts" class="btn-primary">
            Add to Contacts
          </button>
        </div>
      </div>

      <div class="controls">
        <button 
          v-if="!cameraActive && !capturedImage"
          @click="startCamera" 
          class="btn-primary full-width"
        >
          <Camera :size="20" />
          Start Scanning
        </button>

        <div v-if="cameraActive && !capturedImage" class="upload-option">
          <span class="-divider">or</span>
          <label class="upload-button">
            <Upload :size="18" />
            Upload Image
            <input 
              type="file" 
              accept="image/*" 
              @change="handleFileUpload" 
              hidden
            />
          </label>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ScanLine, Camera, Upload, Loader2, CheckCircle2 } from 'lucide-vue-next'
import { extractPhoneCandidates, formatPhoneLabel } from '~/utils/ocr'

interface Contact {
  id: string
  phone: string
  formatted: string
  name?: string
  confidence: 'high' | 'medium' | 'low'
}

const videoRef = ref<HTMLVideoElement | null>(null)
const canvasRef = ref<HTMLCanvasElement | null>(null)

const cameraActive = ref(false)
const isProcessing = ref(false)
const isCapturing = ref(false)
const capturedImage = ref('')
const contacts = ref<Contact[]>([])
let mediaStream: MediaStream | null = null

const { start: startCameraStream, stop: stopCameraStream, stream } = useMediaDevices({ 
  constraints: { video: { facingMode: 'environment', width: { ideal: 1920 }, height: { ideal: 1080 } } }
})

const US_PHONE_PATTERNS = [
  /\b(\+?1[-.\s]?)?(\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4})\b/g,
  /\b\d{10}\b/g,
]

function calculateConfidence(raw: string, context: string): 'high' | 'medium' | 'low' {
  let score = 0
  
  if (raw.match(/^\+?1?\d{10}$/)) score += 30
  if (context.match(/(?:ph|cell|mobile|call)[:\s]/i)) score += 20
  if (raw.match(/^\d{3}[-.\s]\d{4}$/)) score += 25
  if (raw.match(/^(?:800|888|877|866|855)\d{7}$/)) score -= 20
  if (raw.match(/^1{10}$/) || raw.match(/^(?:123|999)\d{7}$/)) score -= 40
  
  if (score >= 30) return 'high'
  if (score >= 0) return 'medium'
  return 'low'
}

async function extractPhonesFromCanvas(canvas: HTMLCanvasElement): Promise<Contact[]> {
  const ctx = canvas.getContext('2d')
  if (!ctx) return []

  const imageData = canvas.toDataURL('image/jpeg', 0.8)
  
  try {
    const { data } = await useFetch('/api/ocr/extract', {
      method: 'POST',
      body: { image: imageData },
      headers: { 'Content-Type': 'application/json' }
    }) as any

    if (data.value?.success) {
      return data.value.contacts.map((c: any) => ({
        id: crypto.randomUUID(),
        phone: c.normalized,
        formatted: c.formatted,
        name: c.inferredName,
        confidence: c.confidence as 'high' | 'medium' | 'low'
      }))
    }
  } catch (e) {
    console.error('OCR API failed, falling back to regex', e)
  }

  return []
}

async function capture() {
  if (!videoRef.value || isCapturing.value) return
  
  isCapturing.value = true
  
  const video = videoRef.value
  const canvas = document.createElement('canvas')
  canvas.width = video.videoWidth
  canvas.height = video.videoHeight
  
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(video, 0, 0)
  
  capturedImage.value = canvas.toDataURL('image/jpeg', 0.8)
  isProcessing.value = true
  
  const foundContacts = await extractPhonesFromCanvas(canvas)
  contacts.value = foundContacts
  
  isProcessing.value = false
  isCapturing.value = false
  
  stopCameraStream()
  cameraActive.value = false
}

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
  }
  cameraActive.value = false
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
      
      const foundContacts = await extractPhonesFromCanvas(canvas)
      contacts.value = foundContacts
      isProcessing.value = false
    }
    img.src = reader.result as string
  }
  reader.readAsDataURL(file)
}

function resetScanner() {
  capturedImage.value = ''
  contacts.value = []
}

async function importContacts() {
  const { data: { user } } = useSupabaseUser()
  if (!user.value) {
    navigateTo('/login')
    return
  }

  const { $supabase } = useNuxtApp()
  
  for (const contact of contacts.value) {
    const { error } = await $supabase
      .from('contacts')
      .insert({
        user_id: user.value.id,
        phone: contact.phone,
        name: contact.name || null,
        source: 'ocr',
        confidence: contact.confidence
      })
    
    if (error) {
      console.error('Failed to import contact:', error)
    }
  }

  navigateTo('/contacts')
}

onUnmounted(() => {
  stopCamera()
})
</script>

<style scoped>
.page-container {
  min-height: 100vh;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
}

.scanner-card {
  width: 100%;
  max-width: 400px;
  background: rgba(255, 255, 255, 0.9);
  backdrop-filter: blur(20px);
  border-radius: 2rem;
  padding: 1.5rem;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 1px rgba(255, 255, 255, 0.5);
}

.scanner-header {
  margin-bottom: 1.5rem;
}

.header-content {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.icon-wrapper {
  width: 48px;
  height: 48px;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #1e293b;
}

.subtitle {
  font-size: 0.875rem;
  color: #64748b;
}

.camera-frame {
  position: relative;
  aspect-ratio: 3/4;
  background: #0f172a;
  border-radius: 1.5rem;
  overflow: hidden;
}

.camera-feed {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.camera-placeholder {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
  color: #475569;
}

.captured-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.processing-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 23, 42, 0.8);
  backdrop-filter: blur(8px);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

.processing-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.scan-overlay {
  position: absolute;
  inset: 1rem;
  pointer-events: none;
}

.corner {
  position: absolute;
  width: 24px;
  height: 24px;
  border-color: #007AFF;
}

.corner.top-left {
  top: 0;
  left: 0;
  border-top: 3px solid;
  border-left: 3px solid;
}

.corner.top-right {
  top: 0;
  right: 0;
  border-top: 3px solid;
  border-right: 3px solid;
}

.corner.bottom-left {
  bottom: 0;
  left: 0;
  border-bottom: 3px solid;
  border-left: 3px solid;
}

.corner.bottom-right {
  bottom: 0;
  right: 0;
  border-bottom: 3px solid;
  border-right: 3px solid;
}

.capture-button {
  position: absolute;
  bottom: 2rem;
  left: 50%;
  transform: translateX(-50%);
  background: transparent;
  border: none;
  cursor: pointer;
}

.capture-ring {
  width: 64px;
  height: 64px;
  border: 3px solid white;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.capture-inner {
  width: 48px;
  height: 48px;
  background: white;
  border-radius: 50%;
}

.capture-button:active .capture-inner {
  transform: scale(0.9);
}

.results-section {
  margin-top: 1.5rem;
  animation: fadeInUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.results-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-weight: 600;
  color: #059669;
  margin-bottom: 1rem;
}

.contacts-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-height: 200px;
  overflow-y: auto;
}

.contact-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.875rem 1rem;
  background: linear-gradient(135deg, #F8FAFC 0%, #F1F5F9 100%);
  border-radius: 1rem;
  border: 1px solid #E2E8F0;
}

.contact-item.low-confidence {
  opacity: 0.6;
  background: #FEF3C7;
  border-color: #FCD34D;
}

.contact-info {
  display: flex;
  flex-direction: column;
}

.contact-name {
  font-weight: 600;
  color: #1e293b;
}

.contact-phone {
  font-size: 0.875rem;
  color: #64748b;
}

.confidence-badge {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  text-transform: capitalize;
}

.confidence-badge.high {
  background: #D1FAE5;
  color: #059669;
}

.confidence-badge.medium {
  background: #FEF3C7;
  color: #D97706;
}

.confidence-badge.low {
  background: #FEE2E2;
  color: #DC2626;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.25rem;
}

.btn-primary {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 1.5rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 600;
  border: none;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
}

.btn-secondary {
  flex: 1;
  padding: 0.875rem 1.5rem;
  background: #F1F5F9;
  color: #475569;
  font-weight: 600;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-secondary:hover {
  background: #E2E8F0;
}

.controls {
  margin-top: 1.5rem;
}

.full-width {
  width: 100%;
}

.upload-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  margin-top: 1rem;
}

.divider {
  color: #94A3B8;
  font-size: 0.875rem;
}

.upload-button {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: #F1F5F9;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.75rem;
  cursor: pointer;
  transition: background 0.2s;
}

.upload-button:hover {
  background: #E2E8F0;
}

.animate-spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}
</style>