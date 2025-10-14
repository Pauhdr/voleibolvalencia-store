<template>
  <div class="card hover:shadow-xl transition-shadow duration-300">
    <!-- Imagen del producto -->
    <div class="relative aspect-square bg-gray-100">
      <img
        v-if="product.image"
        :src="product.image"
        :alt="product.name"
        class="w-full h-full object-cover"
      />
      <div v-else class="w-full h-full flex items-center justify-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
      </div>
      
      <!-- Badge de precio -->
      <div class="absolute top-3 right-3 bg-orange-600 text-white px-3 py-1 rounded-full font-bold text-lg shadow-lg">
        {{ product.price.toFixed(2) }}€
      </div>
    </div>

    <!-- Contenido -->
    <div class="p-5">
      <h3 class="font-display font-bold text-lg text-gray-900 mb-2">
        {{ product.name }}
      </h3>
      
      <p v-if="product.description" class="text-gray-600 text-sm mb-4">
        {{ product.description }}
      </p>

      <!-- Opciones del producto -->
      <ProductOptions
        :product="product"
        @add-to-cart="handleAddToCart"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '~/types';

interface Props {
  product: Product;
}

defineProps<Props>();

const handleAddToCart = (item: any) => {
  // Emitir evento al padre si es necesario
};
</script>
