import { Hono } from "hono";
import type { Bindings } from "../types";

const tasks = new Hono<{ Bindings: Bindings }>();

tasks.get("/", async (c) => {
  const status = c.req.query("status");
  const query = status
    ? c.env.DB.prepare(
        "SELECT * FROM tasks WHERE status = ? ORDER BY (due_date IS NULL), due_date ASC, id DESC"
      ).bind(status)
    : c.env.DB.prepare("SELECT * FROM tasks ORDER BY (due_date IS NULL), due_date ASC, id DESC");
  const { results } = await query.all();
  return c.json(results);
});

tasks.post("/", async (c) => {
  const body = await c.req.json<{
    title?: string;
    description?: string;
    due_date?: string;
    priority?: string;
  }>();

  if (!body.title?.trim()) {
    return c.json({ error: "title is required" }, 400);
  }
  const priority = ["low", "medium", "high"].includes(body.priority ?? "")
    ? body.priority
    : "medium";

  const result = await c.env.DB.prepare(
    "INSERT INTO tasks (title, description, due_date, priority) VALUES (?, ?, ?, ?) RETURNING *"
  )
    .bind(body.title.trim(), body.description ?? null, body.due_date ?? null, priority)
    .first();

  return c.json(result, 201);
});

tasks.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{
    title?: string;
    description?: string;
    due_date?: string;
    priority?: string;
    status?: string;
  }>();

  const existing = await c.env.DB.prepare("SELECT * FROM tasks WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Not found" }, 404);

  const title = body.title?.trim() ?? existing.title;
  const description = body.description ?? existing.description;
  const due_date = body.due_date ?? existing.due_date;
  const priority = ["low", "medium", "high"].includes(body.priority ?? "")
    ? body.priority
    : existing.priority;
  const status = ["pending", "done"].includes(body.status ?? "") ? body.status : existing.status;

  const result = await c.env.DB.prepare(
    `UPDATE tasks SET title = ?, description = ?, due_date = ?, priority = ?, status = ?, updated_at = datetime('now')
     WHERE id = ? RETURNING *`
  )
    .bind(title, description, due_date, priority, status, id)
    .first();

  return c.json(result);
});

tasks.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM tasks WHERE id = ?").bind(id).run();
  return c.body(null, 204);
});

export default tasks;
