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
  size_chart?: SizeChart;  // Tabla de tallas personalizada (opcional)
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

// Interfaz para la tabla de tallas
export interface SizeChart {
  enabled: boolean;                    // Si está habilitada para este producto
  unit: 'cm' | 'inches';              // Unidad de medida
  hasSeparateGenders: boolean;        // Si tiene tablas separadas para chico/chica
  // Tabla única (si hasSeparateGenders = false)
  columns?: SizeChartColumn[];        // Columnas de medidas (ej: Pecho, Cintura, Largo)
  rows?: SizeChartRow[];              // Filas con tallas y medidas
  // Tablas separadas por género (si hasSeparateGenders = true)
  boys?: {
    columns: SizeChartColumn[];
    rows: SizeChartRow[];
  };
  girls?: {
    columns: SizeChartColumn[];
    rows: SizeChartRow[];
  };
}

export interface SizeChartColumn {
  id: string;                         // ID único de la columna
  name: string;                       // Nombre de la medida (ej: "Pecho", "Cintura", "Largo")
}

export interface SizeChartRow {
  size: string;                       // Talla (ej: "S", "M", "L", "XL")
  measurements: Record<string, string>; // Objeto con medidas { columnId: valor }
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
  created_at?: string;
  updated_at?: string;
}

export type OrderStatus = 
  | 'en_revision'        // Estado inicial - pendiente de revisar comprobante
  | 'revisado'           // Pago verificado y aprobado
  | 'pedido'             // Pedido confirmado al proveedor
  | 'preparado'          // Listo para recoger en el club
  | 'recogido'           // Cliente ha recogido el pedido (final)
  | 'cancelado';         // Pedido cancelado

// Labels amigables para mostrar en la UI
export const ORDER_STATUS_LABELS: Record<OrderStatus, string> = {
  en_revision: 'Pendiente',
  revisado: 'Revisado',
  pedido: 'Pedido Realizado',
  preparado: 'Preparado',
  recogido: 'Recogido',
  cancelado: 'Cancelado',
};

// Colores para cada estado (Tailwind CSS)
export const ORDER_STATUS_COLORS: Record<OrderStatus, string> = {
  en_revision: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  revisado: 'bg-blue-100 text-blue-800 border-blue-200',
  pedido: 'bg-purple-100 text-purple-800 border-purple-200',
  preparado: 'bg-green-100 text-green-800 border-green-200',
  recogido: 'bg-gray-100 text-gray-800 border-gray-200',
  cancelado: 'bg-red-100 text-red-800 border-red-200',
};

export const TEAMS = [
  'Benjamín',
  'Alevín',
  'Infantil Femenino',
  'Infantil Masculino',
  'Cadete Femenino',
  'Cadete Masculino',
  'Juvenil Femenino',
  'Juvenil Masculino',
  'Junior Femenino',
  'Junior Masculino',
  'Senior Femenino',
  'Senior Masculino',
] as const;

export type Team = typeof TEAMS[number];
