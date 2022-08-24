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
      const selectedWishlists = get().selectedWishlists;

      if (selectedWishlists.includes(wishlistId)) {
        set({
          selectedWishlists: selectedWishlists.filter(
            (id) => id !== wishlistId
          ),
        });
      } else {
        set({ selectedWishlists: [...selectedWishlists, wishlistId] });
      }
    },
    clearSelectedWishlists: () => set({ selectedWishlists: [] }),
  })
);
