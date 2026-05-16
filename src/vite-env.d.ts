/// <reference types="vite/client" />

declare module '*.mdx' {
  let MDXComponent: (props: any) => JSX.Element;
  export default MDXComponent;
  export const meta: {
    title: string;
    date: string;
    readingTime: string;
    summary: string;
    [key: string]: any;
  };
}
