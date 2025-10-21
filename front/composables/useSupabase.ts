import { createClient } from '@supabase/supabase-js'
import type { Product, Order } from '~/types'

export const useSupabase = () => {
  const config = useRuntimeConfig()
  
  const supabase = createClient(
    config.public.supabaseUrl,
    config.public.supabaseKey
  )

  console.log('🔌 Supabase conectado:', config.public.supabaseUrl)

  // Productos
  const getProducts = async (): Promise<Product[]> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('active', true)
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Error fetching products:', error)
        return []
      }
      
      // Construir URLs de imágenes desde Supabase Storage
      const products = await Promise.all((data || []).map(async (record: any) => {
        const product: Product = {
          id: record.id,
          name: record.name,
          price: record.price,
          description: record.description || '',
          options: record.options || {},
          category: record.category,
          image_path: record.image_path || '',
          size_chart: record.size_chart || undefined,
        }
        
        // Obtener URL pública de la imagen si existe
        if (record.image_path) {
            console.log("record.image_path:", record.image_path)
          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(record.image_path)
          console.log("urlData.publicUrl:", urlData.publicUrl)
          product.image = urlData.publicUrl
        }

        // Generar URLs públicas para las imágenes del size_chart
        if (product.size_chart) {
          if (product.size_chart.image_path) {
            const { data: urlData } = supabase.storage
              .from('products')
              .getPublicUrl(product.size_chart.image_path)
            product.size_chart.image = urlData.publicUrl
          }
          if (product.size_chart.boys_image_path) {
            const { data: urlData } = supabase.storage
              .from('products')
              .getPublicUrl(product.size_chart.boys_image_path)
            product.size_chart.boys_image = urlData.publicUrl
          }
          if (product.size_chart.girls_image_path) {
            const { data: urlData } = supabase.storage
              .from('products')
              .getPublicUrl(product.size_chart.girls_image_path)
            product.size_chart.girls_image = urlData.publicUrl
          }
        }

        // Generar URLs públicas para las imágenes adicionales
        if (record.images && Array.isArray(record.images)) {
          product.images = record.images.map((img: any) => {
            const { data: urlData } = supabase.storage
              .from('products')
              .getPublicUrl(img.path)
            return {
              id: img.id,
              url: urlData.publicUrl,
              path: img.path,
              order: img.order
            }
          })
        }
        
        return product
      }))
      
      console.log('✅ Productos cargados desde Supabase:', products.length)
      return products
    } catch (error) {
      console.error('❌ Error fetching products:', error)
      return []
    }
  }

  const getProductById = async (id: string): Promise<Product | null> => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('❌ Error fetching product:', error)
        return null
      }
      
      // Construir el producto con la URL de imagen correcta
      const product: Product = {
        id: data.id,
        name: data.name,
        price: data.price,
        description: data.description || '',
        options: data.options || {},
        category: data.category,
        image_path: data.image_path || '',
        size_chart: data.size_chart || undefined,
      }
      
      // Obtener URL pública de la imagen si existe
      if (data.image_path) {
        const { data: urlData } = supabase.storage
          .from('products')
          .getPublicUrl(data.image_path)
        
        product.image = urlData.publicUrl
      }

      // Generar URLs públicas para las imágenes del size_chart
      if (product.size_chart) {
        if (product.size_chart.image_path) {
          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(product.size_chart.image_path)
          product.size_chart.image = urlData.publicUrl
        }
        if (product.size_chart.boys_image_path) {
          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(product.size_chart.boys_image_path)
          product.size_chart.boys_image = urlData.publicUrl
        }
        if (product.size_chart.girls_image_path) {
          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(product.size_chart.girls_image_path)
          product.size_chart.girls_image = urlData.publicUrl
        }
      }

      // Generar URLs públicas para las imágenes adicionales
      if (data.images && Array.isArray(data.images)) {
        product.images = data.images.map((img: any) => {
          const { data: urlData } = supabase.storage
            .from('products')
            .getPublicUrl(img.path)
          return {
            id: img.id,
            url: urlData.publicUrl,
            path: img.path,
            order: img.order
          }
        })
      }
      
      console.log('✅ Producto cargado desde BD:', product);
      return product
    } catch (error) {
      console.error('❌ Error fetching product:', error)
      return null
    }
  }

  // Pedidos
  
  // Función para obtener el siguiente número de pedido
  const getNextOrderNumber = async (): Promise<number> => {
    try {
      // Obtener el último número de pedido
      const { data, error } = await supabase
        .from('orders')
        .select('order_number')
        .order('order_number', { ascending: false })
        .limit(1)
        .single()
      
      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('❌ Error getting last order number:', error)
        return 1 // Empezar desde 1 si hay error
      }
      
      // Si no hay pedidos, empezar desde 1
      if (!data || !data.order_number) {
        return 1
      }
      
      // Incrementar el último número
      const nextNumber = data.order_number + 1
      
      // Si supera 9999, volver a 1
      return nextNumber > 9999 ? 1 : nextNumber
    } catch (error) {
      console.error('❌ Error getting next order number:', error)
      return 1
    }
  }

  const createOrder = async (orderData: any): Promise<Order | null> => {
    try {
      console.log('📦 Datos recibidos en createOrder:', orderData)
      
      // Obtener el siguiente número de pedido
      const orderNumber = await getNextOrderNumber()
      console.log('🔢 Número de pedido asignado:', orderNumber)
      
      let proofPath = null
      
      // 1. Subir comprobante de pago a Storage
      const proofFile = orderData.proof || orderData.payment_proof
      if (proofFile && proofFile instanceof File) {
        const fileName = `${Date.now()}_${proofFile.name}`
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('payment-proofs')
          .upload(fileName, proofFile, {
            cacheControl: '3600',
            upsert: false
          })
        
        if (uploadError) {
          console.error('❌ Error uploading payment proof:', uploadError)
          throw uploadError
        }
        
        proofPath = uploadData.path
        console.log('📄 Comprobante subido:', proofPath)
      }

      // 2. Preparar items (productos del carrito)
      const items = orderData.products || orderData.items || []
      console.log('🛒 Items a guardar:', items)

      // 3. Crear el pedido en la base de datos
      const { data, error } = await supabase
        .from('orders')
        .insert({
          order_number: orderNumber,
          player_name: orderData.player_name,
          team: orderData.team,
          parent_name: orderData.parent_name,
          email: orderData.email,
          transfer_reference: orderData.transfer_reference || null,
          items: items,
          total: orderData.total,
          status: 'en_revision',
          payment_proof_path: proofPath
        })
        .select()
        .single()
      
      if (error) {
        console.error('❌ Error creating order:', error)
        throw error
      }
      
      console.log('✅ Pedido creado exitosamente en Supabase:', data)
      return data as Order
    } catch (error) {
      console.error('❌ Error creating order:', error)
      throw error
    }
  }

  const getOrders = async (): Promise<Order[]> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
      
      if (error) {
        console.error('❌ Error fetching orders:', error)
        return []
      }
      
      // Agregar URLs de comprobantes de pago
      const orders = await Promise.all((data || []).map(async (order: any) => {
        if (order.payment_proof_path) {
          const { data: urlData } = supabase.storage
            .from('payment-proofs')
            .getPublicUrl(order.payment_proof_path)
          
          order.payment_proof = urlData.publicUrl
        }
        return order as Order
      }))
      
      return orders
    } catch (error) {
      console.error('❌ Error fetching orders:', error)
      return []
    }
  }

  const updateOrderStatus = async (orderId: string, status: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)
      
      if (error) {
        console.error('❌ Error updating order status:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('❌ Error updating order status:', error)
      return false
    }
  }

  const getOrderById = async (id: string): Promise<Order | null> => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) {
        console.error('❌ Error fetching order:', error)
        return null
      }
      
      // Agregar URL del comprobante
      if (data.payment_proof_path) {
        const { data: urlData } = supabase.storage
          .from('payment-proofs')
          .getPublicUrl(data.payment_proof_path)
        
        data.payment_proof = urlData.publicUrl
      }
      
      return data as Order
    } catch (error) {
      console.error('❌ Error fetching order:', error)
      return null
    }
  }

  // Autenticación para admin
  const loginAdmin = async (email: string, password: string): Promise<boolean> => {
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password
      })
      
      if (error) {
        console.error('❌ Error logging in:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('❌ Error logging in:', error)
      return false
    }
  }

  const logoutAdmin = async () => {
    await supabase.auth.signOut()
  }

  const isAuthenticated = async () => {
    const { data } = await supabase.auth.getSession()
    return data.session !== null
  }

  // Función para obtener la URL del archivo desde Storage
  const getFileUrl = (bucket: string, path: string): string => {
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
  }

  // ============ FUNCIONES DE GESTIÓN DE PRODUCTOS (ADMIN) ============

  // Crear producto
  const createProduct = async (productData: any): Promise<boolean> => {
    try {
      console.log('💾 Guardando producto en BD:', productData);
      
      // Si hay size_chart con imágenes, generar URLs públicas
      if (productData.size_chart) {
        if (productData.size_chart.image_path) {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(productData.size_chart.image_path);
          productData.size_chart.image = data.publicUrl;
        }
        if (productData.size_chart.boys_image_path) {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(productData.size_chart.boys_image_path);
          productData.size_chart.boys_image = data.publicUrl;
        }
        if (productData.size_chart.girls_image_path) {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(productData.size_chart.girls_image_path);
          productData.size_chart.girls_image = data.publicUrl;
        }
      }

      // Si hay imágenes adicionales, generar URLs públicas
      if (productData.images && Array.isArray(productData.images)) {
        productData.images = productData.images.map((img: any) => {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(img.path);
          return {
            id: img.id,
            url: data.publicUrl,
            path: img.path,
            order: img.order
          };
        });
      }

      const { error } = await supabase
        .from('products')
        .insert({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          image_path: productData.image_path || null,
          images: productData.images || null,
          options: productData.options,
          size_chart: productData.size_chart || null,
          active: true,
        })
      
      if (error) {
        console.error('❌ Error creating product:', error)
        return false
      }
      
      console.log('✅ Producto creado exitosamente');
      return true
    } catch (error) {
      console.error('❌ Error creating product:', error)
      return false
    }
  }

  // Actualizar producto
  const updateProduct = async (productId: string, productData: any): Promise<boolean> => {
    try {
      console.log('💾 Actualizando producto en BD:', productData);
      
      // Si hay size_chart con imágenes, generar URLs públicas
      if (productData.size_chart) {
        if (productData.size_chart.image_path) {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(productData.size_chart.image_path);
          productData.size_chart.image = data.publicUrl;
        }
        if (productData.size_chart.boys_image_path) {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(productData.size_chart.boys_image_path);
          productData.size_chart.boys_image = data.publicUrl;
        }
        if (productData.size_chart.girls_image_path) {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(productData.size_chart.girls_image_path);
          productData.size_chart.girls_image = data.publicUrl;
        }
      }

      // Si hay imágenes adicionales, generar URLs públicas
      if (productData.images && Array.isArray(productData.images)) {
        productData.images = productData.images.map((img: any) => {
          const { data } = supabase.storage
            .from('products')
            .getPublicUrl(img.path);
          return {
            id: img.id,
            url: data.publicUrl,
            path: img.path,
            order: img.order
          };
        });
      }

      const { error } = await supabase
        .from('products')
        .update({
          name: productData.name,
          description: productData.description,
          price: productData.price,
          category: productData.category,
          image_path: productData.image_path || null,
          images: productData.images || null,
          options: productData.options,
          size_chart: productData.size_chart || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', productId)
      
      if (error) {
        console.error('❌ Error updating product:', error)
        return false
      }
      
      console.log('✅ Producto actualizado exitosamente');
      return true
    } catch (error) {
      console.error('❌ Error updating product:', error)
      return false
    }
  }

  // Eliminar producto (soft delete - solo marca como inactivo)
  const deleteProduct = async (productId: string): Promise<boolean> => {
    try {
      const { error } = await supabase
        .from('products')
        .update({ active: false })
        .eq('id', productId)
      
      if (error) {
        console.error('❌ Error deleting product:', error)
        return false
      }
      
      return true
    } catch (error) {
      console.error('❌ Error deleting product:', error)
      return false
    }
  }

  // Subir imagen a Storage
  const uploadProductImage = async (file: File, prefix: string = 'product'): Promise<string | null> => {
    try {
      // Generar nombre único para el archivo
      const fileExt = file.name.split('.').pop()
      const fileName = `${prefix}-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`
      const filePath = `${fileName}`

      // Subir archivo
      const { error: uploadError } = await supabase.storage
        .from('products')
        .upload(filePath, file)

      if (uploadError) {
        console.error('❌ Error uploading image:', uploadError)
        return null
      }

      return filePath
    } catch (error) {
      console.error('❌ Error uploading image:', error)
      return null
    }
  }

  return {
    supabase,
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
    createProduct,
    updateProduct,
    deleteProduct,
    uploadProductImage,
  }
}
