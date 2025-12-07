import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Plus,
  X,
  Printer,
  Send,
  ChevronLeft,
} from "lucide-react";
import { MenuItem, RESTO_VERSION_MENU, groupMenuByCategory } from "@shared/menu";
import { cn } from "@/lib/utils";

interface OrderItem {
  id: string;
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
  total: number;
  status: string;
  payment_status: string;
  items: OrderItem[];
  history: Array<{ when: string; action: string }>;
}

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [showAddItems, setShowAddItems] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [menu] = useState<MenuItem[]>(RESTO_VERSION_MENU);

  const categories = groupMenuByCategory(menu);
  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const fetchOrder = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/orders/${id}`, {
        headers: {
          "x-passphrase": "letmein",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrder(data);
      }
    } catch (error) {
      console.error("Error fetching order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchOrder();
    }
  }, [id]);

  const handleStatusChange = async (newStatus: string) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-passphrase": "letmein",
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handlePaymentStatusChange = async (newPaymentStatus: string) => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "x-passphrase": "letmein",
        },
        body: JSON.stringify({ payment_status: newPaymentStatus }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
      }
    } catch (error) {
      console.error("Error updating payment status:", error);
    }
  };

  const handleAddItems = async (items: MenuItem[]) => {
    if (!order || items.length === 0) return;

    try {
      const itemsToAdd = items.map((item) => ({
        item_key: item.id,
        name: item.name,
        price: item.price,
        qty: 1,
      }));

      const response = await fetch(`/api/orders/${order.id}/items`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-passphrase": "letmein",
        },
        body: JSON.stringify({ items: itemsToAdd }),
      });

      if (response.ok) {
        const updatedOrder = await response.json();
        setOrder(updatedOrder);
        setShowAddItems(false);
        setSearchTerm("");
        setSelectedCategory(null);
      }
    } catch (error) {
      console.error("Error adding items:", error);
    }
  };

  const handleSendWhatsApp = async () => {
    if (!order) return;

    try {
      const response = await fetch(`/api/orders/${order.id}/send-whatsapp`, {
        method: "POST",
        headers: {
          "x-passphrase": "letmein",
        },
      });

      if (response.ok) {
        alert("WhatsApp message sent to kitchen!");
        fetchOrder();
      } else {
        alert("Failed to send WhatsApp message");
      }
    } catch (error) {
      console.error("Error sending WhatsApp:", error);
      alert("WhatsApp not configured");
    }
  };

  const handlePrint = () => {
    if (!order) return;
    window.open(`/api/orders/${order.id}/print?pass=letmein`, "_blank");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gold-dark text-white flex items-center justify-center">
        <p className="text-muted-foreground">Loading order...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="min-h-screen bg-gold-dark text-white flex flex-col items-center justify-center">
        <p className="text-muted-foreground mb-4">Order not found</p>
        <Button
          onClick={() => navigate("/orders")}
          className="bg-primary text-primary-foreground hover:bg-primary/90"
        >
          Back to Orders
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gold-dark text-white">
      {/* Header */}
      <header className="bg-gold-dark border-b border-gold-light sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button
                onClick={() => navigate("/orders")}
                className="p-2 hover:bg-gold-light rounded-lg transition"
              >
                <ChevronLeft className="w-6 h-6 text-primary" />
              </button>
              <div>
                <h1 className="text-3xl font-serif text-primary">
                  {order.order_no}
                </h1>
                <p className="text-muted-foreground text-sm mt-1">
                  {new Date(order.created_at).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Guest Details */}
            <div className="bg-gold-light rounded-lg p-6 mb-6">
              <h2 className="text-xl font-bold text-gold-dark mb-4">
                Guest Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gold-dark/70">Guest Name</p>
                  <p className="font-semibold text-gold-dark">
                    {order.guest_name}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gold-dark/70">Room Number</p>
                  <p className="font-semibold text-gold-dark">
                    {order.room_no}
                  </p>
                </div>
                <div className="col-span-2">
                  <p className="text-sm text-gold-dark/70">Special Requests</p>
                  <p className="text-gold-dark">{order.notes || "-"}</p>
                </div>
              </div>
            </div>

            {/* Items */}
            <div className="bg-gold-light rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-bold text-gold-dark">Order Items</h2>
                <Button
                  onClick={() => setShowAddItems(true)}
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Items
                </Button>
              </div>

              <div className="space-y-3">
                {order.items.map((item) => (
                  <div
                    key={item.id}
                    className="bg-gold-dark/20 rounded-lg p-3 flex items-center justify-between"
                  >
                    <div>
                      <p className="font-semibold text-gold-dark">
                        {item.name}
                      </p>
                      <p className="text-sm text-gold-dark/70">
                        ₹{item.price} × {item.qty}
                      </p>
                    </div>
                    <p className="font-bold text-primary">
                      ₹{item.price * item.qty}
                    </p>
                  </div>
                ))}
              </div>

              <div className="mt-4 pt-4 border-t border-gold-dark/30">
                <div className="flex justify-between items-center font-bold">
                  <span className="text-gold-dark">Total Amount:</span>
                  <span className="text-primary text-xl">₹{order.total}</span>
                </div>
              </div>
            </div>

            {/* Order History */}
            {order.history && order.history.length > 0 && (
              <div className="bg-gold-light rounded-lg p-6">
                <h2 className="text-xl font-bold text-gold-dark mb-4">
                  Order History
                </h2>
                <div className="space-y-2">
                  {order.history.map((entry, idx) => (
                    <div key={idx} className="text-sm text-gold-dark/70">
                      <span className="font-semibold">
                        {new Date(entry.when).toLocaleString()}:
                      </span>{" "}
                      {entry.action}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar - Status & Actions */}
          <div className="lg:col-span-1">
            <div className="bg-gold-light rounded-lg p-6 sticky top-24">
              {/* Status */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gold-dark mb-2">
                  Order Status
                </label>
                <select
                  value={order.status}
                  onChange={(e) => handleStatusChange(e.target.value)}
                  className="w-full bg-gold-dark border-0 text-white rounded px-3 py-2"
                >
                  <option value="New">New</option>
                  <option value="Preparing">Preparing</option>
                  <option value="Ready">Ready</option>
                  <option value="Served">Served</option>
                  <option value="Completed">Completed</option>
                  <option value="Updated">Updated</option>
                </select>
              </div>

              {/* Payment Status */}
              <div className="mb-6">
                <label className="block text-sm font-semibold text-gold-dark mb-2">
                  Payment Status
                </label>
                <select
                  value={order.payment_status}
                  onChange={(e) => handlePaymentStatusChange(e.target.value)}
                  className="w-full bg-gold-dark border-0 text-white rounded px-3 py-2"
                >
                  <option value="Not Paid">Not Paid</option>
                  <option value="Paid">Paid</option>
                  <option value="Partial">Partial</option>
                </select>
              </div>

              {/* Action Buttons */}
              <div className="space-y-3">
                <Button
                  onClick={handleSendWhatsApp}
                  className="w-full bg-green-600 text-white hover:bg-green-700"
                >
                  <Send className="w-4 h-4 mr-2" />
                  Send to Kitchen
                </Button>
                <Button
                  onClick={handlePrint}
                  className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  <Printer className="w-4 h-4 mr-2" />
                  Print Bill
                </Button>
              </div>

              {/* Summary */}
              <div className="mt-6 pt-6 border-t border-gold-dark/30">
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-gold-dark/70">Items:</span>
                    <span className="font-semibold text-gold-dark">
                      {order.items.length}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gold-dark/70">Total:</span>
                    <span className="font-bold text-primary text-lg">
                      ₹{order.total}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Items Modal */}
      <Dialog open={showAddItems} onOpenChange={setShowAddItems}>
        <DialogContent className="bg-gold-light border-0 text-gold-dark max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-gold-dark">Add Items to Order</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            {/* Search */}
            <div>
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-gold-dark border-0 text-white placeholder:text-gold-dark/50"
              />
            </div>

            {/* Category Filters */}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-3 py-1 rounded text-sm font-semibold transition",
                  !selectedCategory
                    ? "bg-primary text-primary-foreground"
                    : "bg-gold-dark/20 text-gold-dark hover:bg-gold-dark/30"
                )}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.name ? null : cat.name
                    )
                  }
                  className={cn(
                    "px-3 py-1 rounded text-sm font-semibold transition",
                    selectedCategory === cat.name
                      ? "bg-primary text-primary-foreground"
                      : "bg-gold-dark/20 text-gold-dark hover:bg-gold-dark/30"
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Menu Items */}
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredMenu.map((item) => (
                <button
                  key={item.id}
                  onClick={() => handleAddItems([item])}
                  className="w-full text-left bg-gold-dark/20 rounded-lg p-3 hover:bg-gold-dark/30 transition"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-semibold text-gold-dark">
                        {item.name}
                      </p>
                      <p className="text-sm text-gold-dark/70">
                        {item.category}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-primary">₹{item.price}</p>
                      <Button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleAddItems([item]);
                        }}
                        className="mt-1 bg-primary text-primary-foreground hover:bg-primary/90 text-xs px-2 py-1"
                      >
                        Add
                      </Button>
                    </div>
                  </div>
                </button>
              ))}
            </div>

            <Button
              onClick={() => setShowAddItems(false)}
              variant="outline"
              className="w-full bg-gold-dark/20 border-gold-dark text-gold-dark hover:bg-gold-dark/30"
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
