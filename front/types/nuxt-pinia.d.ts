import '@pinia/nuxt'

declare module 'nuxt/schema' {
  interface PiniaModuleOptions {
    autoImports?: Array<string | [string, string?]>
  }

  interface NuxtConfig {
    pinia?: PiniaModuleOptions
  }

  interface NuxtOptions {
    pinia?: PiniaModuleOptions
  }
}

export {}
