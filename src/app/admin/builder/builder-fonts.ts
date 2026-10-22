export const FONT_GROUPS = [
  {
    id: "administrasi",
    label: "Administrasi · 20",
    families: [
      "Inter", "Roboto", "Open Sans", "Lato", "Noto Sans", "Source Sans 3", "IBM Plex Sans", "Work Sans", "Public Sans", "Nunito Sans",
      "DM Sans", "Manrope", "Libre Franklin", "Fira Sans", "Assistant", "Archivo", "Karla", "PT Sans", "Cabin", "Mulish",
    ],
  },
  {
    id: "gambar",
    label: "Tampilan gambar · 30",
    families: [
      "Playfair Display", "Cormorant Garamond", "Lora", "Merriweather", "Oswald", "Bebas Neue", "Anton", "Abril Fatface", "DM Serif Display", "Bodoni Moda",
      "Bungee", "Creepster", "Permanent Marker", "Pacifico", "Lobster", "Satisfy", "Dancing Script", "Caveat", "Teko", "Staatliches",
      "Righteous", "Lilita One", "Fjalla One", "Unbounded", "Archivo Black", "Alfa Slab One", "Yeseva One", "Black Ops One", "Cinzel", "Josefin Sans",
    ],
  },
  {
    id: "geometrik",
    label: "Geometrik · 50",
    families: [
      "Montserrat", "Poppins", "Urbanist", "Outfit", "Plus Jakarta Sans", "Sora", "Onest", "Red Hat Display", "Questrial", "Quicksand",
      "Rubik", "Jost", "Lexend", "Epilogue", "Albert Sans", "Figtree", "Spline Sans", "Be Vietnam Pro", "Barlow", "Barlow Condensed",
      "Exo 2", "Ubuntu", "Maven Pro", "Georama", "Prompt", "Chakra Petch", "Oxanium", "Audiowide", "Michroma", "Orbitron",
      "Aldrich", "Rajdhani", "Titillium Web", "Kanit", "Kumbh Sans", "League Spartan", "Gothic A1", "Hind", "Saira", "Montserrat Alternates",
      "Gabarito", "Commissioner", "M PLUS 1", "M PLUS Rounded 1c", "Red Hat Text", "Space Grotesk", "Barlow Semi Condensed", "Nunito", "Manjari", "Lexend Deca",
    ],
  },
] as const;

export const FONT_FAMILIES = FONT_GROUPS.flatMap((group) => group.families);
export type BuilderFontFamily = (typeof FONT_FAMILIES)[number];
export const FONT_FAMILY_SET = new Set<string>(FONT_FAMILIES);

export function googleFontStylesheet(family: string) {
  return `https://fonts.googleapis.com/css2?family=${encodeURIComponent(family)}&display=swap`;
}
