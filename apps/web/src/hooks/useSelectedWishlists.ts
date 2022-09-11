import create from "zustand";

export type SelectedWishlistsState = {
  selectedWishlists: Array<string>;
  toggleSelectedWishlist: (wishlistId: string) => void;
  clearSelectedWishlists: () => void;
};

export const useSelectedWishlists = create<SelectedWishlistsState>(
  (set, get) => ({
    selectedWishlists: [],
    toggleSelectedWishlist: (wishlistId) => {
      const { selectedWishlists } = get();

      const newSelectedWishlists = selectedWishlists.includes(wishlistId)
        ? selectedWishlists.filter((id) => id !== wishlistId)
        : [...selectedWishlists, wishlistId];

      set({ selectedWishlists: newSelectedWishlists });
    },
    clearSelectedWishlists: () => set({ selectedWishlists: [] }),
  })
);
