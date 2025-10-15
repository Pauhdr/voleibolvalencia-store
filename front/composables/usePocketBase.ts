import PocketBase from 'pocketbase';
import type { Product, Order } from '~/types';

export const usePocketBase = () => {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

  // Productos
  const getProducts = async (): Promise<Product[]> => {
    try {
      const records = await pb.collection('products').getFullList({
        sort: '-created',
      });
      return records as unknown as Product[];
    } catch (error) {
      console.error('Error fetching products:', error);
      return [];
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const record = await pb.collection('products').getOne(id);
      return record as unknown as Product;
    } catch (error) {
      console.error('Error fetching product:', error);
      return null;
    }
  };

  // Pedidos
  const createOrder = async (orderData: Partial<Order>): Promise<Order | null> => {
    try {
      const formData = new FormData();
      
      // Datos del comprador
      formData.append('buyer_name', orderData.buyer_name || '');
      formData.append('buyer_email', orderData.buyer_email || '');
      formData.append('player_name', orderData.player_name || '');
      formData.append('team', orderData.team || '');
      
      // Productos (como JSON string)
      formData.append('products', JSON.stringify(orderData.products || []));
      
      // Total
      formData.append('total', String(orderData.total || 0));
      
      // Estado inicial
      formData.append('status', 'pendiente');
      
      // Referencia de transferencia (opcional)
      if (orderData.transfer_reference) {
        formData.append('transfer_reference', orderData.transfer_reference);
      }
      
      // Comprobante (archivo)
      if (orderData.proof && orderData.proof instanceof File) {
        formData.append('proof', orderData.proof);
      }

      const record = await pb.collection('orders').create(formData);
      return record as unknown as Order;
    } catch (error) {
      console.error('Error creating order:', error);
      throw error;
    }
  };

  const getOrders = async (): Promise<Order[]> => {
    try {
      const records = await pb.collection('orders').getFullList({
        sort: '-created',
      });
      return records as unknown as Order[];
    } catch (error) {
      console.error('Error fetching orders:', error);
      return [];
    }
  };

  const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    try {
      await pb.collection('orders').update(orderId, { status });
      return true;
    } catch (error) {
      console.error('Error updating order status:', error);
      return false;
    }
  };

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const record = await pb.collection('orders').getOne(id);
      return record as unknown as Order;
    } catch (error) {
      console.error('Error fetching order:', error);
      return null;
    }
  };

  // Autenticación para admin
  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      await pb.collection('users').authWithPassword(email, password);
      return true;
    } catch (error) {
      console.error('Error logging in:', error);
      return false;
    }
  };

  const logoutAdmin = () => {
    pb.authStore.clear();
  };

  const isAuthenticated = () => {
    return pb.authStore.isValid;
  };

  // Función para obtener la URL del archivo
  const getFileUrl = (record: any, filename: string): string => {
    return pb.files.getUrl(record, filename);
  };

  return {
    pb,
    getProducts,
    getProductById,
    createOrder,
    getOrders,
    updateOrderStatus,
    getOrderById,
    loginAdmin,
    logoutAdmin,
    isAuthenticated,
    getFileUrl,
  };
};
