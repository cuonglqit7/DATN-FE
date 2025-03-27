"use client";
import { createContext, useContext, useState } from "react";

type FavoriteContextType = {
  favoriteQuantity: number;
  setFavoriteQuantity: (quantity: number) => void;
};

const FavoriteContext = createContext<FavoriteContextType | undefined>(
  undefined
);

export const FavoriteProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [favoriteQuantity, setFavoriteQuantity] = useState(0);

  return (
    <FavoriteContext.Provider value={{ favoriteQuantity, setFavoriteQuantity }}>
      {children}
    </FavoriteContext.Provider>
  );
};

export const useFavoriteContext = () => {
  const context = useContext(FavoriteContext);
  if (!context) {
    throw new Error("useFavorite must be used within a FavoriteProvider");
  }
  return context;
};
