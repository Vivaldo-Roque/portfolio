declare module "*.yaml" {
  const data: any;
  export default data;
}

declare module "*.yml" {
  const data: any;
  export default data;
}

declare module "*.md?raw" {
  const content: string;
  export default content;
}
