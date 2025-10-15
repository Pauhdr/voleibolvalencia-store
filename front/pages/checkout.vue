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
      <form @submit.prevent="handleSubmit" class="space-y-4">
        
        <!-- 1. Resumen del Pedido (Colapsado por defecto) -->
        <div class="overflow-hidden">
          <button
            type="button"
            @click="toggleSection('summary')"
            class="w-full px-2 py-4 flex items-center justify-between transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 text-orange-600 font-bold text-xl">
                1
              </span>
              <h2 class="text-lg font-display font-semibold text-gray-900">
                Resumen del Pedido
              </h2>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-400 transition-transform"
              :class="{ 'rotate-180': openSections.summary }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div
            v-show="openSections.summary"
            class="px-6 pb-6 border border-gray-200 rounded"
          >
            <div class="space-y-3 mb-4 mt-4">
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
        </div>

        <!-- 2. Datos del Pedido (Abierto por defecto) -->
        <div class="overflow-hidden">
          <button
            type="button"
            @click="toggleSection('data')"
            class="w-full px-2 py-4 flex items-center justify-between transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 text-orange-600 font-bold text-xl">
                2
              </span>
              <h2 class="text-lg font-display font-semibold text-gray-900">
                Datos del Pedido
              </h2>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-400 transition-transform"
              :class="{ 'rotate-180': openSections.data }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div
            v-show="openSections.data"
            class="px-6 pb-6 border-t border-gray-200"
          >
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
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
                <select
                  v-model="formData.team"
                  required
                  class="input-field"
                >
                  <option value="" disabled>Selecciona un equipo</option>
                  <option v-for="team in TEAMS" :key="team" :value="team">
                    {{ team }}
                  </option>
                </select>
              </div>

              <!-- Nombre del padre/madre -->
              <div class="md:col-span-2">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Padre/Madre <span class="text-red-500">*</span>
                </label>
                <input
                  v-model="formData.parent_name"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Ej: Juan García López"
                />
              </div>

              <!-- Email -->
              <div class="md:col-span-2">
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
        </div>

        <!-- 3. Pago (Colapsado por defecto) -->
        <div class="overflow-hidden">
          <button
            type="button"
            @click="toggleSection('payment')"
            class="w-full px-2 py-4 flex items-center justify-between transition-colors"
          >
            <div class="flex items-center gap-3">
              <span class="flex items-center justify-center w-8 h-8 text-orange-600 font-bold text-xl">
                3
              </span>
              <h2 class="text-lg font-display font-semibold text-gray-900">
                Pago
              </h2>
            </div>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-6 w-6 text-gray-400 transition-transform"
              :class="{ 'rotate-180': openSections.payment }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          
          <div
            v-show="openSections.payment"
            class="border-t border-gray-200"
          >
            <!-- Datos bancarios -->
            <div class="m-2 px-6 py-6 border rounded border-gray-200">
              <h3 class="text-lg font-display font-bold text-gray-900 mb-4 flex items-center gap-2">
                <span>Información de Pago</span>
              </h3>
              
              <div class="space-y-3">
                <div>
                  <p class="text-sm text-gray-700">IBAN:</p>
                  <p class="text-sm font-mono font-semibold text-gray-900">ES12 3456 7890 1234 5678 9012</p>
                </div>
                
                <div>
                  <p class="text-sm  text-gray-700">Beneficiario:</p>
                  <p class="text-sm font-semibold text-gray-900">Club Voleibol Valencia</p>
                </div>
                
                <div>
                  <p class="text-sm text-gray-700">Concepto:</p>
                  <p class="text-sm font-semibold text-gray-900">{{ formData.player_name || '[Nombre del jugador]' }} - {{ formData.team || '[Equipo]' }}</p>
                </div>

                <div class="bg-orange-100 p-4 rounded-lg border border-orange-300 mt-4">
                  <p class="text-sm text-gray-700">
                    <strong>⚠️ Importante:</strong> Realiza la transferencia con el concepto indicado y sube el comprobante a continuación.
                  </p>
                </div>
              </div>
            </div>

            <!-- Comprobante de pago -->
            <div class="px-2 pb-6 pt-6">
              <h3 class="text-lg font-display font-bold text-gray-900 mb-4">
                Comprobante de Pago
              </h3>

              <!-- Referencia de transferencia -->
              <!-- <div class="mb-6">
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Referencia de Transferencia <span class="text-gray-500 text-xs">(opcional)</span>
                </label>
                <input
                  v-model="formData.transfer_reference"
                  type="text"
                  class="input-field"
                  placeholder="Ej: Número de operación o referencia"
                />
              </div> -->

              <!-- Subida de archivo -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Comprobante <span class="text-red-500">*</span>
                </label>
                
                <!-- Zona de subida -->
                <div class="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-500 transition-colors">
                  <input
                    ref="fileInput"
                    type="file"
                    accept="image/*,.pdf"
                    @change="handleFileUpload"
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
                
                <!-- Preview del archivo subido -->
                <div v-if="selectedFile && filePreview" class="mt-4">
                  <div class="p-3 bg-gray-50 border border-gray-200 rounded-lg hover:bg-gray-100 transition-colors">
                    <div class="flex gap-3">
                      <!-- Miniatura/Preview -->
                      <div class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden bg-gray-200 flex items-center justify-center">
                        <img
                          v-if="filePreview.type === 'image'"
                          :src="filePreview.url"
                          :alt="selectedFile.name"
                          class="w-full h-full object-cover"
                        />
                        <div v-else class="flex flex-col items-center justify-center text-gray-500">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                          </svg>
                          <span class="text-xs mt-1">PDF</span>
                        </div>
                      </div>
                      
                      <!-- Info del archivo -->
                      <div class="flex-1 min-w-0">
                        <p class="text-sm font-medium text-gray-900 truncate">
                          {{ selectedFile.name }}
                        </p>
                        <p class="text-xs text-gray-500 mt-1">
                          {{ (selectedFile.size / 1024 / 1024).toFixed(2) }} MB
                        </p>
                        <div class="flex items-center gap-1 mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span class="text-xs text-green-700 font-medium">Listo para enviar</span>
                        </div>
                      </div>
                      
                      <!-- Botón eliminar -->
                      <button
                        type="button"
                        @click="removeFile()"
                        class="flex-shrink-0 p-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition-colors"
                        title="Eliminar archivo"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
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
import { ref, computed, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import { useCartStore } from '~/stores/cart';
import { useSupabase } from '~/composables/useSupabase';
import type { BuyerData } from '~/types';
import { TEAMS } from '~/types';

const router = useRouter();
const cartStore = useCartStore();
const { createOrder } = useSupabase();

// Redirigir si el carrito está vacío
if (cartStore.isEmpty) {
  router.push('/cart');
}

// Estado del formulario
const formData = ref({
  player_name: '',
  team: '',
  parent_name: '',
  email: '',
  transfer_reference: '',
});

const selectedFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const submitting = ref(false);
const errorMessage = ref('');
const filePreview = ref<{ url: string; type: 'image' | 'pdf' } | null>(null);

// Estado de las secciones colapsables
const openSections = ref({
  summary: false,   // Resumen: colapsado por defecto
  data: true,       // Datos: abierto por defecto
  payment: false,   // Pago: colapsado por defecto
});

// Función para alternar secciones
const toggleSection = (section: 'summary' | 'data' | 'payment') => {
  openSections.value[section] = !openSections.value[section];
};

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

// Manejo de un único archivo
const handleFileUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  console.log('📁 Archivo seleccionado:', file);
  
  if (file) {
    // Validar tamaño (10MB máximo)
    if (file.size > 10 * 1024 * 1024) {
      alert('El archivo es demasiado grande. El tamaño máximo es 10MB.');
      return;
    }
    
    // Liberar URL anterior si existe
    if (filePreview.value) {
      URL.revokeObjectURL(filePreview.value.url);
    }
    
    // Guardar archivo
    selectedFile.value = file;
    
    // Crear preview
    const fileType = file.type.startsWith('image/') ? 'image' : 'pdf';
    const url = URL.createObjectURL(file);
    filePreview.value = { url, type: fileType };
    
    console.log('✅ Preview creado:', {
      fileName: file.name,
      fileType,
      previewUrl: url,
      selectedFile: selectedFile.value,
      filePreview: filePreview.value
    });
  }
};

