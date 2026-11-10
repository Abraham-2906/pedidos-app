// src/services/ordersService.ts
import { api } from './api';

export interface Order {
  id: number;
  cliente?: string;
  customer?: string;
  total: number;
  estado?: string;
  status?: string;
  created_at?: string;
}

export const ordersService = {
  async getOrders(): Promise<Order[]> {
    // Si la API del profesor usa /pedidos en vez de /orders, ajusta la ruta aquí
    const res = await api<{ data?: Order[] } | Order[]>('/orders');
    
    // Normalizar la respuesta por si Laravel devuelve un Resource con { data: [...] }
    if (Array.isArray(res)) {
      return res;
    }
    return res.data || [];
  },
};