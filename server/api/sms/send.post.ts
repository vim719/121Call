import { defineEventHandler, readBody, createError } from 'h3'
import { buildSmsPreviews, buildDemoResults } from '~/utils/sms'
import type { Contact } from '~/utils/types'

type SmsDispatchPayload = {
  contacts: Contact[]
  template: string
  shopName: string
  neighborhood: string
  campaignTitle: string
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event) as SmsDispatchPayload

  if (!body.contacts?.length || !body.template?.trim()) {
    throw createError({ statusCode: 400, message: 'Template and at least one contact required' })
  }

  const runtimeConfig = useRuntimeConfig()
  const ratePerMinute = 3
  const httpsmsApiKey = runtimeConfig.httpsmsApiKey
  const httpsmsFrom = '+18559229159' // User needs to configure this

  const previews = buildSmsPreviews({
    contacts: body.contacts,
    template: body.template,
    shopName: body.shopName,
    neighborhood: body.neighborhood,
  })

  // If no API key, run in demo mode
  if (!httpsmsApiKey) {
    return {
      batchId: crypto.randomUUID(),
      mode: 'demo',
      campaignTitle: body.campaignTitle,
      sentAt: new Date().toISOString(),
      ratePerMinute,
      results: buildDemoResults(previews, ratePerMinute),
    }
  }

  // Live mode - send via httpSMS
  const results = await Promise.all(
    previews.map(async (preview, index) => {
      try {
        const response = await fetch('https://api.httpsms.com/v1/messages/send', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'x-api-key': httpsmsApiKey,
          },
          body: JSON.stringify({
            content: preview.message,
            encrypted: false,
            from: httpsmsFrom,
            request_id: preview.contactId,
            send_at: new Date(Date.now() + index * Math.ceil(60000 / ratePerMinute)).toISOString(),
            to: preview.phone,
          }),
        })

        const data = await response.json()

        return {
          contactId: preview.contactId,
          phone: preview.phone,
          recipient: preview.firstName,
          message: preview.message,
          status: data.status || 'queued',
          mode: 'live' as const,
          providerId: data.id,
          scheduledAt: data.scheduled_send_time || data.created_at,
        }
      } catch (error) {
        return {
          contactId: preview.contactId,
          phone: preview.phone,
          recipient: preview.firstName,
          message: preview.message,
          status: 'failed',
          mode: 'live' as const,
          providerId: null,
          scheduledAt: new Date().toISOString(),
          failureReason: error instanceof Error ? error.message : 'Gateway request failed',
        }
      }
    })
  )

  return {
    batchId: crypto.randomUUID(),
    mode: 'live',
    campaignTitle: body.campaignTitle,
    sentAt: new Date().toISOString(),
    ratePerMinute,
    summary: {
      total: results.length,
      failed: results.filter(r => r.status === 'failed').length,
    },
    results,
  }
})