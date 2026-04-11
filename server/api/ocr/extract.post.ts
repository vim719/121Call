import { defineEventHandler, readBody, createError } from 'h3'
import { extractPhoneCandidates, formatPhoneLabel } from '~/utils/ocr'
import Tesseract from 'tesseract.js'

/**
 * OCR Extract Handler
 * 1. Attempts Google Vision OCR
 * 2. If Google Vision fails or is not configured, falls back to "Churro" logic
 *    (For this implementation, "Churro" uses Tesseract.js for local OCR)
 */
export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { image } = body

  if (!image) {
    throw createError({ statusCode: 400, message: 'Image payload required' })
  }

  const runtimeConfig = useRuntimeConfig()
  const visionApiKey = runtimeConfig.googleVisionApiKey
  const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
  
  let ocrText = ''
  let source = 'unknown'

  // 1. Try Google Vision API
  if (visionApiKey) {
    try {
      const visionRes = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${visionApiKey}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            requests: [{
              image: { content: base64Data },
              features: [{ type: 'DOCUMENT_TEXT_DETECTION' }]
            }]
          })
        }
      )

      const visionData = await visionRes.json()
      ocrText = visionData.responses?.[0]?.fullTextAnnotation?.text || ''
      if (ocrText) source = 'google-vision'
    } catch (e) {
      console.error('Google Vision failed, falling back to Churro:', e)
    }
  }

  // 2. Fallback: Churro Implementation (Tesseract.js)
  if (!ocrText) {
    source = 'churro'
    try {
      const buffer = Buffer.from(base64Data, 'base64')
      const { data: { text } } = await Tesseract.recognize(buffer, 'eng')
      ocrText = text
    } catch (e) {
      console.error('Churro (Tesseract) failed:', e)
    }
  }

  const candidates = extractPhoneCandidates(ocrText)

  return {
    success: true,
    found: candidates.length,
    source,
    contacts: candidates.map(c => ({
      id: c.id,
      normalized: c.normalized,
      formatted: formatPhoneLabel(c.normalized),
      confidence: c.confidence,
      inferredName: c.inferredName || 'New Contact',
      suspicion: c.suspicion,
    })),
    message: candidates.length > 0
      ? `Successfully extracted ${candidates.length} contacts via ${source}`
      : `No contacts found via ${source}. Try a clearer image.`
  }
})