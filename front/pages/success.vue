<template>
  <div class="container-custom py-16">
    <div class="max-w-2xl mx-auto text-center h-[100vh]">
      <!-- Icono de éxito -->
      <div class="mb-8">
        <div class="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 class="text-4xl font-display font-bold text-gray-900 mb-4">
          ¡Pedido Enviado!
        </h1>
        <p class="text-xl text-gray-600">
          Hemos recibido tu pedido correctamente
        </p>
      </div>

      <!-- Información de contacto -->
      <div class="bg-gray-100 rounded-lg p-6 mb-8">
        <h3 class="font-bold text-gray-900 mb-3">¿Tienes alguna duda?</h3>
        <p class="text-gray-600 mb-4">
          Si tienes cualquier pregunta sobre tu pedido, no dudes en contactarnos:
        </p>
        <div class="space-y-2 text-gray-700">
          <p>
            <strong>Email:</strong> tienda@voleibolvalencia.com
          </p>
          <!-- <p>
            <strong>Teléfono:</strong> 963 XXX XXX
          </p> -->
        </div>
      </div>

      <!-- Botones de acción -->
      <div class="space-y-4">
        <NuxtLink to="/" class="btn-primary w-full block">
          Volver a la Tienda
        </NuxtLink>
        <button
          @click="generateReceipt"
          class="btn-outline w-full"
        >
            Imprimir Comprobante
        </button>
      </div>
    </div>
    
    <!-- Template oculto para impresión -->
    <div id="receipt-template" class="hidden">
      <!-- Este div se usará para generar el PDF -->
    </div>
  </div>
</template>

<script setup lang="ts">
import { useCartStore } from '~/stores/cart';

const cartStore = useCartStore();

// Guardar datos del pedido al montar (antes de que se limpie el store)
const orderData = ref<any>(null);

onMounted(() => {
  // Intentar recuperar datos del localStorage si existen
  const savedOrder = localStorage.getItem('lastOrder');
  if (savedOrder) {
    orderData.value = JSON.parse(savedOrder);
  } 
//   else if (cartStore.buyerData && cartStore.items.length > 0) {
//     // Si aún hay datos en el store, guardarlos
//     orderData.value = {
//       buyer: { ...cartStore.buyerData },
//       items: [...cartStore.items],
//       total: cartStore.total,
//       date: new Date().toISOString(),
//       orderNumber: Math.floor(Math.random() * 1000000),
//     };
//     localStorage.setItem('lastOrder', JSON.stringify(orderData.value));
//   }
});

