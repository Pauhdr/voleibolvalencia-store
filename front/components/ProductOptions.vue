<template>
  <div class="space-y-4 pb-24 md:pb-0">
    <!-- Talla -->
    <div v-if="product.options.hasTalla">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Talla <span class="text-red-500">*</span>
      </label>
      <select v-model="selectedOptions.talla" class="select-field">
        <option value="">Selecciona una talla</option>
        <option
          v-for="talla in product.options.tallas"
          :key="talla"
          :value="talla"
        >
          {{ talla }}
        </option>
      </select>
      
      <!-- Enlace a la guía de tallas -->
      <button
        type="button"
        @click="emit('show-size-guide')"
        class="mt-2 text-sm text-orange-600 hover:text-orange-700 font-medium flex items-center gap-1 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        Ver guía de tallas
      </button>
    </div>

    <!-- Género -->
    <div v-if="product.options.hasGenero">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Género <span class="text-red-500">*</span>
      </label>
      <div class="grid grid-cols-2 gap-3">
        <button
          v-for="genero in product.options.generos"
          :key="genero"
          type="button"
          @click="selectedOptions.genero = genero"
          :class="[
            'py-2 px-4 rounded-lg font-medium transition-all',
            selectedOptions.genero === genero
              ? 'bg-orange-600 text-white shadow-md'
              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
          ]"
        >
          {{ genero }}
        </button>
      </div>
    </div>

    <!-- Color (para llaveros) -->
    <div v-if="product.options.hasColor">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Color <span class="text-red-500">*</span>
      </label>
      <select v-model="selectedOptions.color" class="select-field">
        <option value="">Selecciona un color</option>
        <option
          v-for="color in product.options.colores"
          :key="color"
          :value="color"
        >
          {{ color }}
        </option>
      </select>
    </div>

    <!-- Número (opcional) -->
    <div v-if="product.options.hasNumero">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Número <span class="text-gray-500 text-xs">(opcional)</span>
      </label>
      <input
        v-model="selectedOptions.numero"
        type="text"
        maxlength="2"
        placeholder="Ej: 10"
        class="input-field"
      />
    </div>

    <!-- Nombre (opcional) -->
    <div v-if="product.options.hasNombre">
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Nombre <span class="text-gray-500 text-xs">(opcional)</span>
      </label>
      <input
        v-model="selectedOptions.nombre"
        type="text"
        maxlength="20"
        placeholder="Ej: GARCÍA"
        class="input-field"
      />
    </div>

    <!-- Cantidad -->
    <div>
      <label class="block text-sm font-semibold text-gray-700 mb-2">
        Cantidad
      </label>
      <div class="flex items-center space-x-3">
        <button
          type="button"
          @click="decrementQuantity"
          class="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
        >
          -
        </button>
        <span class="w-8 text-center">{{ quantity }}</span>
        <button
          type="button"
          @click="incrementQuantity"
          class="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center text-gray-700 transition-colors"
        >
          +
        </button>
      </div>
    </div>

    <!-- Botón añadir al carrito - Fijo en móvil -->
    <div class="fixed md:static bottom-0 left-0 right-0 bg-white border-t md:border-t-0 shadow-lg md:shadow-none p-4 md:p-0 z-40">
      <div class="flex items-center justify-between gap-3 md:flex-col md:items-stretch">
        <!-- Precio total (visible en móvil) -->
        <div class="flex flex-col md:hidden">
          <span class="text-sm text-gray-600">Total</span>
          <span class="text-2xl font-bold text-orange-600">
            {{ totalPrice.toFixed(2) }}€
          </span>
        </div>
        
        <!-- Botón -->
        <button
          type="button"
          @click="addToCart"
          :disabled="!isValid"
          class="btn-primary flex-1 md:w-full md:mt-4"
        >
          <span class="md:hidden">Añadir</span>
          <span class="hidden md:inline">Añadir al carrito</span>
        </button>
      </div>

      <!-- Mensaje de error -->
      <p v-if="errorMessage" class="text-red-600 text-sm text-center mt-2">
        {{ errorMessage }}
      </p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { Product, SelectedOptions, CartItem } from '~/types';
import { useCartStore } from '~/stores/cart';

interface Props {
  product: Product;
}

const props = defineProps<Props>();
const emit = defineEmits<{
  (e: 'add-to-cart', item: CartItem): void;
  (e: 'show-size-guide'): void;
}>();

const cartStore = useCartStore();

// Estado local
const selectedOptions = ref<SelectedOptions>({
  talla: '',
  genero: '',
  nombre: '',
  numero: '',
  color: '',
});

const quantity = ref(1);
const errorMessage = ref('');

// Validación
const isValid = computed(() => {
  if (props.product.options.hasTalla && !selectedOptions.value.talla) return false;
  if (props.product.options.hasGenero && !selectedOptions.value.genero) return false;
  if (props.product.options.hasColor && !selectedOptions.value.color) return false;
  return true;
});

// Precio total
const totalPrice = computed(() => {
  return props.product.price * quantity.value;
});

// Métodos
const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const addToCart = () => {
  if (!isValid.value) {
    errorMessage.value = 'Por favor, completa todas las opciones requeridas';
    return;
  }

  const cartItem: CartItem = {
    product_id: props.product.id,
    name: props.product.name,
    quantity: quantity.value,
    price: props.product.price,
    image: props.product.image,
    options: { ...selectedOptions.value },
  };

  cartStore.addItem(cartItem);
  
  // Resetear formulario
  selectedOptions.value = {
    talla: '',
    genero: '',
    nombre: '',
    numero: '',
    color: '',
  };
  quantity.value = 1;
  errorMessage.value = '';

};
</script>
