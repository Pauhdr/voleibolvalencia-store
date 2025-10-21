import { H3Event, createError, defineEventHandler, readBody } from 'h3'
import type { OrderPayload } from '../../types'

function validateEmail(email: string) {
  return /\S+@\S+\.\S+/.test(email)
}

function ensureBuyer(payload: OrderPayload['buyer']) {
  if (!payload.playerName?.trim()) {
    throw createError({ statusCode: 400, message: 'El nombre del jugador es obligatorio.' })
  }

  if (!payload.team?.trim()) {
    throw createError({ statusCode: 400, message: 'Selecciona el equipo del jugador.' })
  }

  if (!payload.guardianName?.trim()) {
    throw createError({ statusCode: 400, message: 'Incluye el nombre del padre o madre.' })
  }

  if (!validateEmail(payload.email)) {
    throw createError({ statusCode: 400, message: 'El email indicado no es válido.' })
  }
}

function ensureItems(items: OrderPayload['items']) {
  if (!items?.length) {
    throw createError({ statusCode: 400, message: 'Añade al menos un producto al carrito.' })
  }
}

function ensureTransfer(reference: string) {
  if (!reference?.trim()) {
    throw createError({ statusCode: 400, message: 'Añade la referencia de tu transferencia bancaria.' })
  }
}

async function parseBody(event: H3Event) {
  const payload = await readBody<OrderPayload>(event)

  ensureBuyer(payload.buyer)
  ensureItems(payload.items)
  ensureTransfer(payload.transferReference)

  return payload
}

export default defineEventHandler(async (event) => {
  const payload = await parseBody(event)

  const orderId = `VV-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`

  await new Promise((resolve) => setTimeout(resolve, 800))

  return {
    success: true,
    orderId,
    payload
  }
})
