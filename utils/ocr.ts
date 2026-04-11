// OCR Phone Extraction - Proven from 121Call
import { parsePhoneNumberFromString } from 'libphonenumber-js'

export interface OcrCandidate {
  id: string
  raw: string
  normalized: string
  context: string
  score: number
  confidence: 'high' | 'medium' | 'low'
  inferredName?: string
  suspicion?: string
  selected: boolean
}

const PHONE_PATTERNS = [
  { pattern: /\+?1?[-.\s]*(?:\(\d{3}\)|\d{3})[-.\s]*\d{3}[-.\s]*\d{4}/g, kind: 'full' as const },
  { pattern: /\b\d{10}\b/g, kind: 'full' as const },
  { pattern: /(?<![\d(])\d{3}[-.\s]\d{4}(?!\d)/g, kind: 'local' as const },
]

const TOLL_FREE = ['800', '833', '844', '855', '866', '877', '888']

function normalizeWhitespace(value: string) {
  return value.replace(/\s+/g, ' ').trim()
}

function isSequential(digits: string) {
  return '01234567890'.includes(digits) || '09876543210'.includes(digits) || /^(\d)\1{6,}$/.test(digits)
}

function isTollFreePhone(areaCode: string) {
  return TOLL_FREE.includes(areaCode)
}

function inferNameFromContext(context: string) {
  const tokens = normalizeWhitespace(context).split(' ').filter(Boolean).slice(-4)
  const candidates = tokens.filter((token) => /^[A-Za-z][A-Za-z'-]{1,}$/.test(token))
  return candidates.length ? candidates[candidates.length - 1] : undefined
}

function scorePhone(digits: string, context: string, isValid: boolean) {
  const areaCode = digits.slice(-10, -7)
  let score = isValid ? 30 : 0
  if (digits.length === 10 || digits.length === 11) score += 25
  if (isValid && areaCode) score += 30
  if (/(ph|cell|call|text|contact|name)[:\s]/i.test(context)) score += 20
  if (isTollFreePhone(areaCode)) score -= 20
  if (isSequential(digits.slice(-10))) score -= 40
  if (!/[A-Za-z]/.test(context)) score -= 10
  return score
}

function confidenceFromScore(score: number): 'high' | 'medium' | 'low' {
  if (score >= 80) return 'high'
  if (score >= 55) return 'medium'
  return 'low'
}

export function extractPhoneCandidates(text: string, defaultAreaCode = '212'): OcrCandidate[] {
  const candidates = new Map<string, OcrCandidate>()
  const matchedRanges: Array<{ start: number; end: number }> = []

  for (const { pattern, kind } of PHONE_PATTERNS) {
    for (const match of text.matchAll(pattern)) {
      const raw = match[0]
      const index = match.index ?? 0
      const rangeEnd = index + raw.length

      if (kind === 'local' && matchedRanges.some((range) => index >= range.start && rangeEnd <= range.end)) {
        continue
      }

      const start = Math.max(0, index - 26)
      const end = Math.min(text.length, index + raw.length + 28)
      const context = normalizeWhitespace(text.slice(start, end))

      let digits = raw.replace(/\D/g, '')
      const missingAreaCode = digits.length === 7

      if (missingAreaCode) digits = `${defaultAreaCode}${digits}`
      if (digits.length === 11 && digits.startsWith('1')) digits = digits.slice(1)

      const parsed = parsePhoneNumberFromString(digits, 'US')
      const normalized = parsed?.isValid() ? parsed.number : `+1${digits.slice(-10)}`
      const score = scorePhone(digits, context, parsed?.isValid() ?? false)
      const confidence = confidenceFromScore(score)
      const suspicion = isSequential(digits.slice(-10))
        ? 'looks fake'
        : isTollFreePhone(digits.slice(-10, -7))
          ? 'business number'
          : missingAreaCode
            ? 'missing area code'
            : undefined

      if (!candidates.has(normalized)) {
        candidates.set(normalized, {
          id: crypto.randomUUID(),
          raw,
          normalized,
          context,
          score,
          confidence,
          inferredName: inferNameFromContext(context),
          suspicion,
          selected: confidence !== 'low',
        })
      }

      matchedRanges.push({ start: index, end: rangeEnd })
    }
  }

  return [...candidates.values()].sort((left, right) => right.score - left.score)
}

export function formatPhoneLabel(phone: string) {
  const digits = phone.replace(/\D/g, '').slice(-10)
  if (digits.length !== 10) return phone
  return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`
}