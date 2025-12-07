import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, Download, Eye } from "lucide-react";
import { Link } from "react-router-dom";
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
  guest_name: string;
  room_no: string;
  total: number;
  status: string;
  payment_status: string;
  items: OrderItem[];
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (selectedDate) params.append("date", selectedDate);
      if (selectedStatus) params.append("status", selectedStatus);

      const response = await fetch(`/api/orders?${params.toString()}`, {
        headers: {
          "x-passphrase": "letmein",
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOrders(data);
      }
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [selectedDate, selectedStatus]);

  useEffect(() => {
    const filtered = orders.filter((order) => {
      const matchesSearch =
        order.order_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.room_no.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
    setFilteredOrders(filtered);
  }, [searchTerm, orders]);

  const handleExportCSV = async () => {
    if (!selectedDate) {
      alert("Please select a date to export");
      return;
    }

    try {
      const response = await fetch(
        `/api/export/csv?date=${selectedDate}`,
        {
          headers: {
            "x-passphrase": "letmein",
          },
        }
      );

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `orders-${selectedDate}.csv`;
        a.click();
      }
    } catch (error) {
      console.error("Error exporting CSV:", error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "New":
        return "bg-blue-500";
      case "Preparing":
        return "bg-yellow-500";
      case "Ready":
        return "bg-green-500";
      case "Served":
        return "bg-green-600";
      case "Completed":
        return "bg-gray-500";
      default:
        return "bg-gray-400";
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-serif text-primary">
                Order <span className="italic">Management</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                View and manage all orders
              </p>
            </div>
            <div className="flex gap-2">
              <Link to="/menu">
                <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
                  New Order
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Filters */}
        <div className="bg-secondary rounded-lg p-6 mb-8 border border-border">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-2.5 w-5 h-5 text-muted-foreground" />
                <Input
                  placeholder="Order #, Guest name, Room..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white border border-border text-foreground placeholder:text-muted-foreground"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="bg-white border border-border text-foreground"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-2">
                Status
              </label>
              <select
                value={selectedStatus || ""}
                onChange={(e) =>
                  setSelectedStatus(e.target.value || null)
                }
                className="w-full bg-white border border-border text-foreground rounded px-3 py-2"
              >
                <option value="">All Status</option>
                <option value="New">New</option>
                <option value="Preparing">Preparing</option>
                <option value="Ready">Ready</option>
                <option value="Served">Served</option>
                <option value="Completed">Completed</option>
              </select>
            </div>

            <div className="flex items-end">
              <Button
                onClick={handleExportCSV}
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
              >
                <Download className="w-4 h-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </div>
        </div>

        {/* Orders List */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">Loading orders...</p>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground">No orders found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredOrders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-lg p-4 hover:shadow-md transition border border-border"
              >
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-start">
                  <div>
                    <p className="text-sm text-muted-foreground">Order No</p>
                    <p className="font-bold text-foreground text-lg">
                      {order.order_no}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Guest</p>
                    <p className="font-semibold text-foreground">
                      {order.guest_name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Room: {order.room_no}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Items</p>
                    <p className="font-semibold text-foreground">
                      {order.items.length} items
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {new Date(order.created_at).toLocaleTimeString()}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-muted-foreground">Status</p>
                    <Badge className={cn("mt-1", getStatusColor(order.status))}>
                      {order.status}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-2">
                      Payment: {order.payment_status}
                    </p>
                  </div>

                  <div className="flex flex-col items-end justify-between h-full">
                    <div className="text-right">
                      <p className="text-sm text-muted-foreground">Total</p>
                      <p className="font-bold text-primary text-xl">
                        ₹{order.total}
                      </p>
                    </div>
                    <Link to={`/order/${order.id}`}>
                      <Button className="bg-primary text-primary-foreground hover:bg-primary/90 mt-4">
                        <Eye className="w-4 h-4 mr-2" />
                        View
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
