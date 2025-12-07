import "dotenv/config";
import express, { RequestHandler } from "express";
import cors from "cors";
import { v4 as uuidv4 } from "crypto";
import { handleDemo } from "./routes/demo";

interface MenuItem {
  item_key: string;
  name: string;
  price: number;
  qty: number;
}

interface OrderPayload {
  guest_name: string;
  room_no: string;
  notes: string;
  menu_version: string;
  items: MenuItem[];
}

interface OrderItem {
  id: string;
  order_id: string;
  item_key: string;
  name: string;
  qty: number;
  price: number;
}

interface Order {
  id: string;
  order_no: string;
  created_at: string;
  updated_at: string;
  guest_name: string;
  room_no: string;
  notes: string;
  menu_version: string;
  status: string;
  payment_status: string;
  history: string;
  total: number;
  items?: OrderItem[];
}

// In-memory storage for orders (for simplicity in this version)
const ordersStore: Map<string, Order> = new Map();
const orderItemsStore: Map<string, OrderItem[]> = new Map();

// Helper: generate order number
function makeOrderNo(): string {
  const d = new Date();
  const y = d.getFullYear().toString().slice(-2);
  const m = (d.getMonth() + 1).toString().padStart(2, "0");
  const day = d.getDate().toString().padStart(2, "0");
  const ts = Date.now().toString().slice(-5);
  return `ORD-${y}${m}${day}-${ts}`;
}

