/// <reference types="vite/client" />

declare module '*.md?raw' {
  const content: string;
  export default content;
}

declare module '*.catalog.json' {
  const content: {
    title: string;
    sections: {
      title: string;
      components: { id: string; name: string; path: string; source: string }[];
    }[];
  };
  export default content;
}
