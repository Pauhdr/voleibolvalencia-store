<template>
  <div class="p-4">
    <div class="flex gap-4 relative">
      <!-- Imagen del producto -->
      <div
        class="w-24 h-24 bg-gray-100 rounded-lg overflow-hidden"
      >
        <img
          v-if="item.image"
          :src="item.image"
          :alt="item.name"
          class="w-full h-full object-cover"
        />
        <div v-else class="w-full h-full flex items-center justify-center">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="h-10 w-10 text-gray-300"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
            />
          </svg>
        </div>
      </div>

      <!-- Detalles del producto -->
      <div class="flex-grow flex flex-col justify-between">
        <h4 class="font-semibold text-gray-900">{{ item.name }}</h4>

        <!-- Opciones seleccionadas -->
        <div class="mt-1 space-y-0.5">
          <p v-if="item.options.talla" class="text-sm text-gray-600">
            <span class="font-medium">Talla:</span> {{ item.options.talla }}
          </p>
          <p v-if="item.options.genero" class="text-sm text-gray-600">
            <span class="font-medium">Género:</span> {{ item.options.genero }}
          </p>
          <p v-if="item.options.color" class="text-sm text-gray-600">
            <span class="font-medium">Color:</span> {{ item.options.color }}
          </p>
          <p v-if="item.options.numero" class="text-sm text-gray-600">
            <span class="font-medium">Número:</span> {{ item.options.numero }}
          </p>
          <p v-if="item.options.nombre" class="text-sm text-gray-600">
            <span class="font-medium">Nombre:</span> {{ item.options.nombre }}
          </p>
        </div>

        <!-- Cantidad y precio -->
        <div class="mt-2 flex items-center justify-between">
            <div class="text-right">
            <!-- <p class="text-sm text-gray-500">
              {{ item.price.toFixed(2) }}€ / ud
            </p> -->
            <p class="font-bold text-gray-900">
              {{ (item.price * item.quantity).toFixed(2) }}€
            </p>
          </div>
          <div class="flex items-center space-x-1">
            <button
              @click="$emit('update-quantity', index, item.quantity - 1)"
              class="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
            >
              -
            </button>
            <span class="w-8 text-center font-medium">{{ item.quantity }}</span>
            <button
              @click="$emit('update-quantity', index, item.quantity + 1)"
              class="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
            >
              +
            </button>
          </div>

          
        </div>
      </div>

      <!-- Botón eliminar -->
      <button
        @click="$emit('remove', index)"
        class="text-red-500 hover:text-red-700 transition-colors self-start absolute top-0 right-0"
        title="Eliminar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CartItem } from "~/types";

interface Props {
  item: CartItem;
  index: number;
}

defineProps<Props>();

defineEmits<{
  (e: "update-quantity", index: number, quantity: number): void;
  (e: "remove", index: number): void;
}>();
</script>
