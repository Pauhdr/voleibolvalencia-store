// Tipos para el sistema de pedidos

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;          // URL pública de la imagen (generada desde image_path)
  image_path?: string;     // Path del archivo en Supabase Storage
  options: ProductOptions;
  category?: string;
}

export interface ProductOptions {
  hasTalla?: boolean;
  hasGenero?: boolean;
  hasNumero?: boolean;
  hasNombre?: boolean;
  hasColor?: boolean;
  tallas?: string[];
  generos?: string[];
  colores?: string[];
}

export interface CartItem {
  product_id: string;
  name: string;
  quantity: number;
  price: number;
  image?: string;
  options: SelectedOptions;
}

export interface SelectedOptions {
  talla?: string;
  genero?: string;
  nombre?: string;
  numero?: string;
  color?: string;
}

export interface BuyerData {
  player_name: string;
  team: string;
  parent_name: string;
  email: string;
}

export interface Order {
  id?: string;
  player_name: string;
  team: string;
  parent_name: string;
  email: string;
  transfer_reference?: string;
  items: CartItem[];
  payment_proof?: File | string;
  status: OrderStatus;
  total: number;
  created?: string;
  updated?: string;
}

export type OrderStatus = 
  | 'en_revision'        // Estado inicial - pendiente de revisar comprobante
  | 'revisado'           // Pago verificado y aprobado
  | 'pedido_realizado'   // Pedido confirmado al proveedor
  | 'preparado'          // Listo para recoger en el club
  | 'recogido'           // Cliente ha recogido el pedido (final)
  | 'cancelado';         // Pedido cancelado

// Labels amigables para mostrar en la UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  en_revision: '🔍 En Revisión',
  revisado: '✅ Revisado',
  pedido_realizado: '📦 Pedido Realizado',
  preparado: '🎽 Preparado para Recoger',
  recogido: '✔️ Recogido',
  cancelado: '❌ Cancelado',
};

// Colores para cada estado (Tailwind CSS)
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  en_revision: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  revisado: 'bg-blue-100 text-blue-800 border-blue-200',
  pedido_realizado: 'bg-purple-100 text-purple-800 border-purple-200',
  preparado: 'bg-green-100 text-green-800 border-green-200',
  recogido: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
};

export const TEAMS = [
  'Benjamín Mixto',
  'Alevín Femenino',
  'Alevín Masculino',
  'Infantil Femenino',
  'Infantil Masculino',
  'Cadete Femenino',
  'Cadete Masculino',
  'Juvenil Femenino',
  'Juvenil Masculino',
  'Senior Femenino',
  'Senior Masculino',
] as const;

export type Team = typeof TEAMS[number];
