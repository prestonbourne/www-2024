// for webpack to understand the import of .glsl, .vert, .frag files aka shader files

declare module "*.glsl" {
    const content: string;
    export default content;
}
  
declare module "*.vert" {
    const content: string;
    export default content;
}
  
declare module "*.frag" {
    const content: string;
    export default content;
}
  