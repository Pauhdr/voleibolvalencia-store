// Tipos para el sistema de pedidos

export interface Product {
  id: string;
  name: string;
  price: number;
  description?: string;
  image?: string;
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
  buyer_name: string;
  buyer_email: string;
  player_name: string;
  team: string;
  products: CartItem[];
  proof?: File | string;
  status: 'pendiente' | 'revisado' | 'entregado';
  total: number;
  transfer_reference?: string;
  created?: string;
  updated?: string;
}

export type OrderStatus = 'pendiente' | 'revisado' | 'entregado';

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
