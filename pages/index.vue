<template>
  <div class="landing-page selection:bg-brand-500/30">
    <!-- Navbar -->
    <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4 flex items-center justify-between backdrop-blur-md bg-white/60 border-b border-slate-200/50">
      <div class="flex items-center gap-2.5">
        <div class="w-10 h-10 bg-gradient-to-br from-brand-500 to-brand-700 rounded-xl flex items-center justify-center shadow-glow-sm">
          <Zap :size="22" class="text-white fill-white/20" />
        </div>
        <span class="text-xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          121Call
        </span>
      </div>
      <div class="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600">
        <a href="#features" class="hover:text-brand-600 transition-colors">Features</a>
        <a href="#how-it-works" class="hover:text-brand-600 transition-colors">How it works</a>
        <NuxtLink to="/login" class="px-5 py-2.5 bg-slate-900 text-white rounded-xl hover:bg-slate-800 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-slate-900/10">
          Sign In
        </NuxtLink>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="relative pt-32 pb-20 overflow-hidden">
      <!-- Background elements -->
      <div class="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[800px] pointer-events-none">
        <div class="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-200/30 blur-[120px] rounded-full"></div>
        <div class="absolute bottom-[20%] right-[-5%] w-[35%] h-[35%] bg-purple-200/20 blur-[120px] rounded-full"></div>
      </div>

      <div class="max-w-7xl mx-auto px-6">
        <div class="grid lg:grid-cols-2 gap-16 items-center">
          <div class="animate-fade-in-up">
            <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-brand-50 border border-brand-100 text-brand-600 text-xs font-bold uppercase tracking-wider mb-6">
              <Sparkles :size="14" />
              Next-Gen Retail CRM
            </div>
            <h1 class="text-5xl lg:text-7xl font-bold text-slate-900 leading-[1.1] mb-6 tracking-tight">
              Turn scanning into <br />
              <span class="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent italic">selling.</span>
            </h1>
            <p class="text-xl text-slate-600 leading-relaxed mb-10 max-w-xl">
              The smartest way for retailers to capture contacts and send personalized SMS campaigns. Zero manual entry, 100% human connection.
            </p>

            <div class="flex flex-col sm:flex-row gap-4">
              <NuxtLink to="/login" class="flex items-center justify-center gap-2 px-8 py-4 bg-brand-600 text-white text-lg font-semibold rounded-2xl hover:bg-brand-700 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-xl shadow-brand-600/20">
                Get Started for Free
                <ArrowRight :size="20" />
              </NuxtLink>
              <a href="#how-it-works" class="flex items-center justify-center gap-2 px-8 py-4 bg-white text-slate-900 text-lg font-semibold rounded-2xl border border-slate-200 hover:bg-slate-50 transition-all">
                See it in action
              </a>
            </div>

            <div class="mt-12 flex items-center gap-6">
              <div class="flex -space-x-3">
                <div v-for="i in 4" :key="i" class="w-10 h-10 rounded-full border-2 border-white bg-slate-200 overflow-hidden">
                  <img :src="`https://i.pravatar.cc/100?u=${i}`" alt="User" />
                </div>
              </div>
              <p class="text-sm text-slate-500 font-medium">
                Joined by <span class="text-slate-900 font-bold">500+</span> boutique owners
              </p>
            </div>
          </div>

          <div class="relative animate-scale-in">
            <div class="relative z-10 w-full max-w-[420px] mx-auto">
              <!-- Glass Card for Demo -->
              <div class="absolute -top-6 -left-6 z-20 w-48 p-4 backdrop-blur-xl bg-white/80 border border-white/50 rounded-2xl shadow-2xl animate-slide-in">
                <div class="flex items-center gap-3 mb-3">
                  <div class="w-8 h-8 bg-emerald-100 text-emerald-600 rounded-lg flex items-center justify-center">
                    <CheckCircle2 :size="18" />
                  </div>
                  <div class="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Extracted</div>
                </div>
                <div class="text-sm font-semibold text-slate-900">Sarah Johnson</div>
                <div class="text-xs text-slate-500">(212) 555-0198</div>
              </div>

              <!-- Main Mockup -->
              <div class="bg-slate-900 rounded-[3rem] p-3 shadow-2xl shadow-slate-900/20 aspect-[9/18.5]">
                <div class="bg-slate-800 h-full w-full rounded-[2.5rem] overflow-hidden relative">
                  <div class="absolute top-0 inset-x-0 h-6 flex justify-center py-1">
                    <div class="w-20 h-4 bg-slate-900 rounded-full"></div>
                  </div>
                  <div class="p-6 pt-10 flex flex-col h-full bg-slate-50">
                    <div class="flex items-center justify-between mb-8">
                      <div class="text-xl font-bold text-slate-900">New Campaign</div>
                      <X :size="20" class="text-slate-400" />
                    </div>
                    <div class="space-y-4">
                      <div class="p-4 bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <div class="text-xs font-bold text-slate-400 uppercase mb-2 tracking-tight">Template</div>
                        <div class="text-sm text-slate-800 leading-relaxed">
                          Hey <span class="text-brand-600 font-bold underline decoration-brand-200 underline-offset-4">@{{firstName}}</span>! Those new <span class="text-indigo-600 font-bold italic">@{{interest}}</span> just landed...
                        </div>
                      </div>
                      <div class="p-4 bg-brand-600 rounded-2xl text-white shadow-lg shadow-brand-600/20">
                        <div class="text-[10px] font-bold text-white/60 uppercase mb-2">Message Preview</div>
                        <div class="text-sm leading-relaxed">
                          Hey Sarah! Those new Adidas Ultraboosts just landed — the exact style you've been eyeing. 👟
                        </div>
                      </div>
                    </div>
                    <div class="mt-auto pt-6">
                      <div class="w-full py-4 bg-slate-900 text-white rounded-2xl text-center font-bold shadow-lg">
                        Send to 48 contacts
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <!-- Decorative circle -->
            <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-brand-200/30 rounded-full pointer-events-none"></div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-24 bg-white">
      <div class="max-w-7xl mx-auto px-6">
        <div class="text-center max-w-2xl mx-auto mb-20">
          <h2 class="text-xs font-bold text-brand-600 uppercase tracking-[0.2em] mb-4">Core Capabilities</h2>
          <p class="text-4xl font-bold text-slate-900 leading-tight">Everything you need to grow your retail business.</p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div v-for="feature in features" :key="feature.title" class="group p-8 bg-slate-50 hover:bg-white rounded-3xl border border-transparent hover:border-slate-200 hover:shadow-xl transition-all duration-300">
            <div :class="`w-14 h-14 ${feature.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`">
              <component :is="feature.icon" :size="28" class="text-white" />
            </div>
            <h3 class="text-xl font-bold text-slate-900 mb-3">{{ feature.title }}</h3>
            <p class="text-slate-600 leading-relaxed">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Interactive CTA -->
    <section class="py-24 overflow-hidden">
      <div class="max-w-7xl mx-auto px-6">
        <div class="relative bg-slate-900 rounded-[3rem] p-12 md:p-20 overflow-hidden">
          <div class="absolute top-0 right-0 w-[50%] h-full bg-gradient-to-l from-brand-600/20 to-transparent pointer-events-none"></div>
          <div class="relative z-10 max-w-2xl">
            <h2 class="text-4xl md:text-5xl font-bold text-white leading-tight mb-8">
              Ready to automate your <br />
              <span class="text-brand-400">customer outreach?</span>
            </h2>
            <div class="flex flex-col sm:flex-row gap-6 items-center">
              <NuxtLink to="/login" class="w-full sm:w-auto px-10 py-5 bg-brand-600 text-white text-lg font-bold rounded-2xl hover:bg-brand-500 transition-all text-center">
                Get Started for Free
              </NuxtLink>
              <div class="text-slate-400 text-sm font-medium">
                No credit card required. <br />
                200 free texts every month.
              </div>
            </div>
          </div>
          <!-- Abstract Background Shape -->
          <div class="absolute -bottom-24 -right-24 w-96 h-96 bg-brand-500/10 blur-[100px] rounded-full"></div>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="py-12 border-t border-slate-200">
      <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
        <div class="flex items-center gap-2.5">
          <div class="w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center">
            <Zap :size="18" class="text-white" />
          </div>
          <span class="text-lg font-bold text-slate-900 tracking-tight">121Call</span>
        </div>
        <p class="text-sm text-slate-500">© 2024 121Call Inc. All rights reserved.</p>
        <div class="flex items-center gap-6 text-sm font-medium text-slate-600">
          <a href="#" class="hover:text-brand-600">Privacy</a>
          <a href="#" class="hover:text-brand-600">Terms</a>
          <a href="#" class="hover:text-brand-600">Contact</a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import {
  Zap,
  Sparkles,
  ScanLine,
  Smartphone,
  ArrowRight,
  CheckCircle2,
  X,
  MessageSquare,
  ShieldCheck,
  ZapIcon
} from 'lucide-vue-next'

definePageMeta({
  layout: false
})

const features = [
  {
    title: 'Smart Scanning',
    description: 'Our AI extracts phone numbers from business cards, handwritten notes, and receipts with 99.9% accuracy.',
    icon: ScanLine,
    color: 'bg-brand-600'
  },
  {
    title: 'AI Personalization',
    description: 'Every message is dynamically crafted for the individual customer, making it feel like a personal text.',
    icon: Sparkles,
    color: 'bg-indigo-600'
  },
  {
    title: 'Your Real Number',
    description: 'Sync your Android phone and send messages from your actual number to build real trust with customers.',
    icon: Smartphone,
    color: 'bg-emerald-600'
  }
]
</script>

<style scoped>
.landing-page {
  background: #FAFCFF;
}

@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes scaleIn {
  from { opacity: 0; transform: scale(0.9); }
  to { opacity: 1; transform: scale(1); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

.animate-fade-in-up {
  animation: fadeInUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-scale-in {
  animation: scaleIn 1s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

.animate-slide-in {
  animation: slideIn 0.8s cubic-bezier(0.16, 1, 0.3, 1) 0.5s forwards;
  opacity: 0;
}
</style>