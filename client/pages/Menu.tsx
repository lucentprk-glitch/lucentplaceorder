import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { X, Minus, Plus, ShoppingCart } from "lucide-react";
import {
  MenuItem,
  RESTO_VERSION_MENU,
  groupMenuByCategory,
} from "@shared/menu";
import { cn } from "@/lib/utils";

interface CartItem extends MenuItem {
  quantity: number;
}

interface GuestDetails {
  guestName: string;
  roomNo: string;
  notes: string;
  tableChoice: string;
  paymentMode: string;
}

export default function MenuPage() {
  const [menu] = useState<MenuItem[]>(RESTO_VERSION_MENU);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCheckout, setShowCheckout] = useState(false);
  const [guestDetails, setGuestDetails] = useState<GuestDetails>({
    guestName: "",
    roomNo: "",
    notes: "",
    tableChoice: "Room",
    paymentMode: "Paid at checkout",
  });
  const [selectedVersion] = useState("RestoVersion");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = groupMenuByCategory(menu);
  const filteredMenu = menu.filter((item) => {
    const matchesSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCategory =
      !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i,
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
    } else {
      setCart((prev) =>
        prev.map((i) => (i.id === id ? { ...i, quantity } : i)),
      );
    }
  };

  const removeFromCart = (id: string) => {
    setCart((prev) => prev.filter((i) => i.id !== id));
  };

  const cartTotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const handleSaveOrder = async () => {
    if (!guestDetails.guestName || !guestDetails.roomNo) {
      alert("Please enter guest name and room number");
      return;
    }

    const orderPayload = {
      guest_name: guestDetails.guestName,
      room_no: guestDetails.roomNo,
      notes: guestDetails.notes,
      menu_version: selectedVersion,
      items: cart.map((item) => ({
        item_key: item.id,
        name: item.name,
        price: item.price,
        qty: item.quantity,
      })),
    };

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-passphrase": "letmein",
        },
        body: JSON.stringify(orderPayload),
      });

      if (response.ok) {
        const savedOrder = await response.json();
        alert(`Order saved successfully! Order No: ${savedOrder.order_no}`);
        setCart([]);
        setGuestDetails({
          guestName: "",
          roomNo: "",
          notes: "",
          tableChoice: "Room",
          paymentMode: "Paid at checkout",
        });
        setShowCheckout(false);
      } else {
        alert("Failed to save order");
      }
    } catch (error) {
      console.error("Error saving order:", error);
      alert("Error saving order");
    }
  };

  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header */}
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-serif text-primary">
                Resto<span className="italic">Version</span>
              </h1>
              <p className="text-muted-foreground text-sm mt-1">
                Staff Order Management
              </p>
            </div>
            <div className="relative">
              <button className="relative p-2 bg-secondary rounded-lg hover:bg-muted transition border border-border">
                <ShoppingCart className="w-6 h-6 text-foreground" />
                {cart.length > 0 && (
                  <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {cart.length}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Menu Section */}
          <div className="lg:col-span-2">
            {/* Search */}
            <div className="mb-6">
              <Input
                placeholder="Search menu items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="bg-secondary border border-border text-foreground placeholder:text-muted-foreground focus:ring-2 focus:ring-primary"
              />
            </div>

            {/* Category Filters */}
            <div className="mb-8 flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory(null)}
                className={cn(
                  "px-4 py-2 rounded-lg font-semibold transition border",
                  !selectedCategory
                    ? "bg-primary text-primary-foreground border-primary"
                    : "bg-white text-foreground border-border hover:bg-secondary",
                )}
              >
                All Items
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.name}
                  onClick={() =>
                    setSelectedCategory(
                      selectedCategory === cat.name ? null : cat.name,
                    )
                  }
                  className={cn(
                    "px-4 py-2 rounded-lg font-semibold transition border",
                    selectedCategory === cat.name
                      ? "bg-primary text-primary-foreground border-primary"
                      : "bg-white text-foreground border-border hover:bg-secondary",
                  )}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {/* Menu Items Grid */}
            <div className="grid gap-4">
              {filteredMenu.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-lg p-4 flex items-start justify-between hover:shadow-md transition border border-border"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-foreground text-lg">
                      {item.name}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {item.category}
                    </p>
                    <p className="text-primary font-bold mt-2">₹{item.price}</p>
                  </div>
                  <button
                    onClick={() => addToCart(item)}
                    className="ml-4 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 transition whitespace-nowrap"
                  >
                    Add
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Cart Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-secondary rounded-lg p-6 sticky top-24 border border-border">
              <h2 className="text-xl font-bold text-foreground mb-4">
                Order Cart
              </h2>

              {cart.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  No items added yet
                </p>
              ) : (
                <>
                  <div className="space-y-3 mb-6 max-h-96 overflow-y-auto">
                    {cart.map((item) => (
                      <div
                        key={item.id}
                        className="bg-white rounded-lg p-3 border border-border"
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold text-foreground text-sm">
                            {item.name}
                          </h4>
                          <button
                            onClick={() => removeFromCart(item.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity - 1)
                              }
                              className="bg-primary text-white w-6 h-6 rounded flex items-center justify-center hover:bg-primary/90"
                            >
                              <Minus className="w-3 h-3" />
                            </button>
                            <span className="w-8 text-center text-foreground font-semibold">
                              {item.quantity}
                            </span>
                            <button
                              onClick={() =>
                                updateQuantity(item.id, item.quantity + 1)
                              }
                              className="bg-primary text-white w-6 h-6 rounded flex items-center justify-center hover:bg-primary/90"
                            >
                              <Plus className="w-3 h-3" />
                            </button>
                          </div>
                          <p className="font-semibold text-foreground">
                            ₹{item.price * item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-border pt-4 mb-4">
                    <div className="flex justify-between items-center mb-4">
                      <span className="font-semibold text-foreground">
                        Total:
                      </span>
                      <span className="text-xl font-bold text-primary">
                        ₹{cartTotal}
                      </span>
                    </div>
                    <Button
                      onClick={() => setShowCheckout(true)}
                      className="w-full bg-primary text-primary-foreground hover:bg-primary/90 font-bold py-6"
                    >
                      Save Order
                    </Button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      <Dialog open={showCheckout} onOpenChange={setShowCheckout}>
        <DialogContent className="bg-white border border-border text-foreground">
          <DialogHeader>
            <DialogTitle className="text-foreground">Order Details</DialogTitle>
          </DialogHeader>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Guest Name *
              </label>
              <Input
                value={guestDetails.guestName}
                onChange={(e) =>
                  setGuestDetails({
                    ...guestDetails,
                    guestName: e.target.value,
                  })
                }
                className="bg-secondary border border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter guest name"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Room Number *
              </label>
              <Input
                value={guestDetails.roomNo}
                onChange={(e) =>
                  setGuestDetails({ ...guestDetails, roomNo: e.target.value })
                }
                className="bg-secondary border border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Enter room number"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Special Requests
              </label>
              <Input
                value={guestDetails.notes}
                onChange={(e) =>
                  setGuestDetails({ ...guestDetails, notes: e.target.value })
                }
                className="bg-secondary border border-border text-foreground placeholder:text-muted-foreground"
                placeholder="Any special requests?"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Dining Option
              </label>
              <select
                value={guestDetails.tableChoice}
                onChange={(e) =>
                  setGuestDetails({
                    ...guestDetails,
                    tableChoice: e.target.value,
                  })
                }
                className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2"
              >
                <option value="Room">Room Service</option>
                <option value="Table">Table/Dining</option>
                <option value="Takeaway">Takeaway</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-semibold text-foreground mb-1">
                Payment Mode
              </label>
              <select
                value={guestDetails.paymentMode}
                onChange={(e) =>
                  setGuestDetails({
                    ...guestDetails,
                    paymentMode: e.target.value,
                  })
                }
                className="w-full bg-secondary border border-border text-foreground rounded px-3 py-2"
              >
                <option value="Paid at checkout">Paid at checkout</option>
                <option value="Paid now">Paid now</option>
                <option value="Card">Card</option>
                <option value="Cash">Cash</option>
              </select>
            </div>

            <div className="bg-secondary rounded-lg p-3 mt-4 border border-border">
              <div className="flex justify-between items-center font-bold">
                <span className="text-foreground">Total Amount:</span>
                <span className="text-primary text-xl">₹{cartTotal}</span>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={() => setShowCheckout(false)}
                variant="outline"
                className="flex-1 bg-white border-border text-foreground hover:bg-secondary"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSaveOrder}
                className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90 font-bold"
              >
                Save Order
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
