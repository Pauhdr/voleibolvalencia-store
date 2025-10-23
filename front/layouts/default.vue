<template>
  <div class="min-h-screen flex flex-col">
    <!-- Header -->
    <header class="bg-white sticky top-0 z-50">
      <nav class="container-custom py-4">
        <div class="flex items-center justify-between">
          <!-- Logo y título -->
          <NuxtLink to="/" class="flex items-center space-x-3 group">
            <div class="w-14 h-14 rounded-full flex items-center justify-center">
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
              <span v-if="itemCount > 0" class="absolute -top-2 -right-2 bg-orange-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {{ itemCount }}
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
        <div class="flex align-center justify-around gap-8 flex-col md:flex-row">
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
            <p class="text-gray-400 text-sm flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              info@voleibolvalencia.com
            </p>
          </div>
        </div>

        <div class="border-t border-gray-800 mt-8 pt-6 text-center text-gray-500 text-sm">
          <p>&copy; {{ new Date().getFullYear() }} Voleibol Valencia. Todos los derechos reservados.</p>
          <button 
            @click="showPrivacyModal = true"
            class="text-gray-400 hover:text-white transition-colors underline mt-2"
          >
            Política de Protección de Datos
          </button>
        </div>
      </div>
    </footer>

    <!-- Modal de Política de Protección de Datos -->
    <div
      v-if="showPrivacyModal"
      class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
      @click="showPrivacyModal = false"
    >
      <div
        class="bg-white rounded-lg max-w-3xl w-full max-h-[85vh] overflow-hidden flex flex-col"
        @click.stop
      >
        <!-- Header -->
        <div class="bg-orange-600 text-white px-6 py-4 flex items-center justify-between">
          <h3 class="text-xl font-bold flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            Política de Protección de Datos
          </h3>
          <button
            @click="showPrivacyModal = false"
            class="text-white hover:text-gray-200 transition-colors"
            title="Cerrar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <!-- Content -->
        <div class="p-6 overflow-y-auto flex-1">
          <div class="prose prose-sm max-w-none text-gray-700">
            <section class="max-w-3xl mx-auto p-6 text-gray-800 leading-relaxed">
              <p class="mb-4">
                De conformidad con lo dispuesto en el Reglamento (UE) 2016/679, de 27 de abril (RGPD), y la Ley Orgánica 3/2018, de 5 de diciembre (LOPDGDD), le informamos de que los datos personales que nos facilite a través de este formulario serán tratados por 
                <strong class="font-semibold text-gray-900">Club Voleibol Valencia</strong> 
                como responsable del tratamiento, con la finalidad exclusiva de gestionar y suministrar el pedido realizado, así como para mantener, en su caso, la relación derivada del mismo.
              </p>

              <p class="mb-4">
                Los datos se conservarán únicamente durante el tiempo necesario para cumplir con dicha finalidad o mientras puedan derivarse responsabilidades legales del tratamiento. 
                No se cederán datos a terceros, salvo obligación legal o necesidad para la prestación del servicio 
                <span class="italic">(por ejemplo, empresas de mensajería)</span>.
              </p>

              <p class="mb-4">
                El tratamiento de sus datos se basa en la ejecución del contrato de compraventa iniciado por usted al realizar el pedido.
              </p>

              <p>
                Usted puede ejercer sus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento y portabilidad mediante comunicación escrita dirigida a 
                <a href="mailto:info@voleibolvalencia.com" class="text-orange-600 hover:text-orange-700 font-medium underline">info@voleibolvalencia.com</a>, 
                indicando en el asunto “Protección de Datos”, o por correo postal al domicilio del Club, acompañado de una copia de su documento identificativo.
              </p>
            </section>
            <p class="text-[11px] text-gray-500 mt-6">
              Última actualización: {{ new Date().toLocaleDateString('es-ES', { year: 'numeric', month: 'long', day: 'numeric' }) }}
            </p>
          </div>
        </div>

        <!-- Footer -->
        <!-- <div class="bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end">
          <button
            @click="showPrivacyModal = false"
            class="px-6 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors font-medium"
          >
            Cerrar
          </button>
        </div> -->
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';
import { ref, onMounted } from 'vue';

// Inicializar el contador como 0
const itemCount = ref(0);

// Estado de la modal de política de privacidad
const showPrivacyModal = ref(false);

// Solo inicializar el store en el cliente después de montar
onMounted(() => {
  const cartStore = useCartStore();
  // Actualizar el itemCount de forma reactiva
  watch(() => cartStore.itemCount, (newCount) => {
    itemCount.value = newCount;
  }, { immediate: true });
});

// El plugin de persistedstate ya maneja la carga automática desde localStorage
</script>
