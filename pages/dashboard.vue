<template>
  <div class="min-h-screen">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
      <div class="max-w-lg mx-auto px-4 py-4 flex items-center justify-between">
        <div class="flex items-center gap-3">
          <div class="logo-icon-sm">
            <Zap :size="20" />
          </div>
          <div>
            <h1 class="text-lg font-semibold text-slate-900">167Call</h1>
            <p class="text-xs text-slate-500">Smart Sales</p>
          </div>
        </div>
        <div class="flex items-center gap-2">
          <NuxtLink to="/contacts" class="header-btn">
            <Users :size="20" />
          </NuxtLink>
          <button @click="handleLogout" class="header-btn">
            <LogOut :size="20" />
          </button>
        </div>
      </div>
    </header>

    <main class="max-w-lg mx-auto px-4 py-6">
      <!-- Stats Overview -->
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-icon contacts">
            <Users :size="20" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.totalContacts }}</span>
            <span class="stat-label">Contacts</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon sent">
            <Send :size="20" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.messagesSent }}</span>
            <span class="stat-label">Sent</span>
          </div>
        </div>
        <div class="stat-card">
          <div class="stat-icon delivered">
            <CheckCircle :size="20" />
          </div>
          <div class="stat-info">
            <span class="stat-value">{{ stats.delivered }}</span>
            <span class="stat-label">Delivered</span>
          </div>
        </div>
      </div>

      <!-- Quick Actions -->
      <section class="section">
        <h2 class="section-title">Quick Actions</h2>
        <div class="actions-grid">
          <NuxtLink to="/scanner" class="action-card">
            <ScanLine :size="24" />
            <span>Scan Card</span>
          </NuxtLink>
          <NuxtLink to="/contacts" class="action-card">
            <Upload :size="24" />
            <span>Import</span>
          </NuxtLink>
          <NuxtLink to="/campaigns/new" class="action-card primary">
            <Send :size="24" />
            <span>New Campaign</span>
          </NuxtLink>
        </div>
      </section>

      <!-- Recent Campaigns -->
      <section class="section">
        <div class="section-header">
          <h2 class="section-title">Recent Campaigns</h2>
          <NuxtLink to="/campaigns" class="view-all">View All</NuxtLink>
        </div>

        <div v-if="recentCampaigns.length > 0" class="campaigns-list">
          <div v-for="campaign in recentCampaigns" :key="campaign.id" class="campaign-card">
            <div class="campaign-status" :class="campaign.status">
              {{ campaign.status }}
            </div>
            <div class="campaign-info">
              <h3>{{ campaign.name }}</h3>
              <p>{{ campaign.recipients }} recipients · {{ campaign.sent }} sent</p>
            </div>
            <div class="campaign-rate">
              {{ campaign.deliveryRate }}%
            </div>
          </div>
        </div>

        <div v-else class="empty-state">
          <p>No campaigns yet. Create your first one!</p>
          <NuxtLink to="/campaigns/new" class="btn-primary">
            Create Campaign
          </NuxtLink>
        </div>
      </section>

      <!-- Device Status -->
      <section class="section">
        <h2 class="section-title">Gateway</h2>
        <div class="device-card">
          <div class="device-status" :class="deviceOnline ? 'online' : 'offline'">
            <div class="status-dot"></div>
            {{ deviceOnline ? 'Online' : 'Offline' }}
          </div>
          <div class="device-info">
            <span>{{ devicePhone || 'No device connected' }}</span>
            <span class="device-label">{{ deviceOnline ? 'Ready to send' : 'Connect device to send SMS' }}</span>
          </div>
          <button v-if="!deviceOnline" class="btn-secondary">
            Connect Device
          </button>
        </div>
      </section>
    </main>

    <!-- Bottom Navigation -->
    <nav class="bottom-nav">
      <NuxtLink to="/dashboard" class="nav-item active">
        <Home :size="20" />
        <span>Home</span>
      </NuxtLink>
      <NuxtLink to="/contacts" class="nav-item">
        <Users :size="20" />
        <span>Contacts</span>
      </NuxtLink>
      <NuxtLink to="/campaigns" class="nav-item">
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
import { Zap, Users, Send, CheckCircle, Upload, ScanLine, Home, Settings, LogOut } from 'lucide-vue-next'

const { $supabase } = useNuxtApp()
const user = useSupabaseUser()

const stats = reactive({
  totalContacts: 0,
  messagesSent: 0,
  delivered: 0
})

const recentCampaigns = ref<any[]>([])
const deviceOnline = ref(false)
const devicePhone = ref('')

