<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Login -->
    <div v-if="!isAuthenticated" class="flex items-center justify-center min-h-screen">
      <div class="card p-8 max-w-md w-full mx-4">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-display font-bold text-gray-900 mb-2">
            Panel de Administración
          </h1>
          <p class="text-gray-600">
            Acceso solo para miembros del club
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Email
            </label>
            <input
              v-model="loginForm.email"
              type="email"
              required
              class="input-field"
              placeholder="admin@voleibolvalencia.com"
            />
          </div>

          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-2">
              Contraseña
            </label>
            <input
              v-model="loginForm.password"
              type="password"
              required
              class="input-field"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            :disabled="loggingIn"
            class="btn-primary w-full"
          >
            <span v-if="loggingIn">Iniciando sesión...</span>
            <span v-else>Iniciar Sesión</span>
          </button>

          <p v-if="loginError" class="text-red-600 text-sm text-center">
            {{ loginError }}
          </p>
        </form>
      </div>
    </div>

    <!-- Panel de administración -->
    <div v-else>
      <!-- Header -->
      <header class="bg-white shadow-md">
        <div class="container-custom py-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-display font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p class="text-sm text-gray-600">Gestión de pedidos del club</p>
          </div>
          <button @click="handleLogout" class="btn-secondary">
            Cerrar Sesión
          </button>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="container-custom py-8">
        <!-- Estadísticas -->
        <div class="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Total Pedidos</p>
                <p class="text-3xl font-bold text-gray-900">{{ orders.length }}</p>
              </div>
              <div class="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Pendientes</p>
                <p class="text-3xl font-bold text-yellow-600">{{ pendingCount }}</p>
              </div>
              <div class="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Revisados</p>
                <p class="text-3xl font-bold text-blue-600">{{ reviewedCount }}</p>
              </div>
              <div class="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="card p-6">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-600 mb-1">Entregados</p>
                <p class="text-3xl font-bold text-green-600">{{ deliveredCount }}</p>
              </div>
              <div class="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros -->
        <div class="card p-4 mb-6">
          <div class="flex flex-wrap items-center gap-4">
            <div>
              <label class="text-sm font-semibold text-gray-700 mr-2">Filtrar por estado:</label>
              <select v-model="filterStatus" class="select-field w-auto">
                <option value="">Todos</option>
                <option value="pendiente">Pendientes</option>
                <option value="revisado">Revisados</option>
                <option value="entregado">Entregados</option>
              </select>
            </div>
            <button @click="loadOrders" class="btn-outline">
              🔄 Actualizar
            </button>
          </div>
        </div>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p class="mt-4 text-gray-600">Cargando pedidos...</p>
        </div>

        <!-- Lista de pedidos -->
        <div v-else-if="filteredOrders.length > 0" class="space-y-4">
          <div
            v-for="order in filteredOrders"
            :key="order.id"
            class="card p-6"
          >
            <div class="grid grid-cols-1 lg:grid-cols-4 gap-6">
              <!-- Información del pedido -->
              <div class="lg:col-span-3">
                <div class="flex items-start justify-between mb-4">
                  <div>
                    <h3 class="text-xl font-bold text-gray-900 mb-1">
                      {{ order.player_name }}
                    </h3>
                    <p class="text-gray-600">{{ order.team }}</p>
                  </div>
                  <span
                    :class="[
                      'px-3 py-1 rounded-full text-sm font-semibold',
                      order.status === 'pendiente' ? 'bg-yellow-100 text-yellow-800' :
                      order.status === 'revisado' ? 'bg-blue-100 text-blue-800' :
                      'bg-green-100 text-green-800'
                    ]"
                  >
                    {{ order.status }}
                  </span>
                </div>

                <div class="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <p class="text-sm text-gray-600">Jugador/a</p>
                    <p class="font-semibold text-gray-900">{{ order.player_name }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Equipo</p>
                    <p class="font-semibold text-gray-900">{{ order.team }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Padre/Madre</p>
                    <p class="font-semibold text-gray-900">{{ order.parent_name }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Email</p>
                    <p class="font-semibold text-gray-900">{{ order.email }}</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Total</p>
                    <p class="font-bold text-orange-600 text-lg">{{ order.total?.toFixed(2) }}€</p>
                  </div>
                  <div>
                    <p class="text-sm text-gray-600">Fecha</p>
                    <p class="font-semibold text-gray-900">
                      {{ order.created ? new Date(order.created).toLocaleDateString('es-ES') : 'N/A' }}
                    </p>
                  </div>
                </div>

                <!-- Productos -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <p class="text-sm font-semibold text-gray-700 mb-2">Productos:</p>
                  <ul class="space-y-2">
                    <li
                      v-for="(product, index) in order.items"
                      :key="index"
                      class="text-sm text-gray-700 flex justify-between"
                    >
                      <span>
                        {{ product.name }} x{{ product.quantity }}
                        <span v-if="product.options.talla" class="text-gray-500">
                          ({{ product.options.talla }}
                          <span v-if="product.options.genero">, {{ product.options.genero }}</span>
                          <span v-if="product.options.numero">, #{{ product.options.numero }}</span>
                          <span v-if="product.options.nombre">, {{ product.options.nombre }}</span>)
                        </span>
                      </span>
                      <span class="font-semibold">
                        {{ (product.price * product.quantity).toFixed(2) }}€
                      </span>
                    </li>
                  </ul>
                </div>
              </div>

              <!-- Acciones -->
              <div class="lg:col-span-1 space-y-3">
                <select
                  :value="order.status"
                  @change="updateStatus(order.id!, ($event.target as HTMLSelectElement).value)"
                  class="select-field w-full"
                >
                  <option value="pendiente">Pendiente</option>
                  <option value="revisado">Revisado</option>
                  <option value="entregado">Entregado</option>
                </select>

                <button
                  v-if="order.proof"
                  @click="viewProof(order)"
                  class="btn-outline w-full text-sm"
                >
                  📎 Ver Comprobante
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- No hay pedidos -->
        <div v-else class="text-center py-12">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
          </svg>
          <p class="text-gray-600">No hay pedidos que mostrar</p>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import type { Order, OrderStatus } from '~/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '~/types';

const { loginAdmin, logoutAdmin, isAuthenticated, getOrders, updateOrderStatus, getFileUrl } = useSupabase();

// Estado de autenticación
const loginForm = ref({
  email: '',
  password: '',
});
const loggingIn = ref(false);
const loginError = ref('');

// Estado de pedidos
const orders = ref<Order[]>([]);
const loading = ref(false);
const filterStatus = ref('');

// Contadores actualizados con los nuevos estados
const pendingCount = computed(() => orders.value.filter(o => o.status === 'en_revision').length);
const reviewedCount = computed(() => orders.value.filter(o => o.status === 'revisado').length);
const readyCount = computed(() => orders.value.filter(o => o.status === 'preparado').length);
const completedCount = computed(() => orders.value.filter(o => o.status === 'recogido').length);

// Pedidos filtrados
const filteredOrders = computed(() => {
  if (!filterStatus.value) return orders.value;
  return orders.value.filter(o => o.status === filterStatus.value);
});

// Login
const handleLogin = async () => {
  loggingIn.value = true;
  loginError.value = '';

  try {
    const success = await loginAdmin(loginForm.value.email, loginForm.value.password);
    
    if (success) {
      await loadOrders();
    } else {
      loginError.value = 'Email o contraseña incorrectos';
    }
  } catch (error) {
    loginError.value = 'Error al iniciar sesión';
  } finally {
    loggingIn.value = false;
  }
};

// Logout
const handleLogout = () => {
  logoutAdmin();
  orders.value = [];
};

// Cargar pedidos
const loadOrders = async () => {
  loading.value = true;
  try {
    orders.value = await getOrders();
  } catch (error) {
    console.error('Error loading orders:', error);
  } finally {
    loading.value = false;
  }
};

// Actualizar estado
const updateStatus = async (orderId: string, newStatus: string) => {
  const success = await updateOrderStatus(orderId, newStatus);
  if (success) {
    const order = orders.value.find(o => o.id === orderId);
    if (order) {
      order.status = newStatus as any;
    }
  } else {
    alert('Error al actualizar el estado del pedido');
  }
};

// Ver comprobante
const viewProof = (order: Order) => {
  if (order.payment_proof && order.id) {
    const url = getFileUrl(order, order.payment_proof as string);
    window.open(url, '_blank');
  }
};

// Cargar pedidos al montar si está autenticado
onMounted(() => {
  if (isAuthenticated()) {
    loadOrders();
  }
});
</script>
