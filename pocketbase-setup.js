/**
 * Script para configurar PocketBase automáticamente
 * Crea las colecciones necesarias y datos de ejemplo
 */

const POCKETBASE_URL = 'http://127.0.0.1:8090';

// Función para hacer peticiones a PocketBase
async function fetchPB(endpoint, options = {}) {
  const response = await fetch(`${POCKETBASE_URL}${endpoint}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Error ${response.status}: ${error}`);
  }
  
  return response.json();
}

// 1. Crear colección de productos
async function createProductsCollection() {
  console.log('📦 Creando colección de productos...');
  
  const schema = {
    name: 'products',
    type: 'base',
    schema: [
      {
        name: 'name',
        type: 'text',
        required: true,
        options: { min: 1, max: 200 }
      },
      {
        name: 'description',
        type: 'text',
        required: false,
        options: {}
      },
      {
        name: 'price',
        type: 'number',
        required: true,
        options: { min: 0 }
      },
      {
        name: 'image',
        type: 'file',
        required: false,
        options: { maxSelect: 1, maxSize: 5242880 }
      },
      {
        name: 'options',
        type: 'json',
        required: false,
        options: {}
      },
      {
        name: 'stock',
        type: 'number',
        required: false,
        options: { min: 0 }
      },
      {
        name: 'active',
        type: 'bool',
        required: false,
        options: {}
      }
    ],
    listRule: '',
    viewRule: '',
    createRule: null,
    updateRule: null,
    deleteRule: null,
  };
  
  try {
    const result = await fetchPB('/api/collections', {
      method: 'POST',
      body: JSON.stringify(schema),
    });
    console.log('✅ Colección de productos creada');
    return result;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Colección de productos ya existe');
    } else {
      console.error('❌ Error creando colección de productos:', error.message);
    }
  }
}

// 2. Crear colección de pedidos
async function createOrdersCollection() {
  console.log('📋 Creando colección de pedidos...');
  
  const schema = {
    name: 'orders',
    type: 'base',
    schema: [
      {
        name: 'buyer_name',
        type: 'text',
        required: true,
        options: { min: 1, max: 200 }
      },
      {
        name: 'buyer_email',
        type: 'email',
        required: true,
        options: {}
      },
      {
        name: 'buyer_phone',
        type: 'text',
        required: true,
        options: { min: 9, max: 20 }
      },
      {
        name: 'buyer_address',
        type: 'text',
        required: false,
        options: {}
      },
      {
        name: 'items',
        type: 'json',
        required: true,
        options: {}
      },
      {
        name: 'total',
        type: 'number',
        required: true,
        options: { min: 0 }
      },
      {
        name: 'payment_proof',
        type: 'file',
        required: true,
        options: { maxSelect: 1, maxSize: 5242880 }
      },
      {
        name: 'status',
        type: 'select',
        required: true,
        options: {
          maxSelect: 1,
          values: ['pending', 'confirmed', 'preparing', 'ready', 'completed', 'cancelled']
        }
      },
      {
        name: 'notes',
        type: 'text',
        required: false,
        options: {}
      }
    ],
    listRule: '',
    viewRule: '',
    createRule: '',
    updateRule: null,
    deleteRule: null,
  };
  
  try {
    const result = await fetchPB('/api/collections', {
      method: 'POST',
      body: JSON.stringify(schema),
    });
    console.log('✅ Colección de pedidos creada');
    return result;
  } catch (error) {
    if (error.message.includes('already exists')) {
      console.log('ℹ️  Colección de pedidos ya existe');
    } else {
      console.error('❌ Error creando colección de pedidos:', error.message);
    }
  }
}

// 3. Crear productos de ejemplo
async function createExampleProducts() {
  console.log('🎽 Creando productos de ejemplo...');
  
  const products = [
    {
      name: 'Sudadera Club 40 Aniversario',
      description: 'Sudadera conmemorativa del 40 aniversario del club. Diseño exclusivo con los colores corporativos y el logo del club.',
      price: 35.00,
      active: true,
      stock: 100,
      options: {
        hasTalla: true,
        hasGenero: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
        generos: ['Chico', 'Chica'],
      }
    },
    {
      name: 'Pantalón de Chándal Club',
      description: 'Pantalón oficial del club para entrenamientos. Tejido transpirable y cómodo para la práctica deportiva.',
      price: 25.00,
      active: true,
      stock: 100,
      options: {
        hasTalla: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
      }
    },
    {
      name: 'Camiseta de Juego Blanca',
      description: 'Camiseta oficial de juego color blanco. Incluye la opción de personalizar con número y nombre del jugador.',
      price: 30.00,
      active: true,
      stock: 100,
      options: {
        hasTalla: true,
        hasGenero: true,
        hasNumero: true,
        hasNombre: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
        generos: ['Chico', 'Chica'],
      }
    },
    {
      name: 'Camiseta de Juego Negra',
      description: 'Camiseta oficial de juego color negro. Incluye la opción de personalizar con número y nombre del jugador.',
      price: 30.00,
      active: true,
      stock: 100,
      options: {
        hasTalla: true,
        hasGenero: true,
        hasNumero: true,
        hasNombre: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
        generos: ['Chico', 'Chica'],
      }
    },
    {
      name: 'Camiseta de Calentamiento',
      description: 'Camiseta de calentamiento oficial del club. Ideal para antes y después de los partidos.',
      price: 22.00,
      active: true,
      stock: 100,
      options: {
        hasTalla: true,
        hasGenero: true,
        tallas: ['4XS', '3XS', '2XS', 'XS', 'S', 'M', 'L', 'XL'],
        generos: ['Chico', 'Chica'],
      }
    },
    {
      name: 'Mochila Club',
      description: 'Mochila oficial del Club Voleibol Valencia. Amplio espacio para todo tu equipo deportivo.',
      price: 20.00,
      active: true,
      stock: 50,
      options: {}
    },
  ];
  
  let created = 0;
  for (const product of products) {
    try {
      await fetchPB('/api/collections/products/records', {
        method: 'POST',
        body: JSON.stringify(product),
      });
      created++;
    } catch (error) {
      console.log(`⚠️  Producto "${product.name}" puede que ya exista`);
    }
  }
  
  console.log(`✅ ${created} productos creados de ${products.length}`);
}

// Ejecutar todo
async function setup() {
  console.log('🚀 Configurando PocketBase para Voleibol Valencia Store\n');
  
  try {
    // Verificar que PocketBase está corriendo
    await fetch(POCKETBASE_URL);
    console.log('✅ PocketBase está corriendo\n');
    
    // Crear colecciones
    await createProductsCollection();
    await createOrdersCollection();
    
    console.log('');
    
    // Crear productos de ejemplo
    await createExampleProducts();
    
    console.log('\n✨ Configuración completada!');
    console.log('\n📍 Próximos pasos:');
    console.log('1. Abre http://127.0.0.1:8090/_/ para acceder al Admin UI');
    console.log('2. Crea una cuenta de administrador si aún no lo has hecho');
    console.log('3. Puedes añadir imágenes a los productos desde el Admin UI');
    console.log('4. El frontend en http://localhost:3000 ya está conectado');
    
  } catch (error) {
    console.error('\n❌ Error durante la configuración:', error.message);
    console.log('\n💡 Asegúrate de que PocketBase está corriendo:');
    console.log('   ./pocketbase serve --http=127.0.0.1:8090');
  }
}

// Ejecutar
setup();
