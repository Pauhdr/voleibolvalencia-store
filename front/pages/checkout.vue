<template>
  <div class="container-custom py-8">
    <div class="max-w-3xl mx-auto">
      <!-- Header -->
      <div class="mb-8">
        <h1 class="text-4xl font-display font-bold text-gray-900 mb-2">
          Finalizar Pedido
        </h1>
        <p class="text-gray-600">
          Completa tus datos y sube el comprobante de pago
        </p>
      </div>

      <!-- Formulario -->
      <form @submit.prevent="handleSubmit" class="space-y-8">
        <!-- Datos del jugador/a y familia -->
        <div class="card p-6">
          <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">
            Datos del Pedido
          </h2>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <!-- Nombre del jugador -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Jugador/a <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.player_name"
                type="text"
                required
                class="input-field"
                placeholder="Ej: María García"
              />
            </div>

            <!-- Equipo -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Equipo <span class="text-red-500">*</span>
              </label>
              <select v-model="formData.team" required class="select-field">
                <option value="">Selecciona un equipo</option>
                <option v-for="team in TEAMS" :key="team" :value="team">
                  {{ team }}
                </option>
              </select>
            </div>

            <!-- Nombre del padre/madre -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Nombre del Padre/Madre <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.parent_name"
                type="text"
                required
                class="input-field"
                placeholder="Ej: Juan García"
              />
            </div>

            <!-- Email -->
            <div>
              <label class="block text-sm font-semibold text-gray-700 mb-2">
                Email <span class="text-red-500">*</span>
              </label>
              <input
                v-model="formData.email"
                type="email"
                required
                class="input-field"
                placeholder="ejemplo@email.com"
              />
            </div>
          </div>
        </div>

        <!-- Resumen del pedido -->
        <div class="card p-6">
          <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">
            Resumen del Pedido
          </h2>

          <div class="space-y-3 mb-4">
            <div
              v-for="(item, index) in cartStore.items"
              :key="index"
              class="flex justify-between text-gray-700"
            >
              <span>{{ item.name }} x{{ item.quantity }}</span>
              <span class="font-semibold">{{ (item.price * item.quantity).toFixed(2) }}€</span>
            </div>
          </div>

          <div class="border-t border-gray-200 pt-4 flex justify-between text-xl font-bold text-gray-900">
            <span>Total</span>
            <span class="text-orange-600">{{ cartStore.total.toFixed(2) }}€</span>
          </div>
        </div>

        <!-- Datos bancarios -->
        <div class="card p-6 bg-orange-50 border-2 border-orange-200">
          <h2 class="text-2xl font-display font-bold text-gray-900 mb-4">
            💳 Información de Pago
          </h2>
          
          <div class="space-y-3">
            <div>
              <p class="text-sm font-semibold text-gray-700">IBAN:</p>
              <p class="text-lg font-mono font-bold text-gray-900">ES12 3456 7890 1234 5678 9012</p>
            </div>
            
            <div>
              <p class="text-sm font-semibold text-gray-700">Beneficiario:</p>
              <p class="text-lg font-bold text-gray-900">Club Voleibol Valencia</p>
            </div>
            
            <div>
              <p class="text-sm font-semibold text-gray-700">Concepto:</p>
              <p class="text-lg font-bold text-gray-900">{{ formData.player_name || '[Nombre del jugador]' }} - {{ formData.team || '[Equipo]' }}</p>
            </div>

            <div class="bg-white p-4 rounded-lg border border-orange-300 mt-4">
              <p class="text-sm text-gray-700">
                <strong>⚠️ Importante:</strong> Realiza la transferencia con el concepto indicado y sube el comprobante a continuación.
              </p>
            </div>
          </div>
        </div>

        <!-- Comprobante de pago -->
        <div class="card p-6">
          <h2 class="text-2xl font-display font-bold text-gray-900 mb-6">
            Comprobante de Pago
          </h2>

          <!-- Referencia de transferencia -->
          <div class="mb-6">
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Referencia de Transferencia <span class="text-gray-500 text-xs">(opcional)</span>
            </label>
            <input
              v-model="formData.transfer_reference"
              type="text"
              class="input-field"
              placeholder="Ej: Número de operación o referencia"
            />
          </div>

          <!-- Subida de archivo -->
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Comprobante <span class="text-red-500">*</span>
            </label>
            <div class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-orange-500 transition-colors">
              <input
                ref="fileInput"
                type="file"
                accept="image/*,.pdf"
                @change="handleFileUpload"
                required
                class="hidden"
                id="file-upload"
              />
              <label
                for="file-upload"
                class="cursor-pointer"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-400 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                </svg>
                <p class="text-gray-700 font-semibold mb-1">
                  Haz clic para subir el comprobante
                </p>
                <p class="text-sm text-gray-500">
                  PNG, JPG o PDF (máx. 10MB)
                </p>
              </label>
            </div>
            
            <!-- Archivo seleccionado -->
            <div v-if="selectedFile" class="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center justify-between">
              <div class="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-green-900 font-medium">{{ selectedFile.name }}</span>
              </div>
              <button
                type="button"
                @click="removeFile"
                class="text-red-600 hover:text-red-700"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        <!-- Botón de envío -->
        <div class="flex flex-col sm:flex-row gap-4">
          <NuxtLink to="/cart" class="btn-outline flex-1 text-center">
            Volver al Carrito
          </NuxtLink>
          <button
            type="submit"
            :disabled="submitting || !isFormValid"
            class="btn-primary flex-1"
          >
            <span v-if="submitting">Enviando pedido...</span>
            <span v-else>Enviar Pedido</span>
          </button>
        </div>

        <!-- Mensaje de error -->
        <p v-if="errorMessage" class="text-red-600 text-center">
          {{ errorMessage }}
        </p>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import { usePocketBase } from '~/composables/usePocketBase';
