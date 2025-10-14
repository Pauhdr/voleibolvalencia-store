<template>
  <div class="container-custom py-8">
    <div class="max-w-4xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">
          Tu Carrito
        </h1>
        <p class="text-gray-600">
          Revisa tu pedido antes de finalizar la compra
        </p>
      </div>

      <!-- Carrito vacío -->
      <div v-if="cartStore.isEmpty" class="text-center py-16">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-24 w-24 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
        </svg>
        <h2 class="text-2xl font-bold text-gray-900 mb-2">Tu carrito está vacío</h2>
        <p class="text-gray-600 mb-6">Añade productos para comenzar tu pedido</p>
        <NuxtLink to="/" class="btn-primary inline-block">
          Ver Productos
        </NuxtLink>
      </div>

      <!-- Carrito con productos -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Items del carrito -->
        <div class="lg:col-span-2 space-y-4">
          <CartItem
            v-for="(item, index) in cartStore.items"
            :key="index"
            :item="item"
            :index="index"
            @update-quantity="updateQuantity"
            @remove="removeItem"
          />
        </div>

        <!-- Resumen del pedido -->
        <div class="lg:col-span-1">
          <div class="card sticky top-24">
            <div class="p-6">
              <h3 class="text-xl font-display font-bold text-gray-900 mb-4">
                Resumen del Pedido
              </h3>

              <div class="space-y-3 mb-6">
                <div class="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span class="font-semibold">{{ cartStore.subtotal.toFixed(2) }}€</span>
                </div>
                <div class="flex justify-between text-gray-600">
                  <span>Envío</span>
                  <span class="font-semibold">Recogida en club</span>
                </div>
                <div class="border-t border-gray-200 pt-3 flex justify-between text-lg font-bold text-gray-900">
                  <span>Total</span>
                  <span class="text-orange-600">{{ cartStore.total.toFixed(2) }}€</span>
                </div>
              </div>

              <NuxtLink to="/checkout" class="btn-primary w-full block text-center">
                Finalizar Pedido
              </NuxtLink>

              <!-- <button
                @click="clearCart"
                class="w-full mt-3 text-red-600 hover:text-red-700 font-medium py-2 transition-colors"
              >
                Vaciar Carrito
              </button> -->
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

const updateQuantity = (index: number, quantity: number) => {
  cartStore.updateItemQuantity(index, quantity);
};

const removeItem = (index: number) => {
  if (confirm('¿Estás seguro de que quieres eliminar este producto?')) {
    cartStore.removeItem(index);
  }
};

const clearCart = () => {
  if (confirm('¿Estás seguro de que quieres vaciar el carrito?')) {
    cartStore.clearCart();
  }
};
</script>
