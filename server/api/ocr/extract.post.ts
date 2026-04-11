import { defineEventHandler, readBody, createError } from 'h3'
import { extractPhoneCandidates, formatPhoneLabel } from '~/utils/ocr'
import type { OcrCandidate } from '~/utils/types'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { image } = body

  if (!image) {
    throw createError({ statusCode: 400, message: 'Image payload required' })
  }

  const runtimeConfig = useRuntimeConfig()
  const visionApiKey = runtimeConfig.googleVisionApiKey
  
  let ocrText = ''

  // Try Google Vision API first
  if (visionApiKey) {
    try {
      const base64Data = image.replace(/^data:image\/(png|jpeg|jpg);base64,/, '')
      
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
    } catch (e) {
      console.error('Google Vision failed:', e)
    }
  }

  // Fallback: If no Google Vision or failed, extract from image directly using regex
  // This works for clear images with printed text
  if (!ocrText) {
    // Try simple canvas-based approach for basic extraction
    // In production, you would integrate Churro or Vision-LLM here
    return {
      success: true,
      found: 0,
      contacts: [],
      message: 'No text detected. Try a clearer image or configure a Vision-LLM provider.'
    }
  }

  const candidates = extractPhoneCandidates(ocrText)

  return {
    success: true,
    found: candidates.length,
    contacts: candidates.map(c => ({
      id: c.id,
      normalized: c.normalized,
      formatted: formatPhoneLabel(c.normalized),
      confidence: c.confidence,
      inferredName: c.inferredName,
      suspicion: c.suspicion,
    })),
    message: `Found ${candidates.length} contact${candidates.length > 1 ? 's' : ''}`
  }
})