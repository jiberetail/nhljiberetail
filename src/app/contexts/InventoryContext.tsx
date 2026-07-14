import { createContext, useContext, useState, ReactNode } from "react";

export type InventoryItem = {
  id: string;
  team: string;
  item: string;
  size: string;
  gender: string;
  cost: number;
  image?: string;
  stock: number;
  category: string;
};

type InventoryContextType = {
  inventory: InventoryItem[];
  addItems: (items: InventoryItem[]) => void;
  updateItem: (id: string, updates: Partial<InventoryItem>) => void;
  deleteItem: (id: string) => void;
  uploadImage: (id: string, imageUrl: string) => void;
};

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

// Sample initial inventory data
const initialInventory: InventoryItem[] = [
  {
    id: "1",
    team: "New York Rangers",
    item: "Jersey (Home)",
    size: "L",
    gender: "Male",
    cost: 265.99,
    stock: 45,
    category: "Jersey",
  },
  {
    id: "2",
    team: "New York Rangers",
    item: "Cap (Fitted)",
    size: "7 1/4",
    gender: "Male",
    cost: 88.75,
    stock: 120,
    category: "Hat",
  },
  {
    id: "3",
    team: "New York Islanders",
    item: "Jersey (Away)",
    size: "XL",
    gender: "Male",
    cost: 266.15,
    stock: 32,
    category: "Jersey",
  },
  {
    id: "4",
    team: "Boston Bruins",
    item: "Hoodie",
    size: "M",
    gender: "Female",
    cost: 177.44,
    stock: 58,
    category: "Outerwear",
  },
  {
    id: "5",
    team: "Los Angeles Kings",
    item: "Jersey (Home)",
    size: "L",
    gender: "Male",
    cost: 266.32,
    stock: 41,
    category: "Jersey",
  },
  {
    id: "6",
    team: "New York Rangers",
    item: "Jacket (Bomber)",
    size: "XL",
    gender: "Male",
    cost: 332.86,
    stock: 25,
    category: "Outerwear",
  },
  {
    id: "7",
    team: "Chicago Blackhawks",
    item: "T-Shirt (Vintage)",
    size: "M",
    gender: "Male",
    cost: 88.75,
    stock: 95,
    category: "Apparel",
  },
  {
    id: "8",
    team: "New York Islanders",
    item: "Cap (Adjustable)",
    size: "OS",
    gender: "Female",
    cost: 66.67,
    stock: 78,
    category: "Hat",
  },
];

export function InventoryProvider({ children }: { children: ReactNode }) {
  const [inventory, setInventory] = useState<InventoryItem[]>(initialInventory);

  const addItems = (items: InventoryItem[]) => {
    setInventory((prev) => [...prev, ...items]);
  };

  const updateItem = (id: string, updates: Partial<InventoryItem>) => {
    setInventory((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
  };

  const deleteItem = (id: string) => {
    setInventory((prev) => prev.filter((item) => item.id !== id));
  };

  const uploadImage = (id: string, imageUrl: string) => {
    updateItem(id, { image: imageUrl });
  };

  return (
    <InventoryContext.Provider
      value={{ inventory, addItems, updateItem, deleteItem, uploadImage }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error("useInventory must be used within an InventoryProvider");
  }
  return context;
}
