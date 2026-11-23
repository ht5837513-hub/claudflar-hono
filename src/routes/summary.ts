import { Hono } from "hono";
import type { Bindings } from "../types";

const summary = new Hono<{ Bindings: Bindings }>();

summary.get("/", async (c) => {
  const today = new Date().toISOString().slice(0, 10);

  const [dueToday, overdue, pendingTasks, pendingOrders, customerCount] = await Promise.all([
    c.env.DB.prepare("SELECT COUNT(*) AS n FROM tasks WHERE status = 'pending' AND due_date = ?")
      .bind(today)
      .first<{ n: number }>(),
    c.env.DB.prepare(
      "SELECT COUNT(*) AS n FROM tasks WHERE status = 'pending' AND due_date IS NOT NULL AND due_date < ?"
    )
      .bind(today)
      .first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) AS n FROM tasks WHERE status = 'pending'").first<{ n: number }>(),
    c.env.DB.prepare("SELECT COUNT(*) AS n FROM orders WHERE status IN ('pending', 'confirmed')").first<{
      n: number;
    }>(),
    c.env.DB.prepare("SELECT COUNT(*) AS n FROM customers").first<{ n: number }>(),
  ]);

  return c.json({
    due_today: dueToday?.n ?? 0,
    overdue: overdue?.n ?? 0,
    pending_tasks: pendingTasks?.n ?? 0,
    pending_orders: pendingOrders?.n ?? 0,
    customers: customerCount?.n ?? 0,
  });
});

export default summary;
