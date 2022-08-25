export const formatWishlistName = (name: string): string => {
  return name
    .trim()
    .toLowerCase()
    .replace(/\ /g, "-") // replaces spaces with hyphens
    .replace(/[^a-z0-9\-\_]/gi, "") // replaces all characters other than letters, numbers, hyphens and underscores
    .replace(/\-+/g, "-"); // replaces multiple hyphens with just one
};