const removeFile = () => {
  // Liberar URL del preview
  if (filePreview.value) {
    URL.revokeObjectURL(filePreview.value.url);
  }
  
  selectedFile.value = null;
  filePreview.value = null;
  
  if (fileInput.value) {
    fileInput.value.value = '';
  }
};

// Limpiar URLs al desmontar el componente
onUnmounted(() => {
  if (filePreview.value) {
    URL.revokeObjectURL(filePreview.value.url);
  }
});

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

    // Crear pedido en Supabase
    const orderData = {
      player_name: formData.value.player_name,
      team: formData.value.team,
      parent_name: formData.value.parent_name,
      email: formData.value.email,
      transfer_reference: formData.value.transfer_reference || undefined,
      products: cartStore.items,
      total: cartStore.total,
      payment_proof: selectedFile.value!,
    };

    console.log('📦 Enviando pedido:', {
      player_name: orderData.player_name,
      team: orderData.team,
      parent_name: orderData.parent_name,
      email: orderData.email,
      products_count: cartStore.items.length,
      total: orderData.total,
      proof_file: selectedFile.value?.name,
    });

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
    errorMessage.value = error.message || 'Hubo un error al enviar el pedido. Por favor, inténtalo de nuevo.';
  } finally {
    submitting.value = false;
  }
};
</script>
