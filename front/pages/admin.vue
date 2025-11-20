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
          <button 
            @click="handleLogout" 
            class="p-3 rounded-lg hover:bg-gray-100 transition-colors group relative"
            title="Cerrar sesión"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-gray-700 group-hover:text-red-600 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
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
        <div class="p-2 mb-6 border-b flex">
          <h3 class="text-xl font-bold mr-auto">Listado de pedidos</h3>
          

          <!-- Select en Desktop y botones -->
          <div class="flex flex-wrap items-center gap-4">
            <div class="hidden md:flex flex-col items-start mr-auto">
              <!-- <label class="text-sm font-semibold text-gray-700 mr-2 mb-1">Filtrar por estado:</label> -->
              <select v-model="filterStatus" class="select-field w-auto">
                
                <option value="">Todos</option>
                <option value="en_revision">{{ ORDER_STATUS_LABELS.en_revision }}</option>
                <option value="revisado">{{ ORDER_STATUS_LABELS.revisado }}</option>
                <option value="pedido">{{ ORDER_STATUS_LABELS.pedido }}</option>
                <option value="preparado">{{ ORDER_STATUS_LABELS.preparado }}</option>
                <option value="recogido">{{ ORDER_STATUS_LABELS.recogido }}</option>
                <option value="cancelado">{{ ORDER_STATUS_LABELS.cancelado }}</option>
              </select>
            </div>
            <button @click="loadOrders" class="flex items-center gap-2 md:ml-auto">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              
            </button>
            <button 
              @click="exportToExcel" 
              class="bg-zinc-900 text-white p-1 rounded px-2 flex items-center gap-2 text-sm"
              :disabled="filteredOrders.length === 0"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Excel
            </button>
          </div>
        </div>
