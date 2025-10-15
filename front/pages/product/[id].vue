<template>
  <div class="container-custom py-8">
    <!-- Loading state -->
    <div v-if="loading" class="text-center py-12">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
      <p class="mt-4 text-gray-600">Cargando producto...</p>
    </div>

    <!-- Error state -->
    <div v-else-if="error" class="text-center py-12">
      <p class="text-red-600 mb-4">{{ error }}</p>
      <NuxtLink to="/" class="btn-primary inline-block">
        Volver al Catálogo
      </NuxtLink>
    </div>

    <!-- Producto -->
    <div v-else-if="product" class="max-w-6xl mx-auto">
      <!-- Breadcrumb -->
      <nav class="flex items-center space-x-2 text-sm text-gray-600 mb-6">
        <NuxtLink to="/" class="hover:text-orange-600 transition-colors">
          Inicio
        </NuxtLink>
        <span>/</span>
        <span class="text-gray-900 font-medium">{{ product.name }}</span>
      </nav>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <!-- Columna izquierda - Imagen -->
        <div class="space-y-6">
          <div class="card overflow-hidden">
            <div class="aspect-square bg-gray-100 flex items-center justify-center">
              <img
                v-if="product.image"
                :src="product.image"
                :alt="product.name"
                class="w-full h-full object-cover"
              />
              <div v-else class="text-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p class="text-gray-500">Sin imagen</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Columna derecha - Información y configuración -->
        <div class="space-y-6">
          <!-- Título y precio -->
          <div>
            <h1 class="text-3xl md:text-4xl font-display font-bold text-gray-900 mb-3">
              {{ product.name }}
            </h1>
            <div class="flex items-baseline space-x-3 mb-4">
              <span class="text-4xl font-bold text-orange-600">
                {{ product.price.toFixed(2) }}€
              </span>
            </div>
            <p v-if="product.description" class="text-gray-600 leading-relaxed">
              {{ product.description }}
            </p>
          </div>

          <!-- Configuración del producto -->
          <div class="card p-6 bg-gray-50">
            <h2 class="text-xl font-display font-bold text-gray-900 mb-4">
              Configurar Producto
            </h2>
            <ProductOptions
              :product="product"
              @add-to-cart="handleAddToCart"
              @show-size-guide="showSizeGuide = true"
            />
          </div>

          <!-- Información adicional -->
          <div class="border-t border-gray-200 pt-6 space-y-4">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">Pago por Transferencia</p>
                <p class="text-sm text-gray-600">Sube el comprobante para realizar el pedido</p>
              </div>
            </div>
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p class="font-semibold text-gray-900">Recogida en el Club</p>
                <p class="text-sm text-gray-600">Te avisaremos cuando esté listo</p>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de guía de tallas -->
    <SizeGuideModal
      :is-open="showSizeGuide"
      @close="showSizeGuide = false"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import type { Product } from '~/types';
import { useSupabase } from '~/composables/useSupabase';

const route = useRoute();
const router = useRouter();
const { getProductById } = useSupabase();

const product = ref<Product | null>(null);
const loading = ref(true);
const error = ref('');
const showSizeGuide = ref(false);

// Productos de ejemplo (mismos que en index.vue)
const getExampleProducts = (): Product[] => {
  return [
    {
      id: '1',
      name: 'Sudadera Club 40 Aniversario',
      price: 35.00,
      description: 'Sudadera conmemorativa del 40 aniversario del club. Diseño exclusivo con los colores corporativos y el logo del club.',
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
      description: 'Pantalón oficial del club para entrenamientos. Tejido transpirable y cómodo para la práctica deportiva.',
      options: {
        hasTalla: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
      },
    },
    {
      id: '3',
      name: 'Camiseta de Juego Blanca',
      price: 30.00,
      description: 'Camiseta oficial de juego color blanco. Incluye la opción de personalizar con número y nombre del jugador.',
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
      description: 'Camiseta oficial de juego color negro. Incluye la opción de personalizar con número y nombre del jugador.',
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
      description: 'Camiseta de calentamiento oficial del club. Ideal para antes y después de los partidos.',
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
      description: 'Mochila oficial del Club Voleibol Valencia. Amplio espacio para todo tu equipo deportivo.',
      options: {},
    },
  ];
};

const loadProduct = async () => {
  loading.value = true;
  error.value = '';
  
  const productId = route.params.id as string;
  
  try {
    // Intentar cargar desde PocketBase
    const fetchedProduct = await getProductById(productId);
    
    if (fetchedProduct) {
      product.value = fetchedProduct;
    } else {
      // Si no hay en PocketBase, buscar en productos de ejemplo
      const exampleProducts = getExampleProducts();
      const foundProduct = exampleProducts.find(p => p.id === productId);
      
      if (foundProduct) {
        product.value = foundProduct;
      } else {
        error.value = 'Producto no encontrado';
      }
    }
  } catch (e) {
    console.error('Error loading product:', e);
    // En caso de error, buscar en productos de ejemplo
    const exampleProducts = getExampleProducts();
    const foundProduct = exampleProducts.find(p => p.id === productId);
    
    if (foundProduct) {
      product.value = foundProduct;
    } else {
      error.value = 'Producto no encontrado';
    }
  } finally {
    loading.value = false;
  }
};

const handleAddToCart = () => {
  // El componente ProductOptions ya maneja añadir al carrito
  // Mostrar mensaje de éxito
  setTimeout(() => {
    router.push('/cart');
  }, 500);
};

onMounted(() => {
  loadProduct();
});
</script>
