<template>
  <NuxtLink 
    :to="`/product/${product.id}`"
    class="group block"
  >
    <article class="relative overflow-hidden rounded-2xl bg-white border border-gray-200 transition-all duration-300 hover:border-orange-300">
      <!-- Imagen del producto -->
      <div class="aspect-square overflow-hidden bg-gray-100">
        <img
          v-if="product.image"
          :src="product.image"
          :alt="product.name"
          class="h-full w-full object-cover transition-opacity duration-300 group-hover:opacity-90"
        />
        <div
          v-else
          class="flex h-full w-full items-center justify-center bg-gradient-to-br from-orange-50 to-orange-100"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-20 w-20 text-orange-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="1.5"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <!-- Contenido -->
      <div class="p-5">
        <!-- Nombre del producto -->
        <h3 class="text-lg font-semibold text-gray-900 mb-2 line-clamp-2 min-h-[3.5rem] transition-colors">
          {{ product.name }}
        </h3>

        <!-- Precio -->
        <div class="flex items-baseline justify-between">
          <p class="text-2xl font-bold">
            {{ product.price.toFixed(2) }}€
          </p>
          
          <!-- Icono de flecha -->
          <div class="flex items-center justify-center w-8 h-8 rounded-full bg-orange-50 text-orange-600 transition-all group-hover:bg-orange-600 group-hover:text-white">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </div>
        </div>
      </div>
    </article>
  </NuxtLink>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

defineProps<{
  product: Product;
}>();
</script>