import { TEAMS } from '~/types';
import type { BuyerData } from '~/types';

const router = useRouter();
const cartStore = useCartStore();
const { createOrder } = usePocketBase();

// Redirigir si el carrito está vacío
if (cartStore.isEmpty) {
  router.push('/cart');
}

// Estado del formulario
const formData = ref<BuyerData & { transfer_reference?: string }>({
  player_name: cartStore.buyerData?.player_name || '',
  team: cartStore.buyerData?.team || '',
  parent_name: cartStore.buyerData?.parent_name || '',
  email: cartStore.buyerData?.email || '',
  transfer_reference: '',
});

const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const submitting = ref(false);
const errorMessage = ref('');

// Validación
const isFormValid = computed(() => {
  return (
    formData.value.player_name &&
    formData.value.team &&
    formData.value.parent_name &&
    formData.value.email &&
    selectedFile.value !== null
  );
});

// Manejo de archivo
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      return;
    }
    
    selectedFile.value = file;
  }
};

const removeFile = () => {
  selectedFile.value = null;
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Envío del formulario
const handleSubmit = async () => {
  if (!isFormValid.value) {
    errorMessage.value = 'Por favor, completa todos los campos requeridos';
    return;
  }

  submitting.value = true;
  errorMessage.value = '';

  try {
    // Guardar datos del comprador en el store
    cartStore.setBuyerData({
      player_name: formData.value.player_name,
      team: formData.value.team,
      parent_name: formData.value.parent_name,
      email: formData.value.email,
    });

    // Crear pedido en PocketBase
    const orderData = {
      buyer_name: formData.value.parent_name,
      buyer_email: formData.value.email,
      player_name: formData.value.player_name,
      team: formData.value.team,
      products: cartStore.items,
      total: cartStore.total,
      transfer_reference: formData.value.transfer_reference,
      proof: selectedFile.value!,
    };

    const order = await createOrder(orderData);

    if (order) {
      // Limpiar carrito y redirigir a página de éxito
      cartStore.reset();
      router.push('/success');
    } else {
      throw new Error('No se pudo crear el pedido');
    }
  } catch (error: any) {
    console.error('Error creating order:', error);
    errorMessage.value = 'Hubo un error al enviar el pedido. Por favor, inténtalo de nuevo.';
  } finally {
    submitting.value = false;
  }
};
</script>