<!-- Pills en Mobile -->
          <div class="md:hidden mb-4 ">
            <!-- <label class="text-sm font-semibold text-gray-700 mb-3 block">Filtrar por estado:</label> -->
            <div class="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <!-- Todos -->
              <button
                @click="filterStatus = ''"
                :class="[
                  'rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  filterStatus === ''
                    ? 'bg-orange-600 text-white px-4 py-2'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 p-2'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="filterStatus === '' ? 'text-white' : 'text-orange-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                <template v-if="filterStatus === ''">
                  <span>Todos</span>
                </template>
              </button>

              <!-- En Revisión -->
              <button
                @click="filterStatus = 'en_revision'"
                :class="[
                  'rounded-lg text-sm font-medium transition-all flex items-center gap-2 w-fit',
                  filterStatus === 'en_revision'
                    ? 'bg-gray-600 text-white px-4 py-2'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 p-2'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="filterStatus === 'en_revision' ? 'text-white' : 'text-gray-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <template v-if="filterStatus === 'en_revision'">
                  <span class="text-nowrap">{{ ORDER_STATUS_LABELS.en_revision }}</span>
                </template>
              </button>

              <!-- Revisado -->
              <button
                @click="filterStatus = 'revisado'"
                :class="[
                  'rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  filterStatus === 'revisado'
                    ? 'bg-yellow-500 text-white px-4 py-2'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 p-2'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="filterStatus === 'revisado' ? 'text-white' : 'text-yellow-500'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
                <template v-if="filterStatus === 'revisado'">
                  <span>{{ ORDER_STATUS_LABELS.revisado }}</span>
                </template>
              </button>

              <!-- Pedido -->
              <button
                @click="filterStatus = 'pedido'"
                :class="[
                  'rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  filterStatus === 'pedido'
                    ? 'bg-purple-600 text-white px-4 py-2'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 p-2'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="filterStatus === 'pedido' ? 'text-white' : 'text-purple-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <template v-if="filterStatus === 'pedido'">
                  <span>{{ ORDER_STATUS_LABELS.pedido }}</span>
                </template>
              </button>

              <!-- Preparado -->
              <button
                @click="filterStatus = 'preparado'"
                :class="[
                  'rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  filterStatus === 'preparado'
                    ? 'bg-blue-600 text-white px-4 py-2'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 p-2'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="filterStatus === 'preparado' ? 'text-white' : 'text-blue-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
                <template v-if="filterStatus === 'preparado'">
                  <span>{{ ORDER_STATUS_LABELS.preparado }}</span>
                </template>
              </button>

              <!-- Entregado -->
              <button
                @click="filterStatus = 'recogido'"
                :class="[
                  'rounded-lg text-sm font-medium transition-all flex items-center gap-2',
                  filterStatus === 'recogido'
                    ? 'bg-green-600 text-white px-4 py-2'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 p-2'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="filterStatus === 'recogido' ? 'text-white' : 'text-green-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <template v-if="filterStatus === 'recogido'">
                  <span>{{ ORDER_STATUS_LABELS.recogido }}</span>
                </template>
              </button>

              <!-- Cancelado -->
              <!-- <button
                @click="filterStatus = 'cancelado'"
                :class="[
                  'rounded-full text-sm font-medium transition-all flex items-center gap-2',
                  filterStatus === 'cancelado'
                    ? 'bg-red-600 text-white shadow-md px-4 py-2'
                    : 'bg-gray-100 text-gray-500 hover:bg-gray-200 p-2'
                ]"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" :class="filterStatus === 'cancelado' ? 'text-white' : 'text-red-600'" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <template v-if="filterStatus === 'cancelado'">
                  <span>Cancelado</span>
                </template>
              </button> -->
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
                      <option value="en_revision">{{ ORDER_STATUS_LABELS.en_revision }}</option>
                      <option value="revisado">{{ ORDER_STATUS_LABELS.revisado }}</option>
                      <option value="pedido">{{ ORDER_STATUS_LABELS.pedido }}</option>
                      <option value="preparado">{{ ORDER_STATUS_LABELS.preparado }}</option>
                      <option value="recogido">{{ ORDER_STATUS_LABELS.recogido }}</option>
                      <option value="cancelado">{{ ORDER_STATUS_LABELS.cancelado }}</option>
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
                class="appearance-none w-5 h-5 border border-gray-400 checked:border-orange-500 rounded focus:ring-orange-500 checked:bg-orange-500 flex-shrink-0"
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
                <!-- Nombre jugador + Número de pedido -->
                <div class="min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <span class="inline-flex items-center px-2 py-0.5 rounded bg-orange-100 text-orange-800 text-xs font-bold">
                      #{{ order.order_number ? String(order.order_number).padStart(4, '0') : order.id?.substring(0, 4).toUpperCase() }}
                    </span>
                  </div>
                  <p class="text-sm md:text-md font-semibold text-gray-900 truncate">{{ order.player_name }}</p>
                  <p class="text-sm text-gray-500 truncate">{{ order.team }}</p>
                </div>

                <!-- Email -->
                <div class="min-w-0 hidden md:block">
                  <p class="text-sm text-gray-600 truncate">{{ order.email }}</p>
                  <p class="text-xs text-gray-400">
                    {{ order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES') : 'N/A' }}
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
                    <div v-if="order.parent_name !== ''">
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Padre/Madre</p>
                      <p class="font-semibold text-gray-900">{{ order.parent_name }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Email</p>
                      <p class="font-semibold text-gray-900">{{ order.email }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">DNI</p>
                      <p class="font-semibold text-gray-900">{{ order.dni }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Dirección</p>
                      <p class="font-semibold text-gray-900">{{ order.direccion }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Total</p>
                      <p class="font-bold text-orange-600 text-lg">{{ order.total?.toFixed(2) }}€</p>
                    </div>
                    <div>
                      <p class="text-xs text-gray-500 uppercase tracking-wide mb-1">Fecha</p>
                      <p class="font-semibold text-gray-900">
                        {{ order.created_at ? new Date(order.created_at).toLocaleDateString('es-ES', { 
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

                  <!-- Justificante de Pago -->
                  <div v-if="order.payment_proof">
                    <!-- <h4 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      Justificante de Pago
                    </h4> -->
                    <!-- <div class="p-4"> -->
                      <button
                        @click="viewProof(order)"
                        class="btn-outline text-sm flex items-center gap-2"
                        title="Ver justificante de pago"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        Ver Justificante
                      </button>
                    <!-- </div> -->
                  </div>

                  <!-- Mensaje si no hay justificante -->
                  <div v-else class="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div class="flex items-start gap-3">
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                      </svg>
                      <div>
                        <p class="text-sm font-medium text-yellow-800">No hay justificante de pago</p>
                        <p class="text-xs text-yellow-700 mt-1">El cliente no ha subido el justificante de pago para este pedido.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </transition>
          </div>
        </div>

        <!-- Paginación -->
        <div v-if="filteredOrders.length > 0 && totalPages > 1" class="mt-6">
          <div class=" p-4">
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
              <div class="flex items-center gap-2 text-sm w-full md:w-1/3 px-4">
                <label class="text-gray-600 w-full">Por página:</label>
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
        <div v-else-if="filteredOrders.length > 0">
          <p class="text-gray-400 text-center py-6 text-sm">Has llegado al final de la lista</p>
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

              <!-- Galería de Imágenes Adicionales -->
              <div>
                <label class="block text-sm font-semibold text-gray-700 mb-2">
                  Galería de Imágenes (Opcional)
                </label>
                <p class="text-xs text-gray-500 mb-3">
                  Añade imágenes adicionales para mostrar en el carrusel del producto
                </p>
                
                <!-- Botón para añadir imagen -->
                <input
                  ref="additionalImageInput"
                  type="file"
                  accept="image/*"
                  @change="handleAdditionalImageUpload"
                  class="hidden"
                />
                <button
                  type="button"
                  @click="$refs.additionalImageInput.click()"
                  class="btn-outline text-sm flex items-center gap-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                  </svg>
                  Añadir Imagen
                </button>

                <!-- Lista de imágenes adicionales -->
                <div v-if="additionalImages.length > 0" class="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                  <div
                    v-for="(img, index) in additionalImages"
                    :key="index"
                    class="relative group"
                  >
                    <img
                      :src="img.preview || img.url"
                      :alt="`Imagen ${index + 1}`"
                      class="w-full h-32 object-cover rounded-lg border border-gray-300"
                    />
                    <!-- Botones de acción -->
                    <div class="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded-lg flex items-center justify-center gap-2">
                      <!-- Mover a la izquierda -->
                      <button
                        v-if="index > 0"
                        type="button"
                        @click="moveImage(index, 'left')"
                        class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Mover a la izquierda"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <!-- Mover a la derecha -->
                      <button
                        v-if="index < additionalImages.length - 1"
                        type="button"
                        @click="moveImage(index, 'right')"
                        class="p-2 bg-white rounded-full hover:bg-gray-100 transition-colors"
                        title="Mover a la derecha"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                      <!-- Eliminar -->
                      <button
                        type="button"
                        @click="removeAdditionalImage(index)"
                        class="p-2 bg-red-500 rounded-full hover:bg-red-600 transition-colors"
                        title="Eliminar imagen"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    </div>
                    <!-- Indicador de orden -->
                    <div class="absolute top-2 left-2 bg-black bg-opacity-75 text-white text-xs px-2 py-1 rounded">
                      #{{ index + 1 }}
                    </div>
                  </div>
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
                  <div class="flex items-center justify-between">
                    <p class="text-sm text-gray-600">Gestiona las tallas del producto:</p>
                    <button
                      type="button"
                      @click="addNewSize"
                      class="btn-outline text-xs flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                      </svg>
                      Nueva talla
                    </button>
                  </div>

                  <!-- Tallas predefinidas (selección rápida) -->
                  <div class="bg-white p-3 rounded border border-gray-200">
                    <p class="text-xs font-semibold text-gray-700 mb-2">Tallas estándar (click para añadir):</p>
                    <div class="flex flex-wrap gap-2">
                      <button
                        v-for="size in availableSizes"
                        :key="size"
                        type="button"
                        @click="toggleStandardSize(size)"
                        :class="[
                          'px-2 py-1 text-xs rounded border transition-colors',
                          productForm.options.tallas.includes(size)
                            ? 'bg-orange-600 text-white border-orange-600'
                            : 'bg-gray-50 text-gray-700 border-gray-300 hover:bg-gray-100'
                        ]"
                      >
                        {{ size }}
                      </button>
                    </div>
                  </div>

                  <!-- Tallas seleccionadas (con reordenación) -->
                  <div v-if="productForm.options.tallas.length > 0" class="bg-white p-3 rounded border border-gray-200">
                    <p class="text-xs font-semibold text-gray-700 mb-2">Tallas del producto (arrastra para reordenar):</p>
                    <div class="space-y-2">
                      <div
                        v-for="(size, index) in productForm.options.tallas"
                        :key="index"
                        class="flex items-center gap-2 bg-gray-50 p-2 rounded group hover:bg-gray-100"
                        draggable="true"
                        @dragstart="handleDragStart(index)"
                        @dragover.prevent
                        @drop="handleDrop(index)"
                      >
                        <!-- Handle para arrastrar -->
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400 cursor-move" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
                        </svg>
                        
                        <!-- Input para editar la talla -->
                        <input
                          v-model="productForm.options.tallas[index]"
                          type="text"
                          class="input-field text-sm flex-1 size-input"
                          placeholder="Nombre de la talla"
                        />

                        <!-- Botones de orden -->
                        <div class="flex gap-1">
                          <button
                            type="button"
                            @click="moveSizeUp(index)"
                            :disabled="index === 0"
                            class="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Subir"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7" />
                            </svg>
                          </button>
                          <button
                            type="button"
                            @click="moveSizeDown(index)"
                            :disabled="index === productForm.options.tallas.length - 1"
                            class="p-1 rounded hover:bg-gray-200 disabled:opacity-30 disabled:cursor-not-allowed"
                            title="Bajar"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>
                        </div>

                        <!-- Botón eliminar -->
                        <button
                          type="button"
                          @click="removeSize(index)"
                          class="p-1 text-red-600 hover:bg-red-50 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                          title="Eliminar"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    </div>
                  </div>
                  <p v-else class="text-xs text-gray-500 text-center py-2">
                    No hay tallas seleccionadas. Usa las tallas estándar o crea una nueva.
                  </p>
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

            <!-- Tabla de Tallas (Imágenes) -->
            <div class="space-y-4 border-t pt-6">
              <div class="flex items-center justify-between">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900">Tabla de Tallas</h3>
                  <p class="text-sm text-gray-600">Sube una imagen con la tabla de tallas del producto</p>
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
                      ? 'Sube dos imágenes diferentes para chicos y chicas' 
                      : 'Sube una sola imagen de tabla de tallas' }}
                  </p>
                </div>

                <!-- IMAGEN ÚNICA (unisex) -->
                <div v-if="!productForm.size_chart.hasSeparateGenders" class="bg-gray-50 p-6 rounded-lg">
                  <h4 class="font-semibold text-gray-900 mb-4">Imagen de tabla de tallas</h4>
                  
                  <div v-if="sizeChartImagePreview || productForm.size_chart.image" class="mb-4">
                    <img 
                      :src="sizeChartImagePreview || productForm.size_chart.image" 
                      alt="Tabla de tallas" 
                      class="max-w-full h-auto rounded-lg border-2 border-gray-300"
                    />
                    <button
                      type="button"
                      @click="removeSizeChartImage"
                      class="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Eliminar imagen
                    </button>
                  </div>

                  <div v-else class="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <p class="mt-2 text-sm text-gray-600">Sube una imagen de la tabla de tallas</p>
                    <label class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700 cursor-pointer">
                      Seleccionar imagen
                      <input
                        type="file"
                        accept="image/*"
                        @change="handleSizeChartImageChange"
                        class="hidden"
                      />
                    </label>
                  </div>
                </div>
                <!-- FIN IMAGEN ÚNICA -->

                <!-- IMÁGENES SEPARADAS POR GÉNERO -->
                <div v-else class="space-y-6">
                  <!-- IMAGEN CHICOS -->
                  <div class="border-2 border-blue-200 rounded-lg p-4 bg-gray-50">
                    <h3 class="text-lg font-bold text-blue-900 mb-4 flex items-center gap-2">
                      📏 Tabla para Chicos
                    </h3>

                    <div v-if="sizeChartBoysImagePreview || productForm.size_chart.boys_image" class="mb-4">
                      <img 
                        :src="sizeChartBoysImagePreview || productForm.size_chart.boys_image" 
                        alt="Tabla de tallas chicos" 
                        class="max-w-full h-auto rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        @click="removeSizeChartBoysImage"
                        class="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar imagen
                      </button>
                    </div>

                    <div v-else class="border-2 border-dashed border-blue-300 rounded-lg p-8 text-center bg-white">
                      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="mt-2 text-sm text-gray-600">Sube una imagen de la tabla de tallas para chicos</p>
                      <label class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 cursor-pointer">
                        Seleccionar imagen
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleSizeChartBoysImageChange"
                          class="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  <!-- IMAGEN CHICAS -->
                  <div class="border-2 border-pink-200 rounded-lg p-4 bg-gray-50">
                    <h3 class="text-lg font-bold text-pink-900 mb-4 flex items-center gap-2">
                      📏 Tabla para Chicas
                    </h3>

                    <div v-if="sizeChartGirlsImagePreview || productForm.size_chart.girls_image" class="mb-4">
                      <img 
                        :src="sizeChartGirlsImagePreview || productForm.size_chart.girls_image" 
                        alt="Tabla de tallas chicas" 
                        class="max-w-full h-auto rounded-lg border-2 border-gray-300"
                      />
                      <button
                        type="button"
                        @click="removeSizeChartGirlsImage"
                        class="mt-2 text-red-600 hover:text-red-800 text-sm flex items-center gap-1"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                        Eliminar imagen
                      </button>
                    </div>

                    <div v-else class="border-2 border-dashed border-pink-300 rounded-lg p-8 text-center bg-white">
                      <svg xmlns="http://www.w3.org/2000/svg" class="mx-auto h-12 w-12 text-pink-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="mt-2 text-sm text-gray-600">Sube una imagen de la tabla de tallas para chicas</p>
                      <label class="mt-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-pink-600 hover:bg-pink-700 cursor-pointer">
                        Seleccionar imagen
                        <input
                          type="file"
                          accept="image/*"
                          @change="handleSizeChartGirlsImageChange"
                          class="hidden"
                        />
                      </label>
                    </div>
                  </div>
                </div>
                <!-- FIN IMÁGENES SEPARADAS -->
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

  <!-- Modal del Justificante de Pago -->
  <div
    v-if="showProofModal"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
    @click="closeProofModal"
  >
    <div
      class="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto"
      @click.stop
    >
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h3 class="text-lg font-semibold text-gray-900 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-orange-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Justificante de Pago
        </h3>
        <button
          @click="closeProofModal"
          class="text-gray-400 hover:text-gray-600 transition-colors"
          title="Cerrar"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <!-- Content -->
      <div class="p-6">
        <!-- PDF Viewer -->
        <div v-if="currentProofType === 'pdf'" class="w-full">
          <iframe
            :src="currentProofUrl"
            class="w-full h-[70vh] border border-gray-300 rounded-lg"
            title="Justificante de pago PDF"
          />
        </div>

        <!-- Image Viewer -->
        <div v-else class="flex justify-center">
          <img
            :src="currentProofUrl"
            alt="Justificante de pago"
            class="max-w-full h-auto rounded-lg shadow-lg"
            @error="(e) => (e.target as HTMLImageElement).src = 'data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22><rect width=%22400%22 height=%22300%22 fill=%22%23f3f4f6%22/><text x=%2250%%22 y=%2250%%22 text-anchor=%22middle%22 dy=%22.3em%22 font-family=%22sans-serif%22 font-size=%2218%22 fill=%22%23999%22>Error al cargar la imagen</text></svg>'"
          />
        </div>
      </div>

      <!-- Footer -->
      <div class="sticky bottom-0 bg-gray-50 border-t border-gray-200 px-6 py-4 flex justify-end gap-3">
        <a
          :href="currentProofUrl"
          target="_blank"
          class="btn-outline text-sm flex items-center gap-2"
          title="Abrir en nueva pestaña"
        >
          <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
          Abrir en Nueva Pestaña
        </a>
        <button
          @click="closeProofModal"
          class="btn-primary text-sm"
        >
          Cerrar
        </button>
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

// Modal del justificante de pago
const showProofModal = ref(false);
const currentProofUrl = ref('');
const currentProofType = ref(''); // 'image' o 'pdf'

// Paginación
const currentPage = ref(1);
const itemsPerPage = ref(10);

// Estado de productos
const products = ref<Product[]>([]);
const loadingProducts = ref(false);
const showProductModal = ref(false);
const editingProduct = ref<Product | null>(null);
const savingProduct = ref(false);
const imagePreview = ref<string>('');
const selectedImageFile = ref<File | null>(null);

// Imágenes adicionales (galería)
const additionalImages = ref<Array<{
  id: string;
  file?: File;
  preview?: string;
  url?: string;
  path?: string;
  order: number;
}>>([]);

// Imágenes de tabla de tallas
const sizeChartImagePreview = ref<string>('');
const sizeChartImageFile = ref<File | null>(null);
const sizeChartBoysImagePreview = ref<string>('');
const sizeChartBoysImageFile = ref<File | null>(null);
const sizeChartGirlsImagePreview = ref<string>('');
const sizeChartGirlsImageFile = ref<File | null>(null);

// Tallas disponibles
const availableSizes = ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XL', '4XL'];

// Función para ordenar tallas según el orden de availableSizes
const sortSizes = (sizes: string[]): string[] => {
  return sizes.sort((a, b) => {
    const indexA = availableSizes.indexOf(a);
    const indexB = availableSizes.indexOf(b);
    
    // Si ambas están en availableSizes, ordenar por su índice
    if (indexA !== -1 && indexB !== -1) {
      return indexA - indexB;
    }
    
    // Si solo una está en availableSizes, la que está va primero
    if (indexA !== -1) return -1;
    if (indexB !== -1) return 1;
    
    // Si ninguna está, orden alfabético
    return a.localeCompare(b);
  });
};

// Función para sincronizar tallas de la tabla con las seleccionadas
// Función obsoleta - ya no se necesita sincronizar porque usamos imágenes
// const syncSizeChartWithSelectedSizes = () => { ... }

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
    image: '',
    image_path: '',
    boys_image: '',
    boys_image_path: '',
    girls_image: '',
    girls_image_path: '',
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

// Watcher para inicializar/limpiar estructuras cuando cambia el modo de tabla de tallas
watch(() => productForm.value.size_chart.hasSeparateGenders, (newValue) => {
  if (newValue) {
    // Cambió a tablas separadas: inicializar boys y girls si están vacías
    if (!productForm.value.size_chart.boys) {
      productForm.value.size_chart.boys = { columns: [], rows: [] };
    }
    if (!productForm.value.size_chart.girls) {
      productForm.value.size_chart.girls = { columns: [], rows: [] };
    }
  }
});

// Watchers obsoletos - ya no necesitamos sincronizar porque usamos imágenes
// Las tallas ahora son independientes de las imágenes de tablas de tallas

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
// Función para obtener la etiqueta del estado
const getStatusLabel = (status: string) => {
  return ORDER_STATUS_LABELS[status as OrderStatus] || status;
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

// Detectar si el archivo es PDF
const isPDF = (url: string | undefined): boolean => {
  if (!url) return false;
  return url.toLowerCase().includes('.pdf') || url.toLowerCase().includes('application/pdf');
};

// Obtener extensión del archivo
const getFileExtension = (url: string | undefined): string => {
  if (!url) return 'jpg';
  const match = url.match(/\.([a-zA-Z0-9]+)(\?|$)/);
  return match ? match[1] : 'jpg';
};

// Ver comprobante
const viewProof = (order: Order) => {
  const proofUrl = order.payment_proof;
  if (proofUrl) {
    currentProofUrl.value = proofUrl as string;
    currentProofType.value = isPDF(proofUrl as string) ? 'pdf' : 'image';
    showProofModal.value = true;
  }
};

// Cerrar modal del justificante
const closeProofModal = () => {
  showProofModal.value = false;
  currentProofUrl.value = '';
  currentProofType.value = '';
};

// Exportar pedidos a Excel
const exportToExcel = () => {
  if (filteredOrders.value.length === 0) {
    alert('No hay pedidos para exportar');
    return;
  }

  try {
    // Preparar los datos para Excel
    const excelData: any[] = [];

    // Encabezados
    const headers = [
      'Nº Pedido',
      'Fecha',
      'Equipo',
      'Jugador',
      'Padre/Madre',
      'Email',
      'DNI',
      'Dirección',
      'Producto',
      'Talla',
      'Género',
      'Número',
      'Texto',
      'Cantidad',
      'Estado',
    ];
    excelData.push(headers);

    // Recorrer todos los pedidos filtrados
    filteredOrders.value.forEach((order) => {
      // Número de pedido con formato #0001
      const numeroPedido = order.order_number 
        ? `#${String(order.order_number).padStart(4, '0')}`
        : order.id?.substring(0, 8).toUpperCase() || 'N/A';

      // Fecha formateada
      const fecha = order.created_at 
        ? new Date(order.created_at).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        : 'N/A';

      // Obtener estado en español desde ORDER_STATUS_LABELS
      const estado = ORDER_STATUS_LABELS[order.status as OrderStatus] || order.status || 'N/A';

      // Recorrer cada producto del pedido
      order.items?.forEach((item) => {
        const fila = [
          numeroPedido,
          fecha,
          order.team || 'N/A',
          order.player_name || 'N/A',
          order.parent_name || '-',
          order.email || 'N/A',
          order.dni || '-',
          order.direccion || '-',
          item.name || 'Sin nombre',
          item.options?.talla || '-',
          item.options?.genero || '-',
          item.options?.numero || '-',
          item.options?.nombre || '-',
          item.quantity || 1,
          estado,
        ];
        excelData.push(fila);
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

// ============ FUNCIONES DE GESTIÓN DE TALLAS ============

// Estado para drag and drop
const draggedSizeIndex = ref<number | null>(null);

// Añadir una nueva talla vacía
const addNewSize = () => {
  productForm.value.options.tallas.push('');
  // Enfocar el input después de que se renderice
  nextTick(() => {
    const inputs = document.querySelectorAll('.size-input');
    const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
    if (lastInput) lastInput.focus();
  });
};

// Toggle de talla estándar
const toggleStandardSize = (size: string) => {
  const index = productForm.value.options.tallas.indexOf(size);
  if (index > -1) {
    // Ya está, la eliminamos
    productForm.value.options.tallas.splice(index, 1);
  } else {
    // No está, la añadimos
    productForm.value.options.tallas.push(size);
  }
};

// Eliminar una talla
const removeSize = (index: number) => {
  if (confirm(`¿Eliminar la talla "${productForm.value.options.tallas[index]}"?`)) {
    productForm.value.options.tallas.splice(index, 1);
  }
};

// Mover talla hacia arriba
const moveSizeUp = (index: number) => {
  if (index > 0) {
    const tallas = [...productForm.value.options.tallas];
    [tallas[index - 1], tallas[index]] = [tallas[index], tallas[index - 1]];
    productForm.value.options.tallas = tallas;
  }
};

// Mover talla hacia abajo
const moveSizeDown = (index: number) => {
  if (index < productForm.value.options.tallas.length - 1) {
    const tallas = [...productForm.value.options.tallas];
    [tallas[index], tallas[index + 1]] = [tallas[index + 1], tallas[index]];
    productForm.value.options.tallas = tallas;
  }
};

// Drag and drop handlers
const handleDragStart = (index: number) => {
  draggedSizeIndex.value = index;
};

const handleDrop = (dropIndex: number) => {
  if (draggedSizeIndex.value !== null && draggedSizeIndex.value !== dropIndex) {
    const tallas = [...productForm.value.options.tallas];
    const draggedItem = tallas[draggedSizeIndex.value];
    
    // Eliminar del índice original
    tallas.splice(draggedSizeIndex.value, 1);
    
    // Insertar en el nuevo índice
    tallas.splice(dropIndex, 0, draggedItem);
    
    productForm.value.options.tallas = tallas;
  }
  draggedSizeIndex.value = null;
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
      size_chart: product.size_chart ? {
        enabled: product.size_chart.enabled || false,
        unit: product.size_chart.unit || 'cm',
        hasSeparateGenders: product.size_chart.hasSeparateGenders || false,
        image: product.size_chart.image || '',
        image_path: product.size_chart.image_path || '',
        boys_image: product.size_chart.boys_image || '',
        boys_image_path: product.size_chart.boys_image_path || '',
        girls_image: product.size_chart.girls_image || '',
        girls_image_path: product.size_chart.girls_image_path || '',
        columns: product.size_chart.columns || [],
        rows: product.size_chart.rows || [],
        boys: product.size_chart.boys || {
          columns: [],
          rows: [],
        },
        girls: product.size_chart.girls || {
          columns: [],
          rows: [],
        },
      } : {
        enabled: false,
        unit: 'cm',
        hasSeparateGenders: false,
        image: '',
        image_path: '',
        boys_image: '',
        boys_image_path: '',
        girls_image: '',
        girls_image_path: '',
        columns: [],
        rows: [],
        boys: {
          columns: [],
          rows: [],
        },
        girls: {
          columns: [],
          rows: [],
        },
      },
    };
    imagePreview.value = product.image || '';
    
    // Cargar imágenes adicionales existentes
    if (product.images && Array.isArray(product.images)) {
      additionalImages.value = product.images.map(img => ({
        id: img.id,
        url: img.url,
        path: img.path,
        order: img.order
      }));
    }
    
    // Cargar previews de imágenes de tablas de tallas
    if (product.size_chart?.image) {
      sizeChartImagePreview.value = product.size_chart.image;
    }
    if (product.size_chart?.boys_image) {
      sizeChartBoysImagePreview.value = product.size_chart.boys_image;
    }
    if (product.size_chart?.girls_image) {
      sizeChartGirlsImagePreview.value = product.size_chart.girls_image;
    }
    
    // Debug: Ver qué se cargó para editar
    console.log('📝 Producto cargado para editar:', {
      name: product.name,
      size_chart_enabled: productForm.value.size_chart.enabled,
      size_chart_hasSeparateGenders: productForm.value.size_chart.hasSeparateGenders,
      size_chart: productForm.value.size_chart,
      images_count: additionalImages.value.length
    });
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
  additionalImages.value = [];
  sizeChartImagePreview.value = '';
  sizeChartImageFile.value = null;
  sizeChartBoysImagePreview.value = '';
  sizeChartBoysImageFile.value = null;
  sizeChartGirlsImagePreview.value = '';
  sizeChartGirlsImageFile.value = null;
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
      hasSeparateGenders: false,
      image: '',
      image_path: '',
      boys_image: '',
      boys_image_path: '',
      girls_image: '',
      girls_image_path: '',
      columns: [],
      rows: [],
      boys: {
        columns: [],
        rows: [],
      },
      girls: {
        columns: [],
        rows: [],
      },
    },
  };
  
  // Limpiar también los previews de las imágenes de tablas de tallas
  sizeChartImagePreview.value = '';
  sizeChartImageFile.value = null;
  sizeChartBoysImagePreview.value = '';
  sizeChartBoysImageFile.value = null;
  sizeChartGirlsImagePreview.value = '';
  sizeChartGirlsImageFile.value = null;
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

// Manejo de imágenes de tabla de tallas
const handleSizeChartImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    sizeChartImageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      sizeChartImagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeSizeChartImage = () => {
  sizeChartImagePreview.value = '';
  sizeChartImageFile.value = null;
  productForm.value.size_chart.image = '';
  productForm.value.size_chart.image_path = '';
};

const handleSizeChartBoysImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    sizeChartBoysImageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      sizeChartBoysImagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeSizeChartBoysImage = () => {
  sizeChartBoysImagePreview.value = '';
  sizeChartBoysImageFile.value = null;
  productForm.value.size_chart.boys_image = '';
  productForm.value.size_chart.boys_image_path = '';
};

const handleSizeChartGirlsImageChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    sizeChartGirlsImageFile.value = file;
    const reader = new FileReader();
    reader.onload = (e) => {
      sizeChartGirlsImagePreview.value = e.target?.result as string;
    };
    reader.readAsDataURL(file);
  }
};

const removeSizeChartGirlsImage = () => {
  sizeChartGirlsImagePreview.value = '';
  sizeChartGirlsImageFile.value = null;
  productForm.value.size_chart.girls_image = '';
  productForm.value.size_chart.girls_image_path = '';
};

// ============ FUNCIONES DE GALERÍA DE IMÁGENES ADICIONALES ============
const handleAdditionalImageUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const file = target.files?.[0];
  
  if (file) {
    if (file.size > 5 * 1024 * 1024) {
      alert('La imagen es demasiado grande. Máximo 5MB.');
      return;
    }
    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      additionalImages.value.push({
        id: `temp-${Date.now()}-${Math.random()}`,
        file: file,
        preview: e.target?.result as string,
        order: additionalImages.value.length
      });
    };
    reader.readAsDataURL(file);
    
    // Limpiar el input para poder subir la misma imagen de nuevo si es necesario
    target.value = '';
  }
};

const removeAdditionalImage = (index: number) => {
  additionalImages.value.splice(index, 1);
  // Reordenar los índices
  additionalImages.value.forEach((img, idx) => {
    img.order = idx;
  });
};

const moveImage = (index: number, direction: 'left' | 'right') => {
  const newIndex = direction === 'left' ? index - 1 : index + 1;
  if (newIndex < 0 || newIndex >= additionalImages.value.length) return;
  
  // Intercambiar posiciones
  const temp = additionalImages.value[index];
  additionalImages.value[index] = additionalImages.value[newIndex];
  additionalImages.value[newIndex] = temp;
  
  // Actualizar órdenes
  additionalImages.value[index].order = index;
  additionalImages.value[newIndex].order = newIndex;
};
// ============ FIN FUNCIONES GALERÍA ============

// ============ FUNCIONES OBSOLETAS DE TABLA DE TALLAS (YA NO SE USAN) ============
// Las funciones de gestión de tablas dinámicas han sido eliminadas
// Ahora se usan imágenes estáticas subidas por el administrador
// ============ FIN FUNCIONES OBSOLETAS ============

// Guardar producto (crear o actualizar)
const saveProduct = async () => {
  savingProduct.value = true;

  try {
    // Ya no ordenamos automáticamente - respetamos el orden definido por el usuario
    // Si el usuario quiere ordenar, puede usar los botones de reordenar

    // Preparar size_chart según el tipo
    let sizeChartData = null;
    if (productForm.value.size_chart.enabled) {
      if (productForm.value.size_chart.hasSeparateGenders) {
        // Tablas separadas por género: subir las dos imágenes
        let boysImagePath = productForm.value.size_chart.boys_image_path || '';
        let girlsImagePath = productForm.value.size_chart.girls_image_path || '';

        // Subir imagen de chicos si hay una nueva
        if (sizeChartBoysImageFile.value) {
          console.log('Subiendo imagen de tabla de tallas para chicos...');
          boysImagePath = await uploadProductImage(sizeChartBoysImageFile.value, 'size-chart-boys');
          if (!boysImagePath) {
            alert('Error al subir la imagen de tabla de tallas para chicos');
            savingProduct.value = false;
            return;
          }
        }

        // Subir imagen de chicas si hay una nueva
        if (sizeChartGirlsImageFile.value) {
          console.log('Subiendo imagen de tabla de tallas para chicas...');
          girlsImagePath = await uploadProductImage(sizeChartGirlsImageFile.value, 'size-chart-girls');
          if (!girlsImagePath) {
            alert('Error al subir la imagen de tabla de tallas para chicas');
            savingProduct.value = false;
            return;
          }
        }

        sizeChartData = {
          enabled: true,
          unit: productForm.value.size_chart.unit,
          hasSeparateGenders: true,
          boys_image_path: boysImagePath,
          girls_image_path: girlsImagePath,
        };
      } else {
        // Tabla única: subir una sola imagen
        let imagePath = productForm.value.size_chart.image_path || '';

        // Subir imagen si hay una nueva
        if (sizeChartImageFile.value) {
          console.log('Subiendo imagen de tabla de tallas...');
          imagePath = await uploadProductImage(sizeChartImageFile.value, 'size-chart');
          if (!imagePath) {
            alert('Error al subir la imagen de tabla de tallas');
            savingProduct.value = false;
            return;
          }
        }

        sizeChartData = {
          enabled: true,
          unit: productForm.value.size_chart.unit,
          hasSeparateGenders: false,
          image_path: imagePath,
        };
      }
    }

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
      size_chart: sizeChartData,
    };

    // Debug: Ver qué se va a guardar
    console.log('💾 Guardando producto:', {
      name: productData.name,
      size_chart_enabled: sizeChartData?.enabled,
      size_chart_hasSeparateGenders: sizeChartData?.hasSeparateGenders,
      size_chart: sizeChartData
    });

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

    // Subir imágenes adicionales (galería)
    const uploadedImages: any[] = [];
    for (const img of additionalImages.value) {
      if (img.file) {
        // Es una imagen nueva que necesita ser subida
        console.log('Subiendo imagen adicional...', img.file.name);
        const imagePath = await uploadProductImage(img.file, 'gallery');
        if (imagePath) {
          uploadedImages.push({
            id: img.id,
            path: imagePath,
            order: img.order
          });
        } else {
          alert('Error al subir una de las imágenes adicionales');
          savingProduct.value = false;
          return;
        }
      } else if (img.path) {
        // Es una imagen existente, mantenerla
        uploadedImages.push({
          id: img.id,
          path: img.path,
          order: img.order
        });
      }
    }
    productData.images = uploadedImages;

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
