// SMS Gateway - Proven from 121Call
import type { Contact, SmsPreview, SmsDispatchResult } from './types'

type SmsPreviewOptions = {
  contacts: Contact[]
  template: string
  shopName: string
  neighborhood: string
}

export function personalizeMessage(
  template: string,
  contact: Contact,
  context: { shopName: string; neighborhood: string },
) {
  const replacements: Record<string, string> = {
      '{{firstName}}': contact.name || 'there',
      '{{interest}}': contact.interest || 'our latest arrivals',
      '{{shopName}}': context.shopName,
      '{{neighborhood}}': context.neighborhood,
      '{{today}}': new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(new Date()),
    }

  let message = template
  for (const [token, value] of Object.entries(replacements)) {
    message = message.replaceAll(token, value)
  }

  return message.replace(/\s+/g, ' ').trim()
}

export function estimateSmsSegments(message: string) {
  return Math.max(1, Math.ceil(message.length / 160))
}

export function buildSmsPreviews({
  contacts,
  template,
  shopName,
  neighborhood,
}: SmsPreviewOptions): SmsPreview[] {
  return contacts.map((contact) => ({
    contactId: contact.id,
    firstName: contact.name,
    phone: contact.phone,
    message: personalizeMessage(template, contact, { shopName, neighborhood }),
  }))
}

export async function sendSmsBatch(
  previews: SmsPreview[],
  ratePerMinute: number,
  config: { apiKey: string; fromNumber: string; baseUrl?: string },
): Promise<SmsDispatchResult[]> {
  const stepMs = Math.ceil(60000 / Math.max(ratePerMinute, 1))
  const results: SmsDispatchResult[] = []

  for (let i = 0; i < previews.length; i++) {
    const preview = previews[i]
    
    try {
      const response = await fetch(config.baseUrl || 'https://api.httpsms.com/v1/messages/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.apiKey,
        },
        body: JSON.stringify({
          content: preview.message,
          encrypted: false,
          from: config.fromNumber,
          request_id: preview.contactId,
          send_at: new Date(Date.now() + i * stepMs).toISOString(),
          to: preview.phone,
        }),
      })

      const data = await response.json()
      
      results.push({
        contactId: preview.contactId,
        phone: preview.phone,
        recipient: preview.firstName,
        message: preview.message,
        status: data.status || 'queued',
        mode: 'live',
        providerId: data.id,
        scheduledAt: data.scheduled_send_time || data.created_at,
      })
    } catch (error) {
      results.push({
        contactId: preview.contactId,
        phone: preview.phone,
        recipient: preview.firstName,
        message: preview.message,
        status: 'failed',
        mode: 'live',
        providerId: null,
        scheduledAt: new Date().toISOString(),
        failureReason: error instanceof Error ? error.message : 'Gateway request failed',
      })
    }

    if (i < previews.length - 1) {
      await new Promise(resolve => setTimeout(resolve, stepMs))
    }
  }

  return results
}

export function buildDemoResults(
  previews: SmsPreview[],
  ratePerMinute: number,
): SmsDispatchResult[] {
  return previews.map((preview, index) => ({
    contactId: preview.contactId,
    phone: preview.phone,
    recipient: preview.firstName,
    message: preview.message,
    status: 'queued',
    mode: 'demo',
    providerId: `demo-${index + 1}`,
    scheduledAt: new Date(Date.now() + index * Math.ceil(60000 / ratePerMinute)).toISOString(),
  }))
}