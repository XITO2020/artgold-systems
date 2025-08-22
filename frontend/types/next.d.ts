// Type definitions for Next.js modules
declare module 'next/link' {
  import { ComponentType, HTMLAttributes } from 'react';
  import { LinkProps as NextLinkProps } from 'next/dist/client/link';
  const Link: ComponentType<NextLinkProps>;
  export default Link;
}

declare module 'next/dynamic' {
  import { ComponentType } from 'react';
  
  interface DynamicOptions {
    ssr?: boolean;
    loading?: () => React.ReactNode | null;
  }
  
  function dynamic<T = any>(
    loader: () => Promise<{ default: ComponentType<T> }>,
    options?: DynamicOptions
  ): ComponentType<T>;
  
  export default dynamic;
}
