declare module 'html-to-text' {
  export interface ConvertOptions {
    wordwrap?: boolean | number;
    selectors?: Array<{
      selector: string;
      options?: any;
      format?: string;
    }>;
  }

  export function convert(html: string, options?: ConvertOptions): string;
}
