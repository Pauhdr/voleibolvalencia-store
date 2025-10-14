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

      this.saveToLocalStorage();
    },

    // Actualizar cantidad de un item
    updateItemQuantity(index: number, quantity: number) {
      if (quantity <= 0) {
        this.removeItem(index);
      } else {
        this.items[index].quantity = quantity;
        this.saveToLocalStorage();
      }
    },

    // Eliminar item del carrito
    removeItem(index: number) {
      this.items.splice(index, 1);
      this.saveToLocalStorage();
    },

    // Limpiar todo el carrito
    clearCart() {
      this.items = [];
      this.saveToLocalStorage();
    },

    // Guardar datos del comprador
    setBuyerData(data: BuyerData) {
      this.buyerData = data;
      this.saveToLocalStorage();
    },

    // Limpiar datos del comprador
    clearBuyerData() {
      this.buyerData = null;
      this.saveToLocalStorage();
    },

    // Guardar en localStorage
    saveToLocalStorage() {
      if (process.client) {
        localStorage.setItem('cart', JSON.stringify(this.items));
        localStorage.setItem('buyerData', JSON.stringify(this.buyerData));
      }
    },

    // Cargar desde localStorage
    loadFromLocalStorage() {
      if (process.client) {
        const cartData = localStorage.getItem('cart');
        const buyerData = localStorage.getItem('buyerData');

        if (cartData) {
          try {
            this.items = JSON.parse(cartData);
          } catch (e) {
            console.error('Error parsing cart data:', e);
          }
        }

        if (buyerData) {
          try {
            this.buyerData = JSON.parse(buyerData);
          } catch (e) {
            console.error('Error parsing buyer data:', e);
          }
        }
      }
    },

    // Resetear todo (después de completar pedido)
    reset() {
      this.items = [];
      this.buyerData = null;
      if (process.client) {
        localStorage.removeItem('cart');
        localStorage.removeItem('buyerData');
      }
    },
  },
});
