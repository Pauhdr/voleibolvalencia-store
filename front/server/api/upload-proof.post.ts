import { createError, defineEventHandler, readFormData } from 'h3'

export default defineEventHandler(async (event) => {
  const formData = await readFormData(event)
  const file = formData.get('file')

  if (!(file instanceof File)) {
    throw createError({ statusCode: 400, message: 'Adjunta un comprobante en formato imagen o PDF.' })
  }

  await new Promise((resolve) => setTimeout(resolve, 600))

  return {
    success: true,
    fileName: file.name,
    size: file.size,
    type: file.type
  }
})
