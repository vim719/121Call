<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <NuxtLink to="/dashboard" class="header-btn">
            <ChevronLeft :size="20" />
          </NuxtLink>
          <h1 class="text-xl font-semibold text-slate-900">Campaigns</h1>
        </div>
        <NuxtLink to="/campaigns/new" class="btn-primary-sm">
          <Plus :size="18" />
          New
        </NuxtLink>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6">
      <div v-if="campaigns.length > 0" class="campaigns-list">
        <div v-for="campaign in campaigns" :key="campaign.id" class="campaign-card">
          <div class="flex items-start justify-between mb-3">
            <div class="campaign-info">
              <h3 class="font-semibold text-slate-900">{{ campaign.name }}</h3>
              <p class="text-xs text-slate-500">{{ formatDate(campaign.created_at) }}</p>
            </div>
            <div class="status-badge" :class="campaign.status">
              {{ campaign.status }}
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-item">
              <span class="label">Recipients</span>
              <span class="value">{{ campaign.total_recipients }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Sent</span>
              <span class="value">{{ campaign.sent_count }}</span>
            </div>
            <div class="stat-item">
              <span class="label">Delivered</span>
              <span class="value text-emerald-600">{{ campaign.delivered_count }}</span>
            </div>
          </div>

          <div class="progress-bar-container mt-4">
            <div class="flex justify-between text-xs mb-1">
              <span class="text-slate-500">Delivery Rate</span>
              <span class="font-medium text-slate-700">{{ getDeliveryRate(campaign) }}%</span>
            </div>
            <div class="progress-bar">
              <div
                class="progress-fill"
                :style="{ width: getDeliveryRate(campaign) + '%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div v-else class="empty-state">
        <div class="empty-icon">
          <Send :size="48" />
        </div>
        <h3>No campaigns yet</h3>
        <p>Launch your first SMS campaign to reach your customers.</p>
        <NuxtLink to="/campaigns/new" class="btn-primary">
          Start New Campaign
        </NuxtLink>
      </div>
    </main>

    <!-- Bottom Navigation (Duplicate from dashboard for consistency) -->
    <nav class="bottom-nav">
      <NuxtLink to="/dashboard" class="nav-item">
        <Home :size="20" />
        <span>Home</span>
      </NuxtLink>
      <NuxtLink to="/contacts" class="nav-item">
        <Users :size="20" />
        <span>Contacts</span>
      </NuxtLink>
      <NuxtLink to="/campaigns" class="nav-item active">
        <Send :size="20" />
        <span>Campaigns</span>
      </NuxtLink>
      <NuxtLink to="/settings" class="nav-item">
        <Settings :size="20" />
        <span>Settings</span>
      </NuxtLink>
    </nav>
  </div>
</template>

<script setup lang="ts">
import { ChevronLeft, Plus, Send, Home, Users, Settings } from 'lucide-vue-next'

const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const campaigns = ref<any[]>([])

onMounted(async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  const { data } = await $supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })

  if (data) campaigns.value = data
})

function formatDate(dateStr: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(new Date(dateStr))
}

function getDeliveryRate(campaign: any) {
  if (!campaign.total_recipients) return 0
  return Math.round((campaign.delivered_count / campaign.total_recipients) * 100)
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

.btn-primary-sm {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 600;
  font-size: 0.875rem;
  border-radius: 0.75rem;
  text-decoration: none;
}

.campaigns-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.campaign-card {
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1.25rem;
  padding: 1.25rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.status-badge {
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
  padding: 0.25rem 0.625rem;
  border-radius: 2rem;
  letter-spacing: 0.025em;
}

.status-badge.completed { background: #D1FAE5; color: #065F46; }
.status-badge.sending { background: #FEF3C7; color: #92400E; }
.status-badge.draft { background: #F1F5F9; color: #475569; }
.status-badge.failed { background: #FEE2E2; color: #991B1B; }

.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  padding: 0.75rem 0;
  border-top: 1px solid #F1F5F9;
}

.stat-item {
  display: flex;
  flex-direction: column;
}

.stat-item .label {
  font-size: 0.65rem;
  color: #94A3B8;
  text-transform: uppercase;
  font-weight: 600;
}

.stat-item .value {
  font-size: 1.125rem;
  font-weight: 700;
  color: #1e293b;
}

.progress-bar {
  height: 6px;
  background: #F1F5F9;
  border-radius: 1rem;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #007AFF 0%, #5856D6 100%);
  border-radius: 1rem;
  transition: width 0.5s ease;
}

.empty-state {
  text-align: center;
  padding: 4rem 1rem;
  color: #64748b;
}

.empty-icon {
  width: 80px;
  height: 80px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: white;
  border: 1px solid #E2E8F0;
  color: #94A3B8;
  border-radius: 2rem;
  margin: 0 auto 1.5rem;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.875rem 2rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 600;
  border-radius: 1rem;
  text-decoration: none;
  margin-top: 1.5rem;
  box-shadow: 0 10px 15px -3px rgba(0, 122, 255, 0.2);
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0.75rem;
  background: white/90;
  backdrop-blur: 10px;
  border-top: 1px solid #E2E8F0;
  z-index: 50;
}

.nav-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  padding: 0.5rem;
  color: #64748b;
  text-decoration: none;
  font-size: 0.75rem;
  border-radius: 0.5rem;
}

.nav-item.active {
  color: #007AFF;
}
</style>