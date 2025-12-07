import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ShoppingCart, ClipboardList, Settings } from "lucide-react";

export default function Index() {
  return (
    <div className="min-h-screen bg-white text-foreground">
      {/* Header */}
      <header className="bg-white border-b border-border">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div>
            <h1 className="text-5xl md:text-6xl font-serif text-primary mb-2">
              Resto<span className="italic">Version</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              Staff-Only Order Management System
            </p>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-6">
            Welcome to <span className="text-primary">Lucent's Resto</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            A seamless order management system for hotel staff. Take orders,
            manage kitchen operations, and track orders in real-time.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
          {/* Create New Order */}
          <Link to="/menu">
            <div className="bg-secondary rounded-lg p-8 hover:shadow-lg transition h-full border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary text-primary-foreground p-4 rounded-lg">
                  <ShoppingCart className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  Create Order
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                Browse the menu, add items to cart, and create new orders for
                guests. Select menu items by category or search.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto">
                Start New Order
              </Button>
            </div>
          </Link>

          {/* View Orders */}
          <Link to="/orders">
            <div className="bg-secondary rounded-lg p-8 hover:shadow-lg transition h-full border border-border">
              <div className="flex items-center gap-4 mb-4">
                <div className="bg-primary text-primary-foreground p-4 rounded-lg">
                  <ClipboardList className="w-8 h-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground">
                  View Orders
                </h3>
              </div>
              <p className="text-muted-foreground mb-6">
                See all orders, filter by date/status/room, search by guest
                name, and manage order details.
              </p>
              <Button className="bg-primary text-primary-foreground hover:bg-primary/90 w-full md:w-auto">
                Manage Orders
              </Button>
            </div>
          </Link>
        </div>

        {/* Features Section */}
        <div className="bg-secondary rounded-lg p-8 mb-16 border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-6">
            Key Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-bold text-foreground mb-2">
                Menu Management
              </h4>
              <p className="text-muted-foreground text-sm">
                Browse RestoVersion menu with soups, salads, starters, curries,
                rice, and more. Support for SnacksVersion and DrinksVersion.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-bold text-foreground mb-2">
                Order Tracking
              </h4>
              <p className="text-muted-foreground text-sm">
                Track orders from New to Completed status. Filter by date,
                status, or room number for easy management.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-bold text-foreground mb-2">
                Kitchen Integration
              </h4>
              <p className="text-muted-foreground text-sm">
                Send orders to kitchen via WhatsApp notifications. Update order
                status in real-time.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-bold text-foreground mb-2">
                Bill Printing
              </h4>
              <p className="text-muted-foreground text-sm">
                Print restaurant-style bills with order details, items, and
                payment information.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-bold text-foreground mb-2">
                Payment Tracking
              </h4>
              <p className="text-muted-foreground text-sm">
                Record payment status (Paid/Not Paid/Partial) and payment mode
                for each order.
              </p>
            </div>

            <div className="bg-white rounded-lg p-4 border border-border">
              <h4 className="font-bold text-foreground mb-2">
                CSV Export
              </h4>
              <p className="text-muted-foreground text-sm">
                Export orders by date to CSV for auditing and reporting
                purposes.
              </p>
            </div>
          </div>
        </div>

        {/* Theme Info */}
        <div className="bg-secondary rounded-lg p-8 text-center border border-border">
          <h3 className="text-2xl font-bold text-foreground mb-4">
            About Lucent's Resto
          </h3>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            <strong className="text-foreground">Made Fresh to Order</strong> - Every
            item is crafted from scratch using clean, high-quality ingredients.
            We never reuse leftovers or rely on substandard materials—only good
            FOOD, made right.
          </p>
          <p className="text-muted-foreground max-w-2xl mx-auto mt-4">
            <strong className="text-foreground">Fusion & Local Favorites</strong> - From
            mom's classic street-style bites to bold global flavors. Great food
            takes time. Please allow 40 minutes, sometimes a little more.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-secondary border-t border-border mt-16">
        <div className="max-w-7xl mx-auto px-4 py-8 text-center text-muted-foreground">
          <p>
            © 2024 Lucent's Resto. Staff-only order management system. All
            rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