// Authentication middleware
const requireAuth: RequestHandler = (req, res, next) => {
  const pass = (req.headers["x-passphrase"] as string) || req.query.pass;
  if (pass && pass === (process.env.ADMIN_PASSPHRASE || "letmein")) {
    return next();
  }
  return res.status(401).json({ error: "Unauthorized" });
};

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  // ====== ORDER MANAGEMENT ROUTES ======

  // Create new order
  app.post("/api/orders", requireAuth, (req, res) => {
    const payload = req.body as OrderPayload;
    const id = uuidv4();
    const order_no = makeOrderNo();
    const now = new Date().toISOString();
    let total = 0;

    payload.items.forEach((item) => {
      total += item.price * item.qty;
    });

    const order: Order = {
      id,
      order_no,
      created_at: now,
      updated_at: now,
      guest_name: payload.guest_name || "",
      room_no: payload.room_no || "",
      notes: payload.notes || "",
      menu_version: payload.menu_version || "RestoVersion",
      status: "New",
      payment_status: "Not Paid",
      history: JSON.stringify([{ when: now, action: "Created" }]),
      total,
    };

    // Store items
    const items: OrderItem[] = payload.items.map((item) => ({
      id: uuidv4(),
      order_id: id,
      item_key: item.item_key,
      name: item.name,
      qty: item.qty,
      price: item.price,
    }));

    ordersStore.set(id, order);
    orderItemsStore.set(id, items);

    const savedOrder = {
      ...order,
      items,
      history: JSON.parse(order.history),
    };

    res.json(savedOrder);
  });

  // Get single order
  app.get("/api/orders/:id", requireAuth, (req, res) => {
    const order = ordersStore.get(req.params.id);
    if (!order) return res.status(404).json({ error: "not found" });

    const items = orderItemsStore.get(req.params.id) || [];
    res.json({
      ...order,
      items,
      history: JSON.parse(order.history),
    });
  });

  // List orders with filters
  app.get("/api/orders", requireAuth, (req, res) => {
    const { date, status, room_no } = req.query;

    let filtered = Array.from(ordersStore.values());

    if (date) {
      const selectedDate = new Date(date as string);
      const start = new Date(selectedDate);
      start.setHours(0, 0, 0, 0);
      const end = new Date(selectedDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.created_at);
        return orderDate >= start && orderDate <= end;
      });
    }

    if (status) {
      filtered = filtered.filter((order) => order.status === status);
    }

    if (room_no) {
      filtered = filtered.filter((order) => order.room_no === room_no);
    }

    const result = filtered
      .sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      )
      .map((order) => ({
        ...order,
        items: orderItemsStore.get(order.id) || [],
        history: JSON.parse(order.history),
      }));

    res.json(result);
  });

  // Add items to existing order
  app.post("/api/orders/:id/items", requireAuth, (req, res) => {
    const order = ordersStore.get(req.params.id);
    if (!order) return res.status(404).json({ error: "order not found" });

    const newItems = (req.body.items as MenuItem[]) || [];
    const items = orderItemsStore.get(req.params.id) || [];

    let addedTotal = 0;
    const itemsToAdd: OrderItem[] = newItems.map((item) => {
      addedTotal += item.price * item.qty;
      return {
        id: uuidv4(),
        order_id: req.params.id,
        item_key: item.item_key,
        name: item.name,
        qty: item.qty,
        price: item.price,
      };
    });

    items.push(...itemsToAdd);
    order.total += addedTotal;
    order.updated_at = new Date().toISOString();

    const history = JSON.parse(order.history);
    history.push({
      when: order.updated_at,
      action: `Added ${newItems.length} items`,
    });
    order.history = JSON.stringify(history);
    order.status = "Updated";

    orderItemsStore.set(req.params.id, items);
    ordersStore.set(req.params.id, order);

    res.json({
      ...order,
      items,
      history: JSON.parse(order.history),
    });
  });

  // Update order (status, payment_status, etc)
  app.put("/api/orders/:id", requireAuth, (req, res) => {
    const order = ordersStore.get(req.params.id);
    if (!order) return res.status(404).json({ error: "order not found" });

    const { status, payment_status, requested_time, notes } = req.body;
    const now = new Date().toISOString();
    const history = JSON.parse(order.history);

    if (status && status !== order.status) {
      history.push({ when: now, action: `Status -> ${status}` });
      order.status = status;
    }

    if (payment_status && payment_status !== order.payment_status) {
      history.push({ when: now, action: `Payment -> ${payment_status}` });
      order.payment_status = payment_status;
    }

    if (requested_time) order.notes = requested_time;
    if (notes !== undefined) order.notes = notes;

    order.updated_at = now;
    order.history = JSON.stringify(history);

    ordersStore.set(req.params.id, order);

    const items = orderItemsStore.get(req.params.id) || [];
    res.json({
      ...order,
      items,
      history: JSON.parse(order.history),
    });
  });

  // Send WhatsApp notification (simulated)
  app.post("/api/orders/:id/send-whatsapp", requireAuth, (_req, res) => {
    const order = ordersStore.get(_req.params.id);
    if (!order) return res.status(404).json({ error: "order not found" });

    const items = orderItemsStore.get(_req.params.id) || [];
    const now = new Date().toISOString();
    const history = JSON.parse(order.history);
    history.push({ when: now, action: "WhatsApp sent to kitchen" });
    order.history = JSON.stringify(history);

    ordersStore.set(_req.params.id, order);

    // In a real implementation, this would send a WhatsApp message via Twilio
    res.json({ ok: true });
  });

  // Print bill
  app.get("/api/orders/:id/print", requireAuth, (req, res) => {
    const order = ordersStore.get(req.params.id);
    if (!order) return res.status(404).send("Order not found");

    const items = orderItemsStore.get(req.params.id) || [];
    const itemsHtml = items
      .map(
        (item) =>
          `<tr><td>${item.name}</td><td style="text-align:center">${item.qty}</td><td style="text-align:right">₹${item.price}</td><td style="text-align:right">₹${item.qty * item.price}</td></tr>`
      )
      .join("");

    const html = `
    <html>
    <head>
      <title>Bill ${order.order_no}</title>
      <style>
        body{ font-family: Arial, sans-serif; width:300px; margin:0; padding:8px; }
        h2{ text-align:center; margin:6px 0; }
        table{ width:100%; font-size:12px; border-collapse: collapse; }
        td,th{ padding:3px; }
        .right{ text-align:right; }
        .center{ text-align:center; }
        .footer{ font-size:11px; margin-top:8px; text-align:center; }
      </style>
    </head>
    <body>
      <h2>Lucent's Resto</h2>
      <div>Order: ${order.order_no}</div>
      <div>Date: ${new Date(order.created_at).toLocaleString()}</div>
      <div>Guest: ${order.guest_name || "-"} | Room: ${order.room_no || "-"}</div>
      <table>
        <thead><tr><th>Item</th><th class="center">Qty</th><th class="right">Rate</th><th class="right">Amt</th></tr></thead>
        <tbody>${itemsHtml}</tbody>
      </table>
      <hr/>
      <div style="display:flex; justify-content:space-between;"><div>Subtotal</div><div>₹${order.total}</div></div>
      <div style="display:flex; justify-content:space-between;"><div>Tax</div><div>₹0</div></div>
      <div style="display:flex; justify-content:space-between; font-weight:bold;"><div>Total</div><div>₹${order.total}</div></div>
      <div class="footer">Payment status: ${order.payment_status || "Not Paid"}</div>
      <div class="footer">Thank you. Please settle at checkout.</div>
      <script>window.print();</script>
    </body>
    </html>`;
    res.send(html);
  });

  // CSV export
  app.get("/api/export/csv", requireAuth, (req, res) => {
    const { date } = req.query;
    if (!date) return res.status(400).json({ error: "date required" });

    const selectedDate = new Date(date as string);
    const start = new Date(selectedDate);
    start.setHours(0, 0, 0, 0);
    const end = new Date(selectedDate);
    end.setHours(23, 59, 59, 999);

    const rows = Array.from(ordersStore.values()).filter((order) => {
      const orderDate = new Date(order.created_at);
      return orderDate >= start && orderDate <= end;
    });

    const lines = [
      "order_no,created_at,guest_name,room_no,total,status,payment_status,items",
    ];

    for (const order of rows) {
      const items = orderItemsStore.get(order.id) || [];
      const itemsStr = items.map((x) => `${x.qty}x ${x.name}`).join("|");
      lines.push(
        `"${order.order_no}","${order.created_at}","${order.guest_name}","${order.room_no}",${order.total},"${order.status}","${order.payment_status}","${itemsStr}"`
      );
    }

    res.setHeader("Content-Disposition", `attachment; filename="orders-${date}.csv"`);
    res.setHeader("Content-Type", "text/csv");
    res.send(lines.join("\n"));
  });

  return app;
}