onMounted(async () => {
  if (!user.value) {
    navigateTo('/login')
    return
  }

  const { data: contactsData } = await $supabase
    .from('contacts')
    .select('id', { count: 'exact' })
    .eq('user_id', user.value.id)
  
  if (contactsData) stats.totalContacts = contactsData.length

  const { data: campaignsData } = await $supabase
    .from('campaigns')
    .select('*')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false })
    .limit(5)
  
  if (campaignsData) {
    recentCampaigns.value = campaignsData.map(c => ({
      id: c.id,
      name: c.name,
      recipients: c.total_recipients,
      sent: c.sent_count,
      deliveryRate: c.total_recipients > 0 ? Math.round((c.delivered_count / c.total_recipients) * 100) : 0,
      status: c.status
    }))
    
    stats.messagesSent = campaignsData.reduce((sum, c) => sum + (c.sent_count || 0), 0)
    stats.delivered = campaignsData.reduce((sum, c) => sum + (c.delivered_count || 0), 0)
  }

  const { data: deviceData } = await $supabase
    .from('gateway_devices')
    .select('*')
    .eq('user_id', user.value.id)
    .eq('status', 'active')
    .maybeSingle()
  
  if (deviceData) {
    deviceOnline.value = true
    devicePhone.value = deviceData.phone_number
  }
})

async function handleLogout() {
  await $supabase.auth.signOut()
  navigateTo('/login')
}
</script>

<style scoped>
.logo-icon-sm {
  width: 40px;
  height: 40px;
  background: linear-gradient(135deg, #007AFF 0%, #5856D6 100%);
  border-radius: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
}

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

.stats-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
}

.stat-icon {
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 0.75rem;
}

.stat-icon.contacts {
  background: linear-gradient(135deg, #DBEAFE 0%, #BFDBFE 100%);
  color: #2563EB;
}

.stat-icon.sent {
  background: linear-gradient(135deg, #E0E7FF 0%, #C7D2FE 100%);
  color: #4F46E5;
}

.stat-icon.delivered {
  background: linear-gradient(135deg, #D1FAE5 0%, #A7F3D0 100%);
  color: #059669;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: #1e293b;
}

.stat-label {
  font-size: 0.75rem;
  color: #64748b;
}

.section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 1rem;
}

.section-header .section-title {
  margin-bottom: 0;
}

.view-all {
  font-size: 0.875rem;
  color: #007AFF;
  text-decoration: none;
}

.actions-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
}

.action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1.25rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
  font-size: 0.875rem;
  font-weight: 500;
  color: #475569;
  text-decoration: none;
  transition: all 0.2s;
}

.action-card:hover {
  border-color: #CBD5E1;
  transform: translateY(-2px);
}

.action-card.primary {
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  border: none;
  color: white;
}

.campaigns-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.campaign-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
}

.campaign-status {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.5rem;
  border-radius: 0.5rem;
  text-transform: capitalize;
}

.campaign-status.completed {
  background: #D1FAE5;
  color: #059669;
}

.campaign-status.sending {
  background: #FEF3C7;
  color: #D97706;
}

.campaign-status.draft {
  background: #F1F5F9;
  color: #64748b;
}

.campaign-info {
  flex: 1;
}

.campaign-info h3 {
  font-weight: 600;
  color: #1e293b;
}

.campaign-info p {
  font-size: 0.875rem;
  color: #64748b;
}

.campaign-rate {
  font-size: 1.25rem;
  font-weight: 700;
  color: #059669;
}

.empty-state {
  text-align: center;
  padding: 2rem;
  color: #64748b;
}

.btn-primary {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1.5rem;
  background: linear-gradient(135deg, #007AFF 0%, #0051E6 100%);
  color: white;
  font-weight: 600;
  border-radius: 0.75rem;
  text-decoration: none;
  margin-top: 1rem;
}

.device-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem;
  background: white;
  border: 1px solid #E2E8F0;
  border-radius: 1rem;
}

.device-status {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.875rem;
  font-weight: 600;
}

.device-status.online {
  color: #059669;
}

.device-status.offline {
  color: #DC2626;
}

.status-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: currentColor;
}

.device-info {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.device-label {
  font-size: 0.75rem;
  color: #64748b;
}

.btn-secondary {
  padding: 0.5rem 1rem;
  background: #F1F5F9;
  color: #475569;
  font-size: 0.875rem;
  font-weight: 500;
  border-radius: 0.5rem;
  border: none;
  cursor: pointer;
}

.bottom-nav {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-around;
  padding: 0.75rem;
  background: white;
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
  transition: all 0.2s;
}

.nav-item.active {
  color: #007AFF;
}
</style>