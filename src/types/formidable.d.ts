declare module 'formidable' {
  // Minimal fallback typing so TS won't complain in the editor.
  // If you want full types, install @types/formidable (see below).
  type IncomingFormOptions = any;
  type File = any;
  type Files = Record<string, File | File[]>;
  class IncomingForm {
    options: IncomingFormOptions;
    parse(req: any, cb?: (err: any, fields?: any, files?: Files) => void): void;
    on(event: string, listener: (...args: any[]) => void): this;
  }
  const formidable: {
    IncomingForm: typeof IncomingForm;
    [k: string]: any;
  };
  export default formidable;
}