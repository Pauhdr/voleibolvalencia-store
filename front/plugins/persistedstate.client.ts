import { defineNuxtPlugin } from 'nuxt/app'
import type { Pinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'

export default defineNuxtPlugin((nuxtApp) => {
  const pinia = nuxtApp.$pinia as Pinia | undefined

  if (pinia) {
    pinia.use(piniaPluginPersistedstate)
  }
})
