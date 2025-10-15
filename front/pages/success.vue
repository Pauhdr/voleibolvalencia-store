<template>
  <div class="container-custom py-16">
    <div class="max-w-2xl mx-auto text-center h-[100vh] ">
      <!-- Icono de éxito -->
      <div class="mb-8">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-4xl font-display font-bold text-gray-900 mb-4">
          ¡Pedido Enviado!
        </h1>
        <p class="text-xl text-gray-600">
          Hemos recibido tu pedido correctamente
        </p>
      </div>

      <!-- Información del pedido -->
      <!-- <div class="card p-8 mb-8 text-left"> -->
        <!-- <h2 class="text-2xl font-display font-bold text-gray-900 mb-6 text-center">
          Próximos Pasos
        </h2> -->

        <!-- <div class="space-y-6"> -->
          <!-- Paso 1 -->
          <!-- <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
              1
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Revisión del Pedido</h3>
              <p class="text-gray-600">
                El club revisará tu pedido y el comprobante de pago en las próximas 24-48 horas.
              </p>
            </div>
          </div> -->

          <!-- Paso 2 -->
          <!-- <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
              2
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Confirmación</h3>
              <p class="text-gray-600">
                Recibirás un email de confirmación cuando el pago haya sido verificado.
              </p>
            </div>
          </div> -->

          <!-- Paso 3 -->
          <!-- <div class="flex items-start space-x-4">
            <div class="flex-shrink-0 w-10 h-10 bg-orange-600 text-white rounded-full flex items-center justify-center font-bold">
              3
            </div>
            <div>
              <h3 class="font-bold text-gray-900 mb-1">Recogida</h3>
              <p class="text-gray-600">
                Te avisaremos cuando el pedido esté listo para recoger en el club.
              </p>
            </div>
          </div> -->
        <!-- </div> -->
      <!-- </div> -->

      <!-- Datos bancarios de recordatorio -->
      <!-- <div class="card p-6 bg-orange-50 border-2 border-orange-200 mb-8 text-left">
        <h3 class="text-lg font-display font-bold text-gray-900 mb-4 text-center">
          📋 Recordatorio: Datos de Transferencia
        </h3>
        
        <div class="space-y-2">
          <div>
            <p class="text-sm font-semibold text-gray-700">IBAN:</p>
            <p class="text-lg font-mono font-bold text-gray-900">ES12 3456 7890 1234 5678 9012</p>
          </div>
          
          <div>
            <p class="text-sm font-semibold text-gray-700">Beneficiario:</p>
            <p class="font-bold text-gray-900">Club Voleibol Valencia</p>
          </div>
        </div>
      </div> -->

      <!-- Información de contacto -->
      <div class="bg-gray-100 rounded-lg p-6 mb-8">
        <h3 class="font-bold text-gray-900 mb-3">¿Tienes alguna duda?</h3>
        <p class="text-gray-600 mb-4">
          Si tienes cualquier pregunta sobre tu pedido, no dudes en contactarnos:
        </p>
        <div class="space-y-2 text-gray-700">
          <p>
            <strong>Email:</strong> tienda@voleibolvalencia.com
          </p>
          <p>
            <strong>Teléfono:</strong> 963 XXX XXX
          </p>
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="space-y-4">
        <NuxtLink to="/" class="btn-primary w-full block">
          Volver a la Tienda
        </NuxtLink>
        <button
          @click="printPage"
          class="btn-outline w-full"
        >
          🖨️ Imprimir Confirmación
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const printPage = () => {
  window.print();
};

// Opcional: Prevenir que el usuario vuelva atrás después del éxito
onMounted(() => {
  // Puedes añadir lógica adicional aquí si es necesario
});
</script>

<style scoped>
@media print {
  button {
    display: none;
  }
}
</style>
