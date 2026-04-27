/// <reference types="vite/client" />
/// <reference types="vite-imagetools" />
// noinspection JSUnusedGlobalSymbols

// --- Image format query transform declarations ---
declare module '*.png?format=webp' {
  const src: string;
  export default src;
}
declare module '*.jpg?format=webp' {
  const src: string;
  export default src;
}
declare module '*.jpeg?format=webp' {
  const src: string;
  export default src;
}
