import { Hono } from "hono";
import type { Bindings, OrderStatus } from "../types";

const orders = new Hono<{ Bindings: Bindings }>();

const VALID_STATUSES: OrderStatus[] = ["pending", "confirmed", "shipped", "delivered", "cancelled"];

orders.get("/", async (c) => {
  const status = c.req.query("status");
  const query = status
    ? c.env.DB.prepare(
        `SELECT orders.*, customers.name AS customer_name FROM orders
         JOIN customers ON customers.id = orders.customer_id
         WHERE orders.status = ? ORDER BY orders.order_date DESC`
      ).bind(status)
    : c.env.DB.prepare(
        `SELECT orders.*, customers.name AS customer_name FROM orders
         JOIN customers ON customers.id = orders.customer_id
         ORDER BY orders.order_date DESC`
      );
  const { results } = await query.all();
  return c.json(results);
});

orders.post("/", async (c) => {
  const body = await c.req.json<{
    customer_id?: number;
    items?: unknown;
    total_amount?: number;
    status?: string;
    delivery_date?: string;
    notes?: string;
  }>();

  if (!body.customer_id) {
    return c.json({ error: "customer_id is required" }, 400);
  }

  const customer = await c.env.DB.prepare("SELECT id FROM customers WHERE id = ?")
    .bind(body.customer_id)
    .first();
  if (!customer) return c.json({ error: "customer not found" }, 404);

  const status = VALID_STATUSES.includes(body.status as OrderStatus) ? body.status : "pending";
  const items = JSON.stringify(body.items ?? []);
  const total_amount = typeof body.total_amount === "number" ? body.total_amount : 0;

  const result = await c.env.DB.prepare(
    `INSERT INTO orders (customer_id, items, total_amount, status, delivery_date, notes)
     VALUES (?, ?, ?, ?, ?, ?) RETURNING *`
  )
    .bind(body.customer_id, items, total_amount, status, body.delivery_date ?? null, body.notes ?? null)
    .first();

  return c.json(result, 201);
});

orders.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{
    items?: unknown;
    total_amount?: number;
    status?: string;
    delivery_date?: string;
    notes?: string;
  }>();

  const existing = await c.env.DB.prepare("SELECT * FROM orders WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Not found" }, 404);

  const items = body.items !== undefined ? JSON.stringify(body.items) : existing.items;
  const total_amount = typeof body.total_amount === "number" ? body.total_amount : existing.total_amount;
  const status = VALID_STATUSES.includes(body.status as OrderStatus) ? body.status : existing.status;
  const delivery_date = body.delivery_date ?? existing.delivery_date;
  const notes = body.notes ?? existing.notes;

  const result = await c.env.DB.prepare(
    `UPDATE orders SET items = ?, total_amount = ?, status = ?, delivery_date = ?, notes = ?, updated_at = datetime('now')
     WHERE id = ? RETURNING *`
  )
    .bind(items, total_amount, status, delivery_date, notes, id)
    .first();

  return c.json(result);
});

orders.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM orders WHERE id = ?").bind(id).run();
  return c.body(null, 204);
});

export default orders;
