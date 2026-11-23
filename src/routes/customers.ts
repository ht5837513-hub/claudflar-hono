import { Hono } from "hono";
import type { Bindings } from "../types";

const customers = new Hono<{ Bindings: Bindings }>();

customers.get("/", async (c) => {
  const search = c.req.query("search");
  const query = search
    ? c.env.DB.prepare(
        "SELECT * FROM customers WHERE name LIKE ? OR phone LIKE ? ORDER BY name ASC"
      ).bind(`%${search}%`, `%${search}%`)
    : c.env.DB.prepare("SELECT * FROM customers ORDER BY name ASC");
  const { results } = await query.all();
  return c.json(results);
});

customers.get("/:id", async (c) => {
  const id = c.req.param("id");
  const customer = await c.env.DB.prepare("SELECT * FROM customers WHERE id = ?").bind(id).first();
  if (!customer) return c.json({ error: "Not found" }, 404);

  const { results: orders } = await c.env.DB.prepare(
    "SELECT * FROM orders WHERE customer_id = ? ORDER BY order_date DESC"
  )
    .bind(id)
    .all();

  return c.json({ ...customer, orders });
});

customers.post("/", async (c) => {
  const body = await c.req.json<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  }>();
  if (!body.name?.trim()) {
    return c.json({ error: "name is required" }, 400);
  }
  const result = await c.env.DB.prepare(
    "INSERT INTO customers (name, phone, email, address, notes) VALUES (?, ?, ?, ?, ?) RETURNING *"
  )
    .bind(
      body.name.trim(),
      body.phone ?? null,
      body.email ?? null,
      body.address ?? null,
      body.notes ?? null
    )
    .first();
  return c.json(result, 201);
});

customers.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{
    name?: string;
    phone?: string;
    email?: string;
    address?: string;
    notes?: string;
  }>();

  const existing = await c.env.DB.prepare("SELECT * FROM customers WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Not found" }, 404);

  const name = body.name?.trim() ?? existing.name;
  const phone = body.phone ?? existing.phone;
  const email = body.email ?? existing.email;
  const address = body.address ?? existing.address;
  const notes = body.notes ?? existing.notes;

  const result = await c.env.DB.prepare(
    `UPDATE customers SET name = ?, phone = ?, email = ?, address = ?, notes = ?, updated_at = datetime('now')
     WHERE id = ? RETURNING *`
  )
    .bind(name, phone, email, address, notes, id)
    .first();

  return c.json(result);
});

customers.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM customers WHERE id = ?").bind(id).run();
  return c.body(null, 204);
});

export default customers;
