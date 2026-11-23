import { Hono } from "hono";
import type { Bindings } from "./types";
import { requireToken } from "./middleware/auth";
import { dashboardHtml } from "./views/dashboard";
import tasks from "./routes/tasks";
import notes from "./routes/notes";
import customers from "./routes/customers";
import orders from "./routes/orders";
import summary from "./routes/summary";

const app = new Hono<{ Bindings: Bindings }>();

app.get("/", (c) => c.html(dashboardHtml));

const api = new Hono<{ Bindings: Bindings }>();
api.use("*", requireToken);
api.route("/tasks", tasks);
api.route("/notes", notes);
api.route("/customers", customers);
api.route("/orders", orders);
api.route("/summary", summary);

app.route("/api", api);

app.notFound((c) => c.json({ error: "Not found" }, 404));

export default app;
