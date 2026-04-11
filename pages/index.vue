<template>
  <div class="landing">
    <div class="hero">
      <div class="hero-bg"></div>
      <div class="hero-content">
        <div class="logo">
          <div class="logo-icon">
            <Zap :size="32" />
          </div>
          <h1>167Call</h1>
        </div>
        
        <h2>Your Smart Sales Assistant</h2>
        <p>Turn your retail contacts into loyal customers with personalized SMS — sent from YOUR real phone number.</p>
        
        <div class="features">
          <div class="feature">
            <ScanLine :size="24" />
            <div>
              <h3>Scan & Capture</h3>
              <p>Point at any paper — business cards, handwritten notes, receipts. Our AI extracts every phone number instantly.</p>
            </div>
          </div>
          <div class="feature">
            <Sparkles :size="24" />
            <div>
              <h3>AI Personalization</h3>
              <p>Every message feels handwritten. AI crafts unique texts using each customer's preferences.</p>
            </div>
          </div>
          <div class="feature">
            <Smartphone :size="24" />
            <div>
              <h3>Your Real Number</h3>
              <p>Texts come from YOUR phone, not some spam number. Customers recognize and trust it.</p>
            </div>
          </div>
        </div>
        
        <div class="cta">
          <NuxtLink to="/login" class="btn-primary">
            Get Started Free
            <ArrowRight :size="20" />
          </NuxtLink>
          <p class="cta-note">No credit card · 200 free texts/month</p>
        </div>
      </div>
      
      <div class="hero-visual">
        <div class="phone-mockup">
          <div class="notch"></div>
          <div class="screen">
            <div class="message-preview">
              <div class="avatar">SJ</div>
              <div class="bubble">
                Hey Sarah! Those new Adidas Ultraboosts just landed — the exact style you've been eyeing. 👟
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Zap, ScanLine, Sparkles, Smartphone, ArrowRight } from 'lucide-vue-next'

definePageMeta({
  layout: false
})
</script>

<style scoped>
.landing {
  min-height: 100vh;
  background: linear-gradient(135deg, #F8FAFF 0%, #EEF2FF 50%, #E0E7FF 100%);
}

.hero {
  min-height: 100vh;
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  gap: 2rem;
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
}

@media (max-width: 768px) {
  .hero {
    grid-template-columns: 1fr;
    text-align: center;
  }
}

.hero-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.logo-icon {
  width: 56px;
  height: 56px;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  border-radius: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
}

.logo h1 {
  font-size: 2rem;
  font-weight: 700;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero h2 {
  font-size: 1.75rem;
  font-weight: 600;
  color: #1E293B;
}

.hero > .hero-content > p {
  font-size: 1.125rem;
  color: #64748B;
  line-height: 1.6;
}

.features {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  margin: 1rem 0;
}

.feature {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  background: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  border-radius: 1rem;
  border: 1px solid rgba(255, 255, 255, 0.5);
}

.feature > svg {
  color: #007AFF;
  flex-shrink: 0;
}

.feature h3 {
  font-weight: 600;
  color: #1E293B;
  margin-bottom: 0.25rem;
}

.feature p {
  font-size: 0.875rem;
  color: #64748B;
}

.cta {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 0.75rem;
  margin-top: 1rem;
}

@media (max-width: 768px) {
  .cta {
    align-items: center;
  }
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 600;
  font-size: 1.125rem;
  border-radius: 1rem;
  text-decoration: none;
  box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
  transition: all 0.2s;
}

.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 12px 32px rgba(0, 122, 255, 0.4);
}

.cta-note {
  font-size: 0.875rem;
  color: #94A3B8;
}

.hero-visual {
  display: flex;
  justify-content: center;
}

.phone-mockup {
  width: 280px;
  height: 560px;
  background: #0F172A;
  border-radius: 3rem;
  padding: 12px;
  box-shadow: 0 32px 64px rgba(0, 0, 0, 0.3);
}

.notch {
  width: 120px;
  height: 28px;
  background: #0F172A;
  border-radius: 1.5rem;
  margin: 0 auto 1rem;
}

.screen {
  width: 100%;
  height: 100%;
  background: #1E293B;
  border-radius: 2.5rem;
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.message-preview {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
}

.avatar {
  width: 36px;
  height: 36px;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 0.75rem;
  font-weight: 600;
  flex-shrink: 0;
}

.bubble {
  max-width: 200px;
  padding: 0.75rem 1rem;
  background: #334155;
  border-radius: 1rem;
  border-bottom-left-radius: 0.25rem;
  color: white;
  font-size: 0.875rem;
  line-height: 1.4;
}
</style>