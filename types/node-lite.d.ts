// Minimal ambient declarations for the Node built-ins this project uses, so
// `tsc --noEmit` works without installing @types/node. If you install
// @types/node, delete this file and set "types": ["node"] in tsconfig.json.
declare module "node:fs" {
  export function readFileSync(path: string, encoding: "utf8"): string;
  export function readFileSync(path: string): { toString(enc?: string): string };
  export function writeFileSync(path: string, data: string): void;
  export function mkdirSync(path: string, opts?: { recursive?: boolean }): void;
  export function rmSync(path: string, opts?: { recursive?: boolean; force?: boolean }): void;
  export function cpSync(src: string, dest: string, opts?: { recursive?: boolean }): void;
  export function existsSync(path: string): boolean;
}
declare module "node:fs/promises" {
  export function readFile(path: string): Promise<Uint8Array>;
  export function stat(path: string): Promise<{ isDirectory(): boolean }>;
  export function mkdir(path: string, opts?: { recursive?: boolean }): Promise<void>;
}
declare module "node:path" {
  export function join(...parts: string[]): string;
  export function dirname(path: string): string;
  export function extname(path: string): string;
  export function normalize(path: string): string;
}
declare module "node:url" {
  export function fileURLToPath(url: string | URL): string;
}
declare module "node:module" {
  export function createRequire(url: string): (id: string) => any;
}
declare module "node:http" {
  interface Req { url?: string }
  interface Res { writeHead(code: number, headers?: Record<string, string>): Res; end(body?: unknown): void }
  interface Server { listen(port: number, cb?: () => void): Server; address(): unknown; close(): void }
  export function createServer(handler: (req: Req, res: Res) => void | Promise<void>): Server;
}
declare const process: { argv: string[]; env: Record<string, string | undefined>; exit(code?: number): never; cwd(): string };
declare const Buffer: { from(data: string): unknown };
interface ImportMeta { url: string }
declare const console: { log(...a: unknown[]): void; error(...a: unknown[]): void; warn(...a: unknown[]): void };
declare class URL { constructor(url: string, base?: string | URL); pathname: string; searchParams: { get(k: string): string | null } }