const generateReceipt = () => {
  if (!orderData.value) {
    alert('No hay datos del pedido disponibles');
    return;
  }

  // Crear ventana de impresión
  const printWindow = window.open('', '_blank', 'width=800,height=600');
  
  if (!printWindow) {
    alert('Por favor, permite las ventanas emergentes para imprimir');
    return;
  }

  const today = new Date();
  const orderDate = new Date(orderData.value.date);
  
  // Calcular fecha de entrega (15 días después)
  const deliveryDate = new Date(orderDate);
  deliveryDate.setDate(deliveryDate.getDate() + 15);

  const subtotalSinIVA = orderData.value.total / 1.21;
  const iva = orderData.value.total - subtotalSinIVA;

  // Construir HTML en partes
  const htmlParts = [
    '<!DOCTYPE html>',
    '<html>',
    '<head>',
    '<meta charset="UTF-8">',
    '<title>Confirmación de Pedido - ' + orderData.value.orderNumber + '</title>',
    '<style>',
    '* { margin: 0; padding: 0; box-sizing: border-box; }',
    'body { font-family: Arial, sans-serif; padding: 40px; color: #333; line-height: 1.6; }',
    '.header { display: flex; justify-content: space-between; align-items: start; margin-bottom: 30px; padding-bottom: 20px; border-bottom: 3px solid #f97316; }',
    '.company-info { flex: 1; }',
    '.company-info h1 { color: #f97316; font-size: 24px; margin-bottom: 5px; }',
    '.company-info p { font-size: 11px; color: #666; margin: 2px 0; }',
    '.logo-box { width: 120px; height: 100px; border: 2px solid #ddd; background: #f8f9fa; display: flex; align-items: center; justify-content: center; color: #999; font-size: 12px; }',
    '.client-section { display: flex; justify-content: space-between; margin-bottom: 30px; }',
    '.client-box { flex: 1; margin-right: 20px; }',
    '.client-box h3 { color: #f97316; font-size: 12px; margin-bottom: 8px; font-weight: bold; }',
    '.client-box p { font-size: 11px; margin: 3px 0; }',
    '.order-title { text-align: center; margin: 30px 0 20px 0; padding: 15px; background: #f97316; color: white; font-size: 18px; font-weight: bold; }',
    '.order-details { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 11px; }',
    '.order-details div { flex: 1; }',
    '.order-details .label { color: #f97316; font-weight: bold; margin-bottom: 3px; }',
    '.order-details .value { color: #666; }',
    '.message { font-size: 11px; margin: 20px 0; line-height: 1.8; }',
    'table { width: 100%; border-collapse: collapse; margin: 20px 0; font-size: 11px; }',
    'th { background: #f97316; color: white; padding: 10px; text-align: left; font-weight: bold; }',
    'td { padding: 8px 10px; border-bottom: 1px solid #ddd; }',
    'tbody tr:nth-child(even) { background: #fff8f5; }',
    '.totals { margin-top: 20px; text-align: right; }',
    '.totals table { margin-left: auto; width: 300px; }',
    '.totals td { padding: 8px 15px; text-align: right; font-size: 12px; }',
    '.totals .total-row { font-weight: bold; font-size: 14px; background: #fff8f5; color: #f97316; }',
    '.payment-info { margin-top: 30px; padding: 15px; background: #fff8f5; border-left: 4px solid #f97316; font-size: 11px; }',
    '.footer { margin-top: 40px; padding-top: 20px; border-top: 2px solid #ddd; display: flex; justify-content: space-between; font-size: 10px; }',
    '.footer-section { flex: 1; }',
    '.footer-section h4 { color: #f97316; margin-bottom: 5px; font-size: 11px; }',
    '.signature-line { margin-top: 40px; text-align: center; }',
    '.signature-line hr { width: 250px; margin: 0 auto 5px auto; border: none; border-top: 1px solid #333; }',
    '@media print { body { padding: 20px; } }',
    '</style>',
    '</head>',
    '<body>',
    '<div class="order-title">Confirmación de pedido</div>',
    '<div class="order-details">',
    '<div><div class="label">Nº pedido:</div><div class="value">' + orderData.value.orderNumber + '</div></div>',
    '<div><div class="label">Fecha del pedido:</div><div class="value">' + orderDate.getDate().toString().padStart(2, '0') + ' | ' + (orderDate.getMonth() + 1).toString().padStart(2, '0') + ' | ' + orderDate.getFullYear().toString().split('').join(' ') + '</div></div>',
    '</div>',
    '<div class="client-box">',
    '<h3>Datos del cliente / empresa</h3>',
    '<p><strong>Jugador/a:</strong> ' + orderData.value.buyer.player_name + '</p>',
    '<p><strong>Equipo:</strong> ' + orderData.value.buyer.team + '</p>',
    '<p><strong>Padre/Madre:</strong> ' + orderData.value.buyer.parent_name + '</p>',
    '<p><strong>Email:</strong> ' + orderData.value.buyer.email + '</p>',
    '</div>',
    '<table>',
    '<thead><tr><th>Código</th><th>Artículo</th><th style="text-align: center;">Cantidad</th><th style="text-align: right;">Precio /unidad</th><th style="text-align: right;">Total</th></tr></thead>',
    '<tbody>',
  ];

  // Agregar filas de productos
  orderData.value.items.forEach((item: any) => {
    const opciones = [];
    if (item.options.talla) opciones.push('Talla: ' + item.options.talla);
    if (item.options.nombre) opciones.push('Nombre: ' + item.options.nombre);
    if (item.options.numero) opciones.push('Número: ' + item.options.numero);
    const opcionesTexto = opciones.length > 0 ? ' - ' + opciones.join(', ') : '';
    
    htmlParts.push(
      '<tr>',
      '<td>' + item.product_id.substring(0, 8) + '</td>',
      '<td>' + item.name + opcionesTexto + '</td>',
      '<td style="text-align: center;">' + item.quantity + '</td>',
      '<td style="text-align: right;">' + item.price.toFixed(2) + ' €</td>',
      '<td style="text-align: right;">' + (item.price * item.quantity).toFixed(2) + ' €</td>',
      '</tr>'
    );
  });

  htmlParts.push(
    '</tbody>',
    '</table>',
    '<div class="totals">',
    '<table>',
    '<tr><td>Subtotal sin IVA</td><td><strong>' + subtotalSinIVA.toFixed(2) + ' €</strong></td></tr>',
    '<tr><td>IVA 21%</td><td><strong>' + iva.toFixed(2) + ' €</strong></td></tr>',
    '<tr class="total-row"><td>TOTAL (EUR)</td><td><strong>' + orderData.value.total.toFixed(2) + ' €</strong></td></tr>',
    '</table>',
    '</div>',
    '<script>',
    'window.onload = function() {',
    '  window.print();',
    '  window.onafterprint = function() {',
    '    window.close();',
    '  };',
    '};',
    '</' + 'script>',
    '</body>',
    '</html>'
  );

  printWindow.document.write(htmlParts.join(''));
  printWindow.document.close();
};
</script>

<style scoped>
@media print {
  button {
    display: none;
  }
}
</style>
