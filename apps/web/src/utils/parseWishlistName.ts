export const parseWishlistName = (name: string) => {
  return name.toLowerCase().replace(/\ /g, "-");
};
