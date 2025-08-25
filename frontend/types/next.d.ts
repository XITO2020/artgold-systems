// Type definitions for Next.js modules
declare module 'next/link' {
  import { ComponentType, AnchorHTMLAttributes, ReactNode } from 'react';
  
  export interface LinkProps extends Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> {
    href: string | { pathname: string; query?: Record<string, string> };
    as?: string;
    replace?: boolean;
    scroll?: boolean;
    shallow?: boolean;
    passHref?: boolean;
    prefetch?: boolean;
    locale?: string | false;
    children: ReactNode;
  }
  
  const Link: ComponentType<LinkProps>;
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
