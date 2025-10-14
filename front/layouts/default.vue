<template>
  <div class="min-h-screen flex flex-col bg-gray-50">
    <!-- Header -->
    <header class="bg-white shadow-md sticky top-0 z-50">
      <nav class="container-custom py-4">
        <div class="flex items-center justify-between">
          <!-- Logo y título -->
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="w-12 h-12 rounded-full flex items-center justify-center">
              <!-- <span class="text-white font-bold text-xl">VV</span> -->
               <img src="../assets/img/logo.png" alt="cvv logo" class="rounded-full object-fill">
            </div>
            <div>
              <h1 class="text-xl font-display font-bold text-gray-900">CV Valencia</h1>
              <p class="text-xs text-gray-600">Tienda Oficial</p>
            </div>
          </NuxtLink>

          <!-- Navegación -->
          <div class="flex items-center space-x-6">
            <NuxtLink
              to="/"
              class="text-gray-700 hover:text-orange-600 font-medium transition-colors"
            >
              Productos
            </NuxtLink>
            <NuxtLink
              to="/cart"
              class="relative text-gray-700 hover:text-orange-600 font-medium transition-colors flex items-center space-x-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span v-if="cartStore.itemCount > 0" class="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {{ cartStore.itemCount }}
              </span>
            </NuxtLink>
          </div>
        </div>
      </nav>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-900 text-white py-8 mt-12">
      <div class="container-custom">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Info del club -->
          <div>
            <h3 class="font-display font-bold text-lg mb-3">Voleibol Valencia</h3>
            <p class="text-gray-400 text-sm">
              Club deportivo dedicado al voleibol desde hace 40 años.
            </p>
          </div>

          <!-- Datos bancarios -->
          <!-- <div>
            <h3 class="font-display font-bold text-lg mb-3">Datos de Transferencia</h3>
            <p class="text-gray-400 text-sm">
              <strong class="text-white">IBAN:</strong> ES12 3456 7890 1234 5678 9012
            </p>
            <p class="text-gray-400 text-sm mt-1">
              <strong class="text-white">Concepto:</strong> Nombre del jugador + Equipo
            </p>
          </div> -->

          <!-- Contacto -->
          <div>
            <h3 class="font-display font-bold text-lg mb-3">Contacto</h3>
            <p class="text-gray-400 text-sm">
              Email: tienda@voleibolvalencia.com
            </p>
            <p class="text-gray-400 text-sm mt-1">
              Tel: 963 XXX XXX
            </p>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {{ new Date().getFullYear() }} Voleibol Valencia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

// Cargar datos del carrito desde localStorage al montar
onMounted(() => {
  cartStore.loadFromLocalStorage();
});
</script>
