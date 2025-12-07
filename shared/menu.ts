export interface MenuItem {
  id: string;
  name: string;
  price: number;
  category: string;
  description?: string;
}

export interface MenuCategory {
  name: string;
  items: MenuItem[];
}

export const MENU_VERSIONS = ["RestoVersion", "SnacksVersion", "DrinksVersion"];

export const RESTO_VERSION_MENU: MenuItem[] = [
  // Soups
  { id: "soup_01", name: "Baby Corn Soup", price: 100, category: "Soups" },
  { id: "soup_02", name: "Hot & Sour Soup", price: 120, category: "Soups" },
  { id: "soup_03", name: "Tomato Soup", price: 100, category: "Soups" },
  { id: "soup_04", name: "Veg Cheese Soup", price: 120, category: "Soups" },
  { id: "soup_05", name: "Burnt Garlic Soup", price: 100, category: "Soups" },
  { id: "soup_06", name: "Broccoli Soup", price: 120, category: "Soups" },

  // Salads
  { id: "salad_01", name: "Kachumber Salad", price: 40, category: "Salads" },
  { id: "salad_02", name: "Green Salad", price: 40, category: "Salads" },
  { id: "salad_03", name: "Italian Pasta Salad", price: 80, category: "Salads" },
  { id: "salad_04", name: "Veg Russian Salad", price: 50, category: "Salads" },
  { id: "salad_05", name: "Nut Salad", price: 50, category: "Salads" },
  { id: "salad_06", name: "ColeSlaw Salad", price: 50, category: "Salads" },

  // Starters
  { id: "starter_01", name: "Gobi Manchurian", price: 140, category: "Starters" },
  { id: "starter_02", name: "Paneer/Aloo/Gobi - Pepper Dry", price: 150, category: "Starters" },
  { id: "starter_03", name: "Paneer/Aloo/Gobi - Chilly", price: 140, category: "Starters" },
  { id: "starter_04", name: "Golden Fried Baby Corn", price: 180, category: "Starters" },
  { id: "starter_05", name: "Mushroom Dry/Chilly", price: 180, category: "Starters" },
  { id: "starter_06", name: "Veg Chilly/Veg Dry", price: 120, category: "Starters" },
  { id: "starter_07", name: "Baby Corn/Paneer Schezwaan", price: 140, category: "Starters" },

  // Breads
  { id: "bread_01", name: "Aloo Stuffed Parata (Per Plate)", price: 120, category: "Breads" },
  { id: "bread_02", name: "Mirch/Pudina/Methi Parata (Per Plate)", price: 120, category: "Breads" },
  { id: "bread_03", name: "Paneer Stuffed Parata (Per Plate)", price: 150, category: "Breads" },
  { id: "bread_04", name: "Roti (Per Piece)", price: 30, category: "Breads" },
  { id: "bread_05", name: "Chapathi (Per Piece)", price: 30, category: "Breads" },
  { id: "bread_06", name: "Normal Parata (Per Piece)", price: 40, category: "Breads" },
  { id: "bread_07", name: "White Maida Chapathi (Per Piece)", price: 40, category: "Breads" },

  // Gravy/Curry
  { id: "curry_01", name: "Paneer Tikka Masala", price: 255, category: "Gravy/Curry" },
  { id: "curry_02", name: "Dal Makhani", price: 155, category: "Gravy/Curry" },
  { id: "curry_03", name: "Shahi Paneer", price: 215, category: "Gravy/Curry" },
  { id: "curry_04", name: "Dal Tadka", price: 145, category: "Gravy/Curry" },
  { id: "curry_05", name: "Palak Paneer", price: 215, category: "Gravy/Curry" },
  { id: "curry_06", name: "Mixed Veg", price: 145, category: "Gravy/Curry" },
  { id: "curry_07", name: "Shahi Paneer/Paneer Kadai", price: 215, category: "Gravy/Curry" },
  { id: "curry_08", name: "Matar Mushroom", price: 215, category: "Gravy/Curry" },
  { id: "curry_09", name: "Veg Kolhapuri", price: 155, category: "Gravy/Curry" },

  // Chinese
  { id: "chinese_01", name: "Schezwaan Fried Rice/Noodles", price: 199, category: "Chinese" },
  { id: "chinese_02", name: "Masala Noodles / Pasta", price: 180, category: "Chinese" },
  { id: "chinese_03", name: "White Sause Pasta/ Noodles", price: 215, category: "Chinese" },
  { id: "chinese_04", name: "Fried Rice", price: 180, category: "Chinese" },
  { id: "chinese_05", name: "Garlic Fried Rice", price: 180, category: "Chinese" },
  { id: "chinese_06", name: "Shanghai Fried Rice", price: 199, category: "Chinese" },
  { id: "chinese_07", name: "Chinese Chopsuey", price: 215, category: "Chinese" },

  // Rice Special
  { id: "rice_01", name: "Hyderabadi Biryani", price: 215, category: "Rice Special" },
  { id: "rice_02", name: "Veg Biryani", price: 215, category: "Rice Special" },
  { id: "rice_03", name: "Dal Kichidi", price: 180, category: "Rice Special" },
  { id: "rice_04", name: "Ghee Rice / Jeera Rice", price: 180, category: "Rice Special" },
  { id: "rice_05", name: "Mushroom Biryani", price: 215, category: "Rice Special" },
  { id: "rice_06", name: "Lemon Rice / Puliogere", price: 120, category: "Rice Special" },
  { id: "rice_07", name: "Soya Chunks Biryani", price: 215, category: "Rice Special" },
  { id: "rice_08", name: "Paneer Biryani", price: 215, category: "Rice Special" },

  // Malnad Special
  { id: "malnad_01", name: "South Indian Meal (MIN. Order 4)", price: 210, category: "Malnad Special" },
  { id: "malnad_02", name: "Rice Thalipattu", price: 100, category: "Malnad Special" },
  { id: "malnad_03", name: "Rava Dosa", price: 120, category: "Malnad Special" },
  { id: "malnad_04", name: "Pathrode", price: 120, category: "Malnad Special" },
  { id: "malnad_05", name: "Poha", price: 80, category: "Malnad Special" },
  { id: "malnad_06", name: "Neer Dosa", price: 120, category: "Malnad Special" },
  { id: "malnad_07", name: "Dosa (Varieties Available)", price: 80, category: "Malnad Special" },
];

export function groupMenuByCategory(items: MenuItem[]): MenuCategory[] {
  const grouped: { [key: string]: MenuItem[] } = {};

  items.forEach((item) => {
    if (!grouped[item.category]) {
      grouped[item.category] = [];
    }
    grouped[item.category].push(item);
  });

  const categoryOrder = [
    "Soups",
    "Salads",
    "Starters",
    "Breads",
    "Gravy/Curry",
    "Chinese",
    "Rice Special",
    "Malnad Special",
  ];

  return categoryOrder
    .map((categoryName) => ({
      name: categoryName,
      items: grouped[categoryName] || [],
    }))
    .filter((cat) => cat.items.length > 0);
}
