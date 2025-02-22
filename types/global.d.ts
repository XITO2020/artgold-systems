declare module 'negotiator' {
  class Negotiator {
    constructor(options: { headers: Record<string, string> });
    languages(): string[];
  }
  export = Negotiator;
}

declare module '*.json' {
  const value: { [key: string]: any };
  export default value;
}

export {};