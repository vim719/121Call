export type Confidence = 'high' | 'medium' | 'low'

export type Contact = {
  id: string
  name: string
  phone: string
  interest?: string
  source: 'scan' | 'csv' | 'manual' | 'demo' | 'ocr'
  createdAt: string
}

export type OcrCandidate = {
  id: string
  raw: string
  normalized: string
  context: string
  score: number
  confidence: Confidence
  inferredName?: string
  suspicion?: string
  selected: boolean
}

export type SmsPreview = {
  contactId: string
  firstName: string
  phone: string
  message: string
}

export type SmsDispatchResult = {
  contactId: string
  phone: string
  recipient: string
  message: string
  status: string
  mode: 'live' | 'demo'
  providerId: string | null
  scheduledAt: string
  failureReason?: string
}

export type GatewayStatus = {
  mode: 'live' | 'demo'
  configured: boolean
  from: string
  baseUrl: string
  ratePerMinute: number
  heartbeat: string
}