import { defineStore } from 'pinia';
import type { CartItem, BuyerData } from '~/types';

interface CartState {
  items: CartItem[];
  buyerData: BuyerData | null;
}

export const useCartStore = defineStore('cart', {
  state: (): CartState => ({
    items: [],
    buyerData: null,
  }),

  getters: {
    // Total de items en el carrito
    itemCount: (state): number => {
      return state.items.reduce((total, item) => total + item.quantity, 0);
    },

    // Subtotal del carrito
    subtotal: (state): number => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Total del carrito (por ahora igual al subtotal, pero preparado para descuentos)
    total: (state): number => {
      return state.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    },

    // Verificar si el carrito está vacío
    isEmpty: (state): boolean => {
      return state.items.length === 0;
    },

    // Verificar si hay datos del comprador
    hasBuyerData: (state): boolean => {
      return state.buyerData !== null;
    },
  },

  actions: {
    // Añadir producto al carrito
    addItem(item: CartItem) {
      // Verificar si ya existe un item idéntico (mismo producto y mismas opciones)
      const existingItemIndex = this.items.findIndex(
        (cartItem) =>
          cartItem.product_id === item.product_id &&
          JSON.stringify(cartItem.options) === JSON.stringify(item.options)
      );

      if (existingItemIndex !== -1) {
        // Si existe, incrementar cantidad
        this.items[existingItemIndex].quantity += item.quantity;
      } else {
        // Si no existe, añadir nuevo item
        this.items.push({ ...item });
      }
      // No necesitamos saveToLocalStorage() - el plugin lo hace automáticamente
    },

    // Actualizar cantidad de un item
    updateItemQuantity(index: number, quantity: number) {
      if (quantity <= 0) {
        this.removeItem(index);
      } else {
        this.items[index].quantity = quantity;
        // No necesitamos saveToLocalStorage() - el plugin lo hace automáticamente
      }
    },

    // Eliminar item del carrito
    removeItem(index: number) {
      this.items.splice(index, 1);
      // No necesitamos saveToLocalStorage() - el plugin lo hace automáticamente
    },

    // Limpiar todo el carrito
    clearCart() {
      this.items = [];
      // No necesitamos saveToLocalStorage() - el plugin lo hace automáticamente
    },

    // Guardar datos del comprador
    setBuyerData(data: BuyerData) {
      this.buyerData = data;
      // No necesitamos saveToLocalStorage() - el plugin lo hace automáticamente
    },

    // Limpiar datos del comprador
    clearBuyerData() {
      this.buyerData = null;
      // No necesitamos saveToLocalStorage() - el plugin lo hace automáticamente
    },

    // Resetear todo (después de completar pedido)
    reset() {
      this.items = [];
      this.buyerData = null;
      // El plugin maneja la sincronización con localStorage automáticamente
    },
  },

  // Configuración de persistencia automática
  persist: {
    storage: process.client ? localStorage : undefined,
  },
});
