// app/twitter-image.tsx
// Explicit re-export from opengraph-image module per brief §LR-02 "Twitter card image".
// Removes any fallback ambiguity and matches Twitter's card crawler expectations.
export { default, alt, size, contentType } from "./opengraph-image";
