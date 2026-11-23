export type Bindings = {
  DB: D1Database;
  APP_TOKEN: string;
};

export type Priority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "done";
export type OrderStatus = "pending" | "confirmed" | "shipped" | "delivered" | "cancelled";

export interface Task {
  id: number;
  title: string;
  description: string | null;
  due_date: string | null;
  priority: Priority;
  status: TaskStatus;
  created_at: string;
  updated_at: string;
}

export interface Note {
  id: number;
  title: string;
  content: string | null;
  created_at: string;
  updated_at: string;
}

export interface Customer {
  id: number;
  name: string;
  phone: string | null;
  email: string | null;
  address: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: number;
  customer_id: number;
  items: string;
  total_amount: number;
  status: OrderStatus;
  order_date: string;
  delivery_date: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}
