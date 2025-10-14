<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 z-50 overflow-y-auto"
    @click.self="close"
  >
    <div class="flex min-h-screen items-center justify-center p-4">
      <!-- Overlay -->
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity" @click="close"></div>

      <!-- Modal -->
      <div class="relative bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <!-- Header -->
        <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between rounded-t-2xl">
          <h2 class="text-2xl font-display font-bold text-gray-900">
            Guía de Tallas
          </h2>
          <button
            @click="close"
            class="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Contenido -->
        <div class="p-6 space-y-6">
          <!-- Aviso importante -->
          <div class="bg-orange-50 border-l-4 border-orange-600 p-4 rounded">
            <div class="flex items-start">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600 mr-3 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <div>
                <p class="font-bold text-orange-900 mb-1">¡IMPORTANTE!</p>
                <p class="text-orange-800">
                  Las tallas son <strong>diferentes para chico y chica</strong>. Por favor, consulta la tabla correspondiente al género seleccionado.
                </p>
              </div>
            </div>
          </div>

          <!-- Tallas Chico -->
          <div>
            <h3 class="text-xl font-display font-bold text-gray-900 mb-3 flex items-center">
              <span class="bg-blue-600 text-white px-3 py-1 rounded-lg mr-2">Chico</span>
              Guía de Tallas
            </h3>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse border border-gray-300">
                <thead class="bg-blue-50">
                  <tr>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Talla</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Altura (cm)</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Pecho (cm)</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Edad Aprox.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(size, index) in boysSizes" :key="index" class="hover:bg-gray-50">
                    <td class="border border-gray-300 px-4 py-2 font-medium">{{ size.talla }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ size.altura }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ size.pecho }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ size.edad }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Tallas Chica -->
          <div>
            <h3 class="text-xl font-display font-bold text-gray-900 mb-3 flex items-center">
              <span class="bg-pink-600 text-white px-3 py-1 rounded-lg mr-2">Chica</span>
              Guía de Tallas
            </h3>
            <div class="overflow-x-auto">
              <table class="w-full border-collapse border border-gray-300">
                <thead class="bg-pink-50">
                  <tr>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Talla</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Altura (cm)</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Pecho (cm)</th>
                    <th class="border border-gray-300 px-4 py-2 text-left font-semibold">Edad Aprox.</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(size, index) in girlsSizes" :key="index" class="hover:bg-gray-50">
                    <td class="border border-gray-300 px-4 py-2 font-medium">{{ size.talla }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ size.altura }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ size.pecho }}</td>
                    <td class="border border-gray-300 px-4 py-2">{{ size.edad }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Consejos -->
          <div class="bg-gray-50 p-4 rounded-lg">
            <h4 class="font-bold text-gray-900 mb-2">Consejos para elegir la talla correcta:</h4>
            <ul class="space-y-1 text-sm text-gray-700">
              <li class="flex items-start">
                <span class="text-orange-600 mr-2">•</span>
                <span>Mide la altura del jugador/a desde la cabeza hasta los pies sin zapatos</span>
              </li>
              <li class="flex items-start">
                <span class="text-orange-600 mr-2">•</span>
                <span>Si está entre dos tallas, elige la talla mayor para mayor comodidad</span>
              </li>
              <li class="flex items-start">
                <span class="text-orange-600 mr-2">•</span>
                <span>Ten en cuenta que las prendas deportivas deben permitir libertad de movimiento</span>
              </li>
              <li class="flex items-start">
                <span class="text-orange-600 mr-2">•</span>
                <span>En caso de duda, contacta con el club antes de realizar el pedido</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- Footer -->
        <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 rounded-b-2xl">
          <button @click="close" class="btn-primary w-full">
            Entendido
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  isOpen: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const close = () => {
  emit('close');
};

// Datos de tallas para chicos
const boysSizes = [
  { talla: '4XS', altura: '100-110', pecho: '56-58', edad: '4-5 años' },
  { talla: '3XS', altura: '110-120', pecho: '58-62', edad: '5-6 años' },
  { talla: '2XS', altura: '120-130', pecho: '62-66', edad: '6-8 años' },
  { talla: 'XS', altura: '130-140', pecho: '66-72', edad: '8-10 años' },
  { talla: 'S', altura: '140-152', pecho: '72-78', edad: '10-12 años' },
  { talla: 'M', altura: '152-164', pecho: '78-86', edad: '12-14 años' },
  { talla: 'L', altura: '164-176', pecho: '86-94', edad: '14-16 años' },
  { talla: 'XL', altura: '176-182', pecho: '94-102', edad: '16+ años' },
];

// Datos de tallas para chicas
const girlsSizes = [
  { talla: '4XS', altura: '100-110', pecho: '54-56', edad: '4-5 años' },
  { talla: '3XS', altura: '110-120', pecho: '56-60', edad: '5-6 años' },
  { talla: '2XS', altura: '120-130', pecho: '60-64', edad: '6-8 años' },
  { talla: 'XS', altura: '130-140', pecho: '64-70', edad: '8-10 años' },
  { talla: 'S', altura: '140-152', pecho: '70-76', edad: '10-12 años' },
  { talla: 'M', altura: '152-164', pecho: '76-84', edad: '12-14 años' },
  { talla: 'L', altura: '164-172', pecho: '84-92', edad: '14-16 años' },
  { talla: 'XL', altura: '172-178', pecho: '92-100', edad: '16+ años' },
];
</script>
