import PocketBase from 'pocketbase';
import type { Product, Order } from '~/types';

export const usePocketBase = () => {
  const pb = new PocketBase(import.meta.env.VITE_POCKETBASE_URL || 'http://127.0.0.1:8090');

  // Productos
  const getProducts = async (): Promise<Product[]> => {
    try {
      const records = await pb.collection('products').getFullList({
        sort: '-created',
        filter: 'active = true',
      });
      
      // Mapear los productos y construir las URLs de las imágenes
      const products = records.map((record: any) => {
        const product: Product = {
          id: record.id,
          name: record.name,
          price: record.price,
          description: record.description || '',
          options: record.options || {},
          category: record.category,
        };
        
        // Construir la URL completa de la imagen si existe
        if (record.image) {
          product.image = pb.files.getUrl(record, record.image);
        }
        
        return product;
      });
      
      console.log('✅ Productos cargados desde PocketBase:', products.length);
      return products;
    } catch (error) {
      console.error('❌ Error fetching products:', error);
      return [];
    }
  };

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const record = await pb.collection('products').getOne(id);
      
      // Construir el producto con la URL de imagen correcta
      const product: Product = {
        id: record.id,
        name: record.name,
        price: record.price,
        description: record.description || '',
        options: record.options || {},
        category: record.category,
      };
      
      // Construir la URL completa de la imagen si existe
      if (record.image) {
        product.image = pb.files.getUrl(record, record.image);
      }
      
      console.log('✅ Producto cargado:', product);
      return product;
    } catch (error) {
      console.error('❌ Error fetching product:', error);
      return null;
    }
  };

  // Pedidos
  const createOrder = async (orderData: any): Promise<Order | null> => {
    try {
      const formData = new FormData();
      
      console.log('📦 Datos recibidos en createOrder:', orderData);
      
      // Datos del jugador y familia
      formData.append('player_name', orderData.player_name || '');
      formData.append('team', orderData.team || '');
      formData.append('parent_name', orderData.parent_name || '');
      formData.append('email', orderData.email || '');
      
      // Referencia de transferencia (opcional)
      if (orderData.transfer_reference) {
        formData.append('transfer_reference', orderData.transfer_reference);
      }
      
      // Items del carrito (como JSON string)
      const items = orderData.products || orderData.items || [];
      formData.append('items', JSON.stringify(items));
      console.log('🛒 Items a guardar:', items);
      
      // Total
      formData.append('total', String(orderData.total || 0));
      
      // Estado inicial: en revisión
      formData.append('status', 'en_revision');
      
      // Comprobante de pago (archivo)
      if (orderData.payment_proof && orderData.payment_proof instanceof File) {
        formData.append('payment_proof', orderData.payment_proof);
        console.log('📄 Comprobante agregado:', orderData.payment_proof.name);
      } else if (orderData.proof && orderData.proof instanceof File) {
        formData.append('payment_proof', orderData.proof);
        console.log('📄 Comprobante agregado (proof):', orderData.proof.name);
      }

      console.log('✉️ FormData preparado, enviando a PocketBase...');
      const record = await pb.collection('orders').create(formData);
      console.log('✅ Pedido creado exitosamente:', record);
      return record as unknown as Order;
    } catch (error) {
      console.error('❌ Error creating order:', error);
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
