<template>
  <div class="container-custom py-12">
    <!-- Header -->
    <div class="mb-12 text-center">
      <h1 class="text-5xl font-display font-bold text-gray-900 mb-3">
        Tienda Oficial
      </h1>
      <p class="text-lg text-gray-600">
        Compra la ropa oficial del Club Voleibol Valencia
      </p>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      <p class="mt-4 text-gray-600">Cargando productos...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600">{{ error }}</p>
      <button @click="loadProducts" class="btn-primary mt-4">
        Reintentar
      </button>
    </div>

    <!-- Productos -->
    <div v-else-if="products.length > 0" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
      <ProductCard
        v-for="product in products"
        :key="product.id"
        :product="product"
      />
    </div>

    <!-- No hay productos -->
    <div v-else class="text-center py-12">
      <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
      </svg>
      <p class="text-gray-600">No hay productos disponibles en este momento</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { Product } from '~/types';
import { useSupabase } from '~/composables/useSupabase';

const { getProducts } = useSupabase();

const products = ref<Product[]>([]);
const loading = ref(true);
const error = ref('');

const loadProducts = async () => {
  loading.value = true;
  error.value = '';
  
  try {
    const fetchedProducts = await getProducts();
    
    if (fetchedProducts.length === 0) {
      // Productos de ejemplo para desarrollo
      products.value = getExampleProducts();
    } else {
      products.value = fetchedProducts;
    }
  } catch (e: any) {
    console.error('Error loading products:', e);
    // En caso de error, usar productos de ejemplo
    products.value = getExampleProducts();
  } finally {
    loading.value = false;
  }
};

// Productos de ejemplo para desarrollo
const getExampleProducts = (): Product[] => {
  return [
    {
      id: '1',
      name: 'Sudadera Club 40 Aniversario',
      price: 35.00,
      description: 'Sudadera conmemorativa del 40 aniversario del club',
      options: {
        hasTalla: true,
        hasGenero: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
        generos: ['Chico', 'Chica'],
      },
    },
    {
      id: '2',
      name: 'Pantalón de Chándal Club',
      price: 25.00,
      description: 'Pantalón oficial del club para entrenamientos',
      options: {
        hasTalla: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
      },
    },
    {
      id: '3',
      name: 'Camiseta de Juego Blanca',
      price: 30.00,
      description: 'Camiseta oficial de juego color blanco',
      options: {
        hasTalla: true,
        hasGenero: true,
        hasNumero: true,
        hasNombre: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
        generos: ['Chico', 'Chica'],
      },
    },
    {
      id: '4',
      name: 'Camiseta de Juego Negra',
      price: 30.00,
      description: 'Camiseta oficial de juego color negro',
      options: {
        hasTalla: true,
        hasGenero: true,
        hasNumero: true,
        hasNombre: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
        generos: ['Chico', 'Chica'],
      },
    },
    {
      id: '5',
      name: 'Camiseta de Calentamiento',
      price: 22.00,
      description: 'Camiseta de calentamiento oficial del club',
      options: {
        hasTalla: true,
        hasGenero: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
        generos: ['Chico', 'Chica'],
      },
    },
    {
      id: '6',
      name: 'Mochila Club',
      price: 20.00,
      description: 'Mochila oficial del Club Voleibol Valencia',
      options: {},
    },
  ];
};

onMounted(() => {
  loadProducts();
});
</script>
