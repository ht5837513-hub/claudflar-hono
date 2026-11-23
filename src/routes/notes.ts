import { Hono } from "hono";
import type { Bindings } from "../types";

const notes = new Hono<{ Bindings: Bindings }>();

notes.get("/", async (c) => {
  const { results } = await c.env.DB.prepare("SELECT * FROM notes ORDER BY updated_at DESC").all();
  return c.json(results);
});

notes.post("/", async (c) => {
  const body = await c.req.json<{ title?: string; content?: string }>();
  if (!body.title?.trim()) {
    return c.json({ error: "title is required" }, 400);
  }
  const result = await c.env.DB.prepare(
    "INSERT INTO notes (title, content) VALUES (?, ?) RETURNING *"
  )
    .bind(body.title.trim(), body.content ?? null)
    .first();
  return c.json(result, 201);
});

notes.patch("/:id", async (c) => {
  const id = c.req.param("id");
  const body = await c.req.json<{ title?: string; content?: string }>();

  const existing = await c.env.DB.prepare("SELECT * FROM notes WHERE id = ?").bind(id).first();
  if (!existing) return c.json({ error: "Not found" }, 404);

  const title = body.title?.trim() ?? existing.title;
  const content = body.content ?? existing.content;

  const result = await c.env.DB.prepare(
    "UPDATE notes SET title = ?, content = ?, updated_at = datetime('now') WHERE id = ? RETURNING *"
  )
    .bind(title, content, id)
    .first();

  return c.json(result);
});

notes.delete("/:id", async (c) => {
  const id = c.req.param("id");
  await c.env.DB.prepare("DELETE FROM notes WHERE id = ?").bind(id).run();
  return c.body(null, 204);
});

export default notes;
