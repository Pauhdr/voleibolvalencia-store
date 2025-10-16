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
      <header class="bg-white">
        <div class="container-custom py-4 flex items-center justify-between">
          <div>
            <h1 class="text-2xl font-display font-bold text-gray-900">
              Panel de Administración
            </h1>
            <p class="text-sm text-gray-600">Gestión del club</p>
          </div>
          <button @click="handleLogout" class="btn-secondary">
            Cerrar Sesión
          </button>
        </div>
        
        <!-- Pestañas -->
        <div class="container-custom mt-4">
          <div class="flex border-b border-gray-200">
            <button
              @click="activeTab = 'orders'"
              :class="[
                'px-6 py-3 font-semibold transition-colors border-b-2 flex items-center gap-2',
                activeTab === 'orders'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-orange-600'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
              Pedidos
            </button>
            <button
              @click="activeTab = 'products'"
              :class="[
                'px-6 py-3 font-semibold transition-colors border-b-2 flex items-center gap-2',
                activeTab === 'products'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-orange-600'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
              </svg>
              Productos
            </button>
          </div>
        </div>
      </header>

      <!-- Contenido principal -->
      <main class="container-custom py-8">
        <!-- TAB: PEDIDOS -->
        <div v-if="activeTab === 'orders'">
          <!-- Estadísticas -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8">
          <div class="card px-6 py-4 relative">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-5xl font-bold text-gray-600">{{ pendingCount }}</p>
                <p class="text-sm text-gray-600 mb-1">Pendientes</p>
              </div>
              <div class="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center absolute top-4 right-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="card px-6 py-4 relative">
            <div class="flex items-center justify-between">
              <div>
                <p class="text-5xl font-bold text-yellow-600">{{ reviewedCount }}</p>
                <p class="text-sm text-gray-600 mb-1">Revisados</p>
              </div>
              <div class="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center absolute top-4 right-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div class="card px-6 py-4 relative">
            <div class="flex items-center justify-between">
              <div class="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center absolute top-4 right-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div class="flex items-start gap-2 flex-col">
                <p class="text-5xl font-bold text-blue-600">{{ preparedCount }}</p>
                <p class="text-sm text-gray-600 mb-1">Preparados</p>
              </div>
            </div>
          </div>

          <div class="card px-6 py-4 relative">
            <div class="flex items-end justify-between h-full">
              <div class="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center absolute top-4 right-4">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div class="flex items-start gap-2 flex-col">
                <p class="text-5xl font-bold text-green-600">{{ deliveredCount }}</p>
                <p class="text-sm text-gray-600 mb-1">Entregados</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Filtros y Acciones -->
        <div class="card p-4 mb-6">
          <div class="flex flex-wrap items-center gap-4">
            <div class="flex flex-col items-start mr-auto">
              <label class="text-sm font-semibold text-gray-700 mr-2">Filtrar por estado:</label>
              <select v-model="filterStatus" class="select-field w-auto">
                <option value="">Todos</option>
                <option value="en_revision">En Revisión</option>
                <option value="revisado">Revisado</option>
                <option value="pedido">Pedido Realizado</option>
                <option value="preparado">Preparado</option>
                <option value="recogido">Recogido</option>
                <option value="cancelado">Cancelado</option>
              </select>
            </div>
            <button @click="loadOrders" class="btn-outline flex items-center gap-2 md:ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              
            </button>
            <button 
              @click="exportToExcel" 
              class="btn-primary flex items-center gap-2 "
              :disabled="filteredOrders.length === 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
          </div>
        </div>

        <!-- Barra de acciones para pedidos seleccionados -->
        <transition
          enter-active-class="transition-all duration-200 ease-out"
          enter-from-class="opacity-0 -translate-y-2"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in"
          leave-from-class="opacity-100 translate-y-0"
          leave-to-class="opacity-0 -translate-y-2"
        >
          <div v-if="selectedOrders.length > 0" class="fixed md:relative bottom-0 left-0 right-0 z-50 md:z-auto">
            <div class="card p-4 mb-0 md:mb-6 bg-orange-50 border-2 border-orange-200 rounded-none md:rounded-lg shadow-lg md:shadow-sm">
              <div class="flex flex-col md:flex-row md:flex-wrap items-stretch md:items-center gap-3 md:gap-4">
                <div class="flex items-center gap-2 justify-center md:justify-start">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-semibold text-gray-900 text-sm md:text-base">{{ selectedOrders.length }} pedido(s) seleccionado(s)</span>
                </div>
                
                <div class="flex flex-col md:flex-row items-stretch md:items-center gap-2 md:gap-2 md:ml-auto">
                  <div class="flex items-center gap-2">
                    <label class="text-xs md:text-sm font-semibold text-gray-700 whitespace-nowrap">Cambiar a:</label>
                    <select v-model="bulkStatusChange" class="select-field w-full md:w-auto text-sm">
                      <option value="">Seleccionar...</option>
                      <option value="en_revision">En Revisión</option>
                      <option value="revisado">Revisado</option>
                      <option value="pedido">Pedido Realizado</option>
                      <option value="preparado">Preparado</option>
                      <option value="recogido">Recogido</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div class="flex gap-2">
                    <button 
                      @click="applyBulkStatusChange"
                      :disabled="!bulkStatusChange"
                      class="btn-primary flex-1 md:flex-initial text-sm"
                    >
                      Aplicar
                    </button>
                    <button 
                      @click="clearSelection"
                      class="btn-outline flex-1 md:flex-initial text-sm"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </transition>

        <!-- Loading -->
        <div v-if="loading" class="text-center py-12">
          <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
          <p class="mt-4 text-gray-600">Cargando pedidos...</p>
        </div>

        <!-- Lista de pedidos -->
        <div 
          v-else-if="filteredOrders.length > 0" 
          class="space-y-3"
          :class="{ 'pb-48 md:pb-0': selectedOrders.length > 0 }"
        >
          <div
            v-for="order in paginatedOrders"
            :key="order.id"
            class="card overflow-hidden"
          >
            <!-- Fila principal (siempre visible) -->
            <div 
              class="p-4 flex items-center gap-4 transition-colors relative"
            >
              <!-- Checkbox de selección -->
              <input
                type="checkbox"
                :checked="selectedOrders.includes(order.id!)"
                @change="toggleOrderSelection(order.id!)"
                @click.stop
                class="appearance-none w-5 h-5 border border-gray-200 checked:border-orange-500 rounded focus:ring-orange-500 checked:bg-orange-500 flex-shrink-0"
              />

              <!-- Botón expandir/colapsar -->
              <button 
                @click="toggleOrderDetails(order.id!)"
                class="flex-shrink-0 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  class="h-5 w-5 transition-transform duration-200"
                  :class="{ 'rotate-90': expandedOrders.includes(order.id!) }"
                  fill="none" 
                  viewBox="0 0 24 24" 
                  stroke="currentColor"
                >
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>

              <!-- Información principal -->
              <div class="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3 items-center">
                <!-- Nombre jugador -->
                <div class="min-w-0">
                  <p class="text-sm md:text-md font-semibold text-gray-900 truncate">{{ order.player_name }}</p>
                  <p class="text-sm text-gray-500 truncate">{{ order.team }}</p>
                </div>

                <!-- Email -->
                <div class="min-w-0 hidden md:block">
                  <p class="text-sm text-gray-600 truncate">{{ order.email }}</p>
                  <p class="text-xs text-gray-400">
                    {{ order.created ? new Date(order.created).toLocaleDateString('es-ES') : 'N/A' }}
                  </p>
                </div>

                <!-- Total -->
                <div class="min-w-0 hidden md:block">
                  <p class="font-bold text-orange-600">{{ order.total?.toFixed(2) }}€</p>
                  <p class="text-xs text-gray-500 hidden md:block">{{ order.items?.length || 0 }} producto(s)</p>
                </div>

                <!-- Estado (badge) -->
                <div class="min-w-0 flex items-center gap-2 absolute right-4 top-4">
                  <span
                    class="inline-flex items-center px-3 py-1.5 rounded-full text-[0.65rem] font-semibold"
                    :class="{
                      'bg-gray-100 text-gray-800': order.status === 'en_revision',
                      'bg-yellow-100 text-yellow-800': order.status === 'revisado',
                      'bg-purple-100 text-purple-800': order.status === 'pedido',
                      'bg-blue-100 text-blue-800': order.status === 'preparado',
                      'bg-green-100 text-green-800': order.status === 'recogido',
                      'bg-red-100 text-red-800': order.status === 'cancelado'
                    }"
                  >
                    {{ getStatusLabel(order.status) }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Detalles expandibles -->
            <transition
              enter-active-class="transition-all duration-200 ease-out"
              enter-from-class="opacity-0 max-h-0"
              enter-to-class="opacity-100 max-h-[2000px]"
              leave-active-class="transition-all duration-200 ease-in"
              leave-from-class="opacity-100 max-h-[2000px]"
              leave-to-class="opacity-0 max-h-0"
            >
              <div v-if="expandedOrders.includes(order.id!)" class="border-t border-gray-200 bg-white">
                <div class="p-6 space-y-6">
                  <!-- Información del pedido -->
                  <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Jugador/a</p>
                      <p class="font-semibold text-gray-900">{{ order.player_name }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Equipo</p>
                      <p class="font-semibold text-gray-900">{{ order.team }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Padre/Madre</p>
                      <p class="font-semibold text-gray-900">{{ order.parent_name }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p class="font-semibold text-gray-900">{{ order.email }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                      <p class="font-bold text-orange-600 text-lg">{{ order.total?.toFixed(2) }}€</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Fecha</p>
                      <p class="font-semibold text-gray-900">
                        {{ order.created ? new Date(order.created).toLocaleDateString('es-ES', { 
                          day: 'numeric', 
                          month: 'long', 
                          year: 'numeric' 
                        }) : 'N/A' }}
                      </p>
                    </div>
                  </div>

                  <!-- Productos -->
                  <div>
                    <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      Productos del pedido
                    </h4>
                    <div class="bg-white rounded-lg border border-gray-200 divide-y divide-gray-200">
                      <div
                        v-for="(product, index) in order.items"
                        :key="index"
                        class="p-4 hover:bg-gray-50 transition-colors"
                      >
                        <div class="flex justify-between items-start gap-4">
                          <div class="flex-1">
                            <p class="font-semibold text-gray-900">{{ product.name }}</p>
                            <div v-if="product.options && Object.keys(product.options).length > 0" class="mt-1 flex flex-wrap gap-2">
                              <span v-if="product.options.talla" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                Talla: {{ product.options.talla }}
                              </span>
                              <span v-if="product.options.genero" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                                {{ product.options.genero }}
                              </span>
                              <span v-if="product.options.numero" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                #{{ product.options.numero }}
                              </span>
                              <span v-if="product.options.nombre" class="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-orange-100 text-orange-800">
                                {{ product.options.nombre }}
                              </span>
                            </div>
                          </div>
                          <div class="text-right flex-shrink-0">
                            <p class="font-semibold text-gray-900">{{ (product.price * product.quantity).toFixed(2) }}€</p>
                            <p class="text-sm text-gray-500">{{ product.price.toFixed(2) }}€ × {{ product.quantity }}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <!-- Botón ver comprobante -->
                  <div v-if="order.proof" class="flex justify-end">
                    <button
                      @click="viewProof(order)"
                      class="btn-outline text-sm flex items-center gap-2"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                      Ver Comprobante de Pago
                    </button>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="filteredOrders.length > 0 && totalPages > 1" class="mt-6">
          <div class="card p-4">
            <div class="flex flex-col sm:flex-row items-center justify-between gap-4">
              <!-- Información de la página -->
              <div class="text-sm text-gray-600">
                Mostrando 
                <span class="font-semibold">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                -
                <span class="font-semibold">{{ Math.min(currentPage * itemsPerPage, filteredOrders.length) }}</span>
                de
                <span class="font-semibold">{{ filteredOrders.length }}</span>
                pedidos
              </div>

              <!-- Controles de paginación -->
              <div class="flex items-center gap-2">
                <!-- Botón anterior -->
                <button
                  @click="currentPage = Math.max(1, currentPage - 1)"
                  :disabled="currentPage === 1"
                  class="px-3 py-2 rounded-lg border transition-colors"
                  :class="currentPage === 1 
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed' 
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Números de página -->
                <div class="flex items-center gap-1">
                  <button
                    v-for="page in getPageNumbers()"
                    :key="page"
                    @click="typeof page === 'number' ? currentPage = page : null"
                    :disabled="typeof page !== 'number'"
                    class="min-w-[40px] px-3 py-2 rounded-lg border transition-colors text-sm font-medium"
                    :class="page === currentPage
                      ? 'bg-orange-600 text-white border-orange-600'
                      : typeof page === 'number'
                        ? 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                        : 'bg-white text-gray-400 border-gray-200 cursor-default'"
                  >
                    {{ page }}
                  </button>
                </div>

                <!-- Botón siguiente -->
                <button
                  @click="currentPage = Math.min(totalPages, currentPage + 1)"
                  :disabled="currentPage === totalPages"
                  class="px-3 py-2 rounded-lg border transition-colors"
                  :class="currentPage === totalPages
                    ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- Selector de items por página -->
              <div class="flex items-center gap-2 text-sm">
                <label class="text-gray-600">Por página:</label>
                <select 
                  v-model="itemsPerPage" 
                  @change="currentPage = 1"
                  class="select-field py-1 text-sm"
                >
                  <option :value="5">5</option>
                  <option :value="10">10</option>
                  <option :value="20">20</option>
                  <option :value="50">50</option>
                  <option :value="100">100</option>
                </select>
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
        </div>
        <!-- FIN TAB PEDIDOS -->

        <!-- TAB: PRODUCTOS -->
        <div v-if="activeTab === 'products'" class="space-y-6">
          <!-- Botón crear producto -->
          <div class="flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">Gestión de Productos</h2>
            <button @click="openProductModal()" class="btn-primary flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Nuevo Producto
            </button>
          </div>

          <!-- Loading productos -->
          <div v-if="loadingProducts" class="text-center py-12">
            <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600"></div>
            <p class="mt-4 text-gray-600">Cargando productos...</p>
          </div>

          <!-- Lista de productos -->
          <div v-else-if="products.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div
              v-for="product in products"
              :key="product.id"
              class="card p-6"
            >
              <!-- Imagen del producto -->
              <div class="aspect-square bg-gray-100 rounded-lg mb-4 overflow-hidden">
                <img
                  v-if="product.image"
                  :src="product.image"
                  :alt="product.name"
                  class="w-full h-full object-cover"
                />
                <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>

              <!-- Info del producto -->
              <h3 class="text-lg font-bold text-gray-900 mb-2">{{ product.name }}</h3>
              <p class="text-gray-600 text-sm mb-3 line-clamp-2">{{ product.description }}</p>
              <p class="text-2xl font-bold text-orange-600 mb-4">{{ product.price?.toFixed(2) }}€</p>

              <!-- Opciones disponibles -->
              <div v-if="product.options" class="bg-gray-50 p-3 rounded mb-4 text-sm">
                <p class="font-semibold text-gray-700 mb-1">Opciones:</p>
                <div class="space-y-1 text-gray-600">
                  <p v-if="product.options.hasTalla">✓ Tallas: {{ product.options.tallas?.join(', ') }}</p>
                  <p v-if="product.options.hasGenero">✓ Géneros disponibles</p>
                  <p v-if="product.options.hasNumero">✓ Dorsal personalizable</p>
                  <p v-if="product.options.hasNombre">✓ Nombre personalizable</p>
                </div>
              </div>

              <!-- Botones de acción -->
              <div class="flex gap-2">
                <button
                  @click="openProductModal(product)"
                  class="btn-outline flex-1 text-sm flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                  Editar
                </button>
                <button
                  @click="confirmDeleteProduct(product)"
                  class="btn-outline flex-1 text-sm text-red-600 hover:bg-red-50 flex items-center justify-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Eliminar
                </button>
              </div>
            </div>
          </div>

          <!-- No hay productos -->
          <div v-else class="text-center py-12">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
            </svg>
            <p class="text-gray-600 mb-4">No hay productos creados</p>
            <button @click="openProductModal()" class="btn-primary flex items-center gap-2 mx-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Crear primer producto
            </button>
          </div>
        </div>
        <!-- FIN TAB PRODUCTOS -->
      </main>

      <!-- Modal de Producto -->
      <div
        v-if="showProductModal"
        class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        @click.self="closeProductModal"
      >
        <div class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <!-- Header del modal -->
          <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
            <h2 class="text-2xl font-bold text-gray-900">
              {{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}
            </h2>
            <button @click="closeProductModal" class="text-gray-400 hover:text-gray-600">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <!-- Formulario del producto -->
          <form @submit.prevent="saveProduct" class="p-6 space-y-6">
            <!-- Información básica -->
            <div class="space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Información Básica</h3>
              
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Nombre del Producto *
                </label>
                <input
                  v-model="productForm.name"
                  type="text"
                  required
                  class="input-field"
                  placeholder="Ej: Sudadera Club 40 Aniversario"
                />
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Descripción
                </label>
                <textarea
                  v-model="productForm.description"
                  rows="3"
                  class="input-field"
                  placeholder="Descripción del producto..."
                ></textarea>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Precio (€) *
                  </label>
                  <input
                    v-model.number="productForm.price"
                    type="number"
                    step="0.01"
                    min="0"
                    required
                    class="input-field"
                    placeholder="35.00"
                  />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Categoría
                  </label>
                  <select v-model="productForm.category" class="select-field">
                    <option value="">Sin categoría</option>
                    <option value="camisetas">Camisetas</option>
                    <option value="sudaderas">Sudaderas</option>
                    <option value="pantalones">Pantalones</option>
                    <option value="complementos">Complementos</option>
                  </select>
                </div>
              </div>

              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Imagen del Producto
                </label>
                <input
                  type="file"
                  accept="image/*"
                  @change="handleImageUpload"
                  class="input-field"
                />
                <p class="text-xs text-gray-500 mt-1">Formatos: JPG, PNG, WEBP. Máximo 5MB</p>
                
                <!-- Preview de la imagen -->
                <div v-if="productForm.image || imagePreview" class="mt-3">
                  <img
                    :src="imagePreview || productForm.image"
                    alt="Preview"
                    class="w-32 h-32 object-cover rounded-lg border"
                  />
                </div>
              </div>
            </div>

            <!-- Opciones del producto -->
            <div class="border-t pt-6 space-y-4">
              <h3 class="text-lg font-semibold text-gray-900">Opciones de Configuración</h3>
              <p class="text-sm text-gray-600">Selecciona qué opciones tendrá disponible el producto</p>

              <!-- Tallas -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="flex items-center space-x-3 mb-3">
                  <input
                    v-model="productForm.options.hasTalla"
                    type="checkbox"
                    class="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span class="font-semibold text-gray-900">¿Tiene tallas?</span>
                </label>

                <div v-if="productForm.options.hasTalla" class="ml-8 space-y-3">
                  <p class="text-sm text-gray-600">Selecciona las tallas disponibles:</p>
                  <div class="grid grid-cols-4 gap-2">
                    <label
                      v-for="size in availableSizes"
                      :key="size"
                      class="flex items-center space-x-2"
                    >
                      <input
                        type="checkbox"
                        :value="size"
                        v-model="productForm.options.tallas"
                        class="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span class="text-sm">{{ size }}</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Géneros -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="flex items-center space-x-3 mb-3">
                  <input
                    v-model="productForm.options.hasGenero"
                    type="checkbox"
                    class="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span class="font-semibold text-gray-900">¿Tiene opciones de género?</span>
                </label>

                <div v-if="productForm.options.hasGenero" class="ml-8 space-y-3">
                  <p class="text-sm text-gray-600">Selecciona los géneros disponibles:</p>
                  <div class="flex gap-4">
                    <label class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value="Chico"
                        v-model="productForm.options.generos"
                        class="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span class="text-sm">Chico</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        value="Chica"
                        v-model="productForm.options.generos"
                        class="w-4 h-4 text-orange-600 rounded focus:ring-orange-500"
                      />
                      <span class="text-sm">Chica</span>
                    </label>
                  </div>
                </div>
              </div>

              <!-- Número de dorsal -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="flex items-center space-x-3">
                  <input
                    v-model="productForm.options.hasNumero"
                    type="checkbox"
                    class="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span class="font-semibold text-gray-900">¿Permite número de dorsal personalizado?</span>
                </label>
                <p v-if="productForm.options.hasNumero" class="ml-8 mt-2 text-sm text-gray-600">
                  El cliente podrá elegir el número que quiere en su camiseta
                </p>
              </div>

              <!-- Nombre personalizado -->
              <div class="bg-gray-50 p-4 rounded-lg">
                <label class="flex items-center space-x-3">
                  <input
                    v-model="productForm.options.hasNombre"
                    type="checkbox"
                    class="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span class="font-semibold text-gray-900">¿Permite nombre personalizado?</span>
                </label>
                <p v-if="productForm.options.hasNombre" class="ml-8 mt-2 text-sm text-gray-600">
                  El cliente podrá poner un nombre en su camiseta (ej: apellido del jugador)
                </p>
              </div>
            </div>

            <!-- Tabla de Tallas -->
            <div class="space-y-4 border-t pt-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Tabla de Tallas</h3>
                  <p class="text-sm text-gray-600">Define las medidas específicas para cada talla de este producto</p>
                </div>
                <label class="flex items-center space-x-3">
                  <input
                    v-model="productForm.size_chart.enabled"
                    type="checkbox"
                    class="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
                  />
                  <span class="font-semibold text-gray-900">Habilitar tabla</span>
                </label>
              </div>

              <div v-if="productForm.size_chart.enabled" class="space-y-4">
                <!-- Selector de unidad -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Unidad de medida
                  </label>
                  <div class="flex gap-4">
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="productForm.size_chart.unit"
                        type="radio"
                        value="cm"
                        class="w-4 h-4 text-orange-600"
                      />
                      <span>Centímetros (cm)</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="productForm.size_chart.unit"
                        type="radio"
                        value="inches"
                        class="w-4 h-4 text-orange-600"
                      />
                      <span>Pulgadas (inches)</span>
                    </label>
                  </div>
                </div>

                <!-- Selector de tipo de tabla -->
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">
                    Tipo de tabla
                  </label>
                  <div class="flex gap-4">
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="productForm.size_chart.hasSeparateGenders"
                        type="radio"
                        :value="false"
                        class="w-4 h-4 text-orange-600"
                      />
                      <span>Tabla única (unisex)</span>
                    </label>
                    <label class="flex items-center space-x-2">
                      <input
                        v-model="productForm.size_chart.hasSeparateGenders"
                        type="radio"
                        :value="true"
                        class="w-4 h-4 text-orange-600"
                      />
                      <span>Tablas separadas (chico/chica)</span>
                    </label>
                  </div>
                  <p class="text-xs text-gray-500 mt-1">
                    {{ productForm.size_chart.hasSeparateGenders 
                      ? 'Podrás definir medidas diferentes para chicos y chicas' 
                      : 'Una sola tabla de tallas para ambos géneros' }}
                  </p>
                </div>

                <!-- TABLA ÚNICA (unisex) -->
                <div v-if="!productForm.size_chart.hasSeparateGenders">
                <!-- Gestión de columnas (medidas) -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900">Medidas (Columnas)</h4>
                    <button
                      type="button"
                      @click="addSizeChartColumn"
                      class="btn-outline text-sm flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Añadir medida
                    </button>
                  </div>
                  
                  <div v-if="productForm.size_chart.columns.length > 0" class="space-y-2">
                    <div
                      v-for="(column, index) in productForm.size_chart.columns"
                      :key="column.id"
                      class="flex items-center gap-2"
                    >
                      <input
                        v-model="column.name"
                        type="text"
                        class="input-field flex-1"
                        placeholder="Ej: Pecho, Cintura, Largo..."
                      />
                      <button
                        type="button"
                        @click="removeSizeChartColumn(index)"
                        class="text-red-600 hover:text-red-800 p-2"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <p v-else class="text-sm text-gray-500 text-center py-2">
                    No hay medidas definidas. Haz clic en "Añadir medida" para empezar.
                  </p>
                </div>

                <!-- Gestión de tallas y medidas -->
                <div class="bg-gray-50 p-4 rounded-lg">
                  <div class="flex items-center justify-between mb-3">
                    <h4 class="font-semibold text-gray-900">Tallas y Medidas</h4>
                    <button
                      type="button"
                      @click="addSizeChartRow"
                      class="btn-outline text-sm flex items-center gap-1"
                      :disabled="productForm.size_chart.columns.length === 0"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Añadir talla
                    </button>
                  </div>

                  <div v-if="productForm.size_chart.columns.length === 0" class="text-sm text-gray-500 text-center py-4">
                    Primero define las medidas (columnas) antes de añadir tallas
                  </div>

                  <div v-else-if="productForm.size_chart.rows.length > 0" class="overflow-x-auto">
                    <table class="min-w-full bg-white border border-gray-200 rounded-lg">
                      <thead class="bg-gray-100">
                        <tr>
                          <th class="px-4 py-2 text-left text-sm font-semibold text-gray-700">Talla</th>
                          <th
                            v-for="column in productForm.size_chart.columns"
                            :key="column.id"
                            class="px-4 py-2 text-left text-sm font-semibold text-gray-700"
                          >
                            {{ column.name }}
                          </th>
                          <th class="px-4 py-2 w-20"></th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="(row, rowIndex) in productForm.size_chart.rows"
                          :key="rowIndex"
                          class="border-t border-gray-200"
                        >
                          <td class="px-4 py-2">
                            <input
                              v-model="row.size"
                              type="text"
                              class="input-field"
                              placeholder="S, M, L..."
                            />
                          </td>
                          <td
                            v-for="column in productForm.size_chart.columns"
                            :key="column.id"
                            class="px-4 py-2"
                          >
                            <input
                              v-model="row.measurements[column.id]"
                              type="text"
                              class="input-field"
                              :placeholder="`Ej: 45-48`"
                            />
                          </td>
                          <td class="px-4 py-2 text-center">
                            <button
                              type="button"
                              @click="removeSizeChartRow(rowIndex)"
                              class="text-red-600 hover:text-red-800"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                              </svg>
                            </button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div v-else class="text-sm text-gray-500 text-center py-2">
                    No hay tallas definidas. Haz clic en "Añadir talla" para empezar.
                  </div>
                </div>

                <!-- Preview de la tabla -->
                <div v-if="productForm.size_chart.rows.length > 0" class="bg-blue-50 p-4 rounded-lg">
                  <h4 class="font-semibold text-blue-900 mb-2">📏 Vista previa de la tabla</h4>
                  <p class="text-sm text-blue-700 mb-3">Esta tabla se mostrará a los clientes en la página del producto</p>
                  <div class="bg-white p-3 rounded border border-blue-200 overflow-x-auto">
                    <table class="min-w-full text-sm">
                      <thead>
                        <tr class="border-b-2 border-gray-300">
                          <th class="px-3 py-2 text-left font-bold">Talla</th>
                          <th
                            v-for="column in productForm.size_chart.columns"
                            :key="column.id"
                            class="px-3 py-2 text-left font-bold"
                          >
                            {{ column.name }} ({{ productForm.size_chart.unit }})
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr
                          v-for="row in productForm.size_chart.rows"
                          :key="row.size"
                          class="border-b border-gray-200"
                        >
                          <td class="px-3 py-2 font-semibold">{{ row.size }}</td>
                          <td
                            v-for="column in productForm.size_chart.columns"
                            :key="column.id"
                            class="px-3 py-2"
                          >
                            {{ row.measurements[column.id] || '-' }}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
                </div>
                <!-- FIN TABLA ÚNICA -->
              </div>
            </div>

            <!-- Botones del formulario -->
            <div class="flex gap-3 pt-4 border-t">
              <button
                type="button"
                @click="closeProductModal"
                class="btn-outline flex-1"
              >
                Cancelar
              </button>
              <button
                type="submit"
                :disabled="savingProduct"
                class="btn-primary flex-1"
              >
                <span v-if="savingProduct">Guardando...</span>
                <span v-else>{{ editingProduct ? 'Guardar Cambios' : 'Crear Producto' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import { useSupabase } from '~/composables/useSupabase';
import type { Order, OrderStatus, Product } from '~/types';
import { ORDER_STATUS_LABELS, ORDER_STATUS_COLORS } from '~/types';

// Usar layout específico para admin (sin navegación ni footer)
definePageMeta({
  layout: 'admin'
});

const { loginAdmin, logoutAdmin, getOrders, updateOrderStatus, getFileUrl, getProducts, createProduct, updateProduct, deleteProduct, uploadProductImage } = useSupabase();

// Estado de autenticación
const isAuthenticated = ref(false);
const loginForm = ref({
  email: '',
  password: '',
});
const loggingIn = ref(false);
const loginError = ref('');

// Estado de tabs
const activeTab = ref<'orders' | 'products'>('orders');

// Estado de pedidos
const orders = ref<Order[]>([]);
const loading = ref(false);
const filterStatus = ref('');
const expandedOrders = ref<string[]>([]); // IDs de pedidos expandidos
const selectedOrders = ref<string[]>([]); // IDs de pedidos seleccionados
const bulkStatusChange = ref(''); // Estado seleccionado para cambio masivo

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(3);

// Estado de productos
const products = ref<Product[]>([]);
const loadingProducts = ref(false);
const showProductModal = ref(false);
const editingProduct = ref<Product | null>(null);
const savingProduct = ref(false);
const imagePreview = ref<string>('');
const selectedImageFile = ref<File | null>(null);

// Tallas disponibles
const availableSizes = ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

// Formulario de producto
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  category: '',
  image: '',
  image_path: '',
  options: {
    hasTalla: false,
    hasGenero: false,
    hasNumero: false,
    hasNombre: false,
    tallas: [] as string[],
    generos: [] as string[],
  },
  size_chart: {
    enabled: false,
    unit: 'cm' as 'cm' | 'inches',
    hasSeparateGenders: false,
    columns: [] as Array<{ id: string; name: string }>,
    rows: [] as Array<{ size: string; measurements: Record<string, string> }>,
    boys: {
      columns: [] as Array<{ id: string; name: string }>,
      rows: [] as Array<{ size: string; measurements: Record<string, string> }>,
    },
    girls: {
      columns: [] as Array<{ id: string; name: string }>,
      rows: [] as Array<{ size: string; measurements: Record<string, string> }>,
    },
  },
});

// Contadores de pedidos por estado
const pendingCount = computed(() => orders.value.filter(o => o.status === 'en_revision').length);
const reviewedCount = computed(() => orders.value.filter(o => o.status === 'revisado').length);
const preparedCount = computed(() => orders.value.filter(o => o.status === 'preparado').length);
const deliveredCount = computed(() => orders.value.filter(o => o.status === 'recogido').length);

// Pedidos filtrados
const filteredOrders = computed(() => {
  if (!filterStatus.value) return orders.value;
  return orders.value.filter(o => o.status === filterStatus.value);
});

// Paginación de pedidos
const totalPages = computed(() => Math.ceil(filteredOrders.value.length / itemsPerPage.value));

const paginatedOrders = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value;
  const end = start + itemsPerPage.value;
  return filteredOrders.value.slice(start, end);
});

// Resetear página cuando cambia el filtro
watch(filterStatus, () => {
  currentPage.value = 1;
});

// Función para generar números de página con elipsis
const getPageNumbers = () => {
  const pages: (number | string)[] = [];
  const total = totalPages.value;
  const current = currentPage.value;

  if (total <= 7) {
    // Si hay 7 o menos páginas, mostrar todas
    for (let i = 1; i <= total; i++) {
      pages.push(i);
    }
  } else {
    // Siempre mostrar primera página
    pages.push(1);

    if (current > 3) {
      pages.push('...');
    }

    // Páginas alrededor de la actual
    const start = Math.max(2, current - 1);
    const end = Math.min(total - 1, current + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (current < total - 2) {
      pages.push('...');
    }

    // Siempre mostrar última página
    pages.push(total);
  }

  return pages;
};

// Login
const handleLogin = async () => {
  loggingIn.value = true;
  loginError.value = '';

  try {
    const success = await loginAdmin(loginForm.value.email, loginForm.value.password);
    
    if (success) {
      isAuthenticated.value = true;
      await loadOrders();
      await loadProducts();
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
const handleLogout = async () => {
  await logoutAdmin();
  isAuthenticated.value = false;
  orders.value = [];
  products.value = [];
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

// Función para obtener la etiqueta del estado
const getStatusLabel = (status: string) => {
  const statusLabels: Record<string, string> = {
    en_revision: 'En Revisión',
    revisado: 'Revisado',
    pedido: 'Pedido Realizado',
    preparado: 'Preparado',
    recogido: 'Recogido',
    cancelado: 'Cancelado',
  };
  return statusLabels[status] || status;
};

// Toggle selección de pedido
const toggleOrderSelection = (orderId: string) => {
  const index = selectedOrders.value.indexOf(orderId);
  if (index > -1) {
    selectedOrders.value.splice(index, 1);
  } else {
    selectedOrders.value.push(orderId);
  }
};

// Limpiar selección
const clearSelection = () => {
  selectedOrders.value = [];
  bulkStatusChange.value = '';
};

// Aplicar cambio de estado masivo
const applyBulkStatusChange = async () => {
  if (!bulkStatusChange.value || selectedOrders.value.length === 0) {
    return;
  }

  const confirmMsg = `¿Estás seguro de que quieres cambiar el estado de ${selectedOrders.value.length} pedido(s) a "${getStatusLabel(bulkStatusChange.value)}"?`;
  
  if (!confirm(confirmMsg)) {
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const orderId of selectedOrders.value) {
    const success = await updateOrderStatus(orderId, bulkStatusChange.value);
    if (success) {
      const order = orders.value.find(o => o.id === orderId);
      if (order) {
        order.status = bulkStatusChange.value as any;
      }
      successCount++;
    } else {
      errorCount++;
    }
  }

  if (errorCount === 0) {
    alert(`Se actualizaron correctamente ${successCount} pedido(s)`);
  } else {
    alert(`Se actualizaron ${successCount} pedido(s). ${errorCount} fallaron.`);
  }

  clearSelection();
};

// Ver comprobante
const viewProof = (order: Order) => {
  if (order.payment_proof && order.id) {
    const url = getFileUrl(order, order.payment_proof as string);
    window.open(url, '_blank');
  }
};

// Exportar pedidos a Excel
const exportToExcel = () => {
  if (filteredOrders.value.length === 0) {
    alert('No hay pedidos para exportar');
    return;
  }

  try {
    // Preparar los datos para Excel - FORMATO PARA FABRICACIÓN
    const excelData: any[] = [];

    // Encabezados
    const headers = [
      'Producto',
      'Talla',
      'Género',
      'Número Dorsal',
      'Nombre/Texto',
      'Cantidad',
    ];
    excelData.push(headers);

    // Recorrer todos los pedidos filtrados
    filteredOrders.value.forEach((order) => {
      // Estados en español
      const estadoMap: Record<string, string> = {
        en_revision: 'En Revisión',
        revisado: 'Revisado',
        pedido: 'Pedido Realizado',
        preparado: 'Preparado',
        recogido: 'Recogido',
        cancelado: 'Cancelado',
      };
      const estado = estadoMap[order.status || ''] || order.status || 'N/A';

      // Fecha formateada
      const fecha = order.created 
        ? new Date(order.created).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'N/A';

      // Recorrer cada producto del pedido
      order.items?.forEach((item) => {
        // Para cada unidad del producto (si cantidad > 1, crear múltiples filas)
        for (let i = 0; i < item.quantity; i++) {
          const fila = [
            item.name || 'Sin nombre',
            item.options?.talla || '-',
            item.options?.genero || '-',
            item.options?.numero || '-',
            item.options?.nombre || '-',
            1
          ];
          excelData.push(fila);
        }
      });
    });

    // Crear el contenido CSV
    const csvContent = excelData
      .map((row) =>
        row.map((cell: any) => {
          // Escapar comillas dobles y envolver en comillas si contiene comas, saltos de línea o comillas
          const cellStr = String(cell);
          if (cellStr.includes(',') || cellStr.includes('\n') || cellStr.includes('"')) {
            return `"${cellStr.replace(/"/g, '""')}"`;
          }
          return cellStr;
        }).join(',')
      )
      .join('\n');

    // Crear el Blob con BOM para UTF-8 (para que Excel reconozca los acentos)
    const BOM = '\uFEFF';
    const blob = new Blob([BOM + csvContent], { type: 'text/csv;charset=utf-8;' });

    // Crear enlace de descarga
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    
    // Nombre del archivo con fecha y filtro
    const fechaActual = new Date().toISOString().split('T')[0];
    const filtroNombre = filterStatus.value 
      ? `_${filterStatus.value}`
      : '_todos';
    link.setAttribute('download', `pedidos${filtroNombre}_${fechaActual}.csv`);
    
    // Descargar
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    // alert(`Archivo exportado correctamente con ${excelData.length - 1} productos para fabricación`);
  } catch (error) {
    console.error('Error al exportar:', error);
    alert('Error al exportar los pedidos');
  }
};

// Alternar detalles del pedido
const toggleOrderDetails = (orderId: string) => {
  const index = expandedOrders.value.indexOf(orderId);
  if (index > -1) {
    expandedOrders.value.splice(index, 1);
  } else {
    expandedOrders.value.push(orderId);
  }
};

// ============ FUNCIONES DE PRODUCTOS ============

// Cargar productos
const loadProducts = async () => {
  loadingProducts.value = true;
  try {
    products.value = await getProducts();
  } catch (error) {
    console.error('Error loading products:', error);
    alert('Error al cargar los productos');
  } finally {
    loadingProducts.value = false;
  }
};

// Abrir modal de producto (crear o editar)
const openProductModal = (product?: Product) => {
  if (product) {
    // Editar producto existente
    editingProduct.value = product;
    productForm.value = {
      name: product.name || '',
      description: product.description || '',
      price: product.price || 0,
      category: product.category || '',
      image: product.image || '',
      image_path: product.image_path || '',
      options: {
        hasTalla: product.options?.hasTalla || false,
        hasGenero: product.options?.hasGenero || false,
        hasNumero: product.options?.hasNumero || false,
        hasNombre: product.options?.hasNombre || false,
        tallas: product.options?.tallas || [],
        generos: product.options?.generos || [],
      },
      size_chart: product.size_chart || {
        enabled: false,
        unit: 'cm',
        columns: [],
        rows: [],
      },
    };
    imagePreview.value = product.image || '';
  } else {
    // Nuevo producto
    editingProduct.value = null;
    resetProductForm();
  }
  showProductModal.value = true;
};

// Cerrar modal
const closeProductModal = () => {
  showProductModal.value = false;
  editingProduct.value = null;
  resetProductForm();
  imagePreview.value = '';
  selectedImageFile.value = null;
};

// Resetear formulario
const resetProductForm = () => {
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    category: '',
    image: '',
    image_path: '',
    options: {
      hasTalla: false,
      hasGenero: false,
      hasNumero: false,
      hasNombre: false,
      tallas: [],
      generos: [],
    },
    size_chart: {
      enabled: false,
      unit: 'cm',
      columns: [],
      rows: [],
    },
  };
};

// Manejar subida de imagen
const handleImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    // Validar tamaño (máx 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }

    // Validar tipo
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    selectedImageFile.value = file;

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      imagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

// ============ FUNCIONES DE TABLA DE TALLAS ============

// Añadir columna (medida) a la tabla de tallas
const addSizeChartColumn = () => {
  const columnId = `col_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  productForm.value.size_chart.columns.push({
    id: columnId,
    name: '',
  });
};

// Eliminar columna de la tabla de tallas
const removeSizeChartColumn = (index: number) => {
  const columnId = productForm.value.size_chart.columns[index].id;
  productForm.value.size_chart.columns.splice(index, 1);
  
  // Eliminar las medidas de esta columna en todas las filas
  productForm.value.size_chart.rows.forEach(row => {
    delete row.measurements[columnId];
  });
};

// Añadir fila (talla) a la tabla de tallas
const addSizeChartRow = () => {
  const measurements: Record<string, string> = {};
  // Inicializar medidas vacías para cada columna
  productForm.value.size_chart.columns.forEach(column => {
    measurements[column.id] = '';
  });
  
  productForm.value.size_chart.rows.push({
    size: '',
    measurements,
  });
};

// Eliminar fila de la tabla de tallas
const removeSizeChartRow = (index: number) => {
  productForm.value.size_chart.rows.splice(index, 1);
};

// ============ FIN FUNCIONES DE TABLA DE TALLAS ============

// Guardar producto (crear o actualizar)
const saveProduct = async () => {
  savingProduct.value = true;

  try {
    // Preparar los datos del producto
    const productData: any = {
      name: productForm.value.name,
      description: productForm.value.description,
      price: productForm.value.price,
      category: productForm.value.category,
      options: {
        hasTalla: productForm.value.options.hasTalla,
        hasGenero: productForm.value.options.hasGenero,
        hasNumero: productForm.value.options.hasNumero,
        hasNombre: productForm.value.options.hasNombre,
        tallas: productForm.value.options.hasTalla ? productForm.value.options.tallas : [],
        generos: productForm.value.options.hasGenero ? productForm.value.options.generos : [],
      },
      size_chart: productForm.value.size_chart.enabled ? productForm.value.size_chart : null,
    };

    // Si hay una imagen nueva seleccionada, subirla primero
    if (selectedImageFile.value) {
      console.log('Subiendo imagen...', selectedImageFile.value);
      const imagePath = await uploadProductImage(selectedImageFile.value);
      
      if (imagePath) {
        productData.image_path = imagePath;
      } else {
        alert('Error al subir la imagen');
        savingProduct.value = false;
        return;
      }
    } else if (editingProduct.value?.image_path) {
      // Mantener la imagen existente
      productData.image_path = editingProduct.value.image_path;
    }

    let success = false;

    if (editingProduct.value?.id) {
      // Actualizar producto existente
      success = await updateProduct(editingProduct.value.id, productData);
    } else {
      // Crear nuevo producto
      success = await createProduct(productData);
    }

    if (success) {
      alert(editingProduct.value ? 'Producto actualizado correctamente' : 'Producto creado correctamente');
      closeProductModal();
      await loadProducts();
    } else {
      alert('Error al guardar el producto');
    }
  } catch (error) {
    console.error('Error saving product:', error);
    alert('Error al guardar el producto');
  } finally {
    savingProduct.value = false;
  }
};

// Confirmar eliminación de producto
const confirmDeleteProduct = (product: Product) => {
  if (confirm(`¿Estás seguro de que quieres eliminar "${product.name}"?`)) {
    deleteProductById(product.id!);
  }
};

// Eliminar producto
const deleteProductById = async (productId: string) => {
  try {
    const success = await deleteProduct(productId);
    if (success) {
      alert('Producto eliminado correctamente');
      await loadProducts();
    } else {
      alert('Error al eliminar el producto');
    }
  } catch (error) {
    console.error('Error deleting product:', error);
    alert('Error al eliminar el producto');
  }
};

// Cargar pedidos y productos al montar si está autenticado
onMounted(async () => {
  // Verificar si hay sesión activa
  const { data } = await useSupabase().supabase.auth.getSession();
  if (data.session) {
    isAuthenticated.value = true;
    await loadOrders();
    await loadProducts();
  }
});
</script>
