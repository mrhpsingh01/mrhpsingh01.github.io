/**
 * The simple FTP protocol from my Distributed Computing project, run against virtual file systems.
 * Replies match the Java server's: "OK", "ERROR ..." strings, and for get the length before the bytes.
 */

export interface FileNode {
  type: "file";
  size: number;
}
export interface DirNode {
  type: "dir";
  children: Record<string, Node>;
}
export type Node = FileNode | DirNode;

export interface FtpState {
  root: DirNode;
  /** Server working directory as path segments from the root. */
  cwd: string[];
  /** Files in the client's local directory. */
  local: Record<string, number>;
  connected: boolean;
}

export interface TraceLine {
  direction: "client" | "server";
  text: string;
}

export interface FtpOutcome {
  state: FtpState;
  output: string[];
  trace: TraceLine[];
}

export function initialState(): FtpState {
  return {
    root: {
      type: "dir",
      children: {
        srv: {
          type: "dir",
          children: {
            ftp: {
              type: "dir",
              children: {
                "notes.txt": { type: "file", size: 1203 },
                "report.pdf": { type: "file", size: 48210 },
                data: {
                  type: "dir",
                  children: {
                    "readings.csv": { type: "file", size: 9120 },
                    "config.json": { type: "file", size: 311 },
                  },
                },
                logs: { type: "dir", children: {} },
              },
            },
          },
        },
      },
    },
    cwd: ["srv", "ftp"],
    local: { "todo.txt": 640, "chart.png": 20480, "draft.docx": 33800 },
    connected: true,
  };
}

export function dirAt(root: DirNode, path: string[]): DirNode | undefined {
  let node: Node = root;
  for (const segment of path) {
    if (node.type !== "dir") return undefined;
    const next: Node | undefined = node.children[segment];
    if (!next) return undefined;
    node = next;
  }
  return node.type === "dir" ? node : undefined;
}

export function pathString(path: string[]): string {
  return `/${path.join("/")}`;
}

function clone(state: FtpState): FtpState {
  return structuredClone(state);
}

export function runCommand(previous: FtpState, line: string): FtpOutcome {
  const state = clone(previous);
  const trimmed = line.trim();
  const [command, ...rest] = trimmed.split(/\s+/);
  const argument = rest.join(" ");
  const trace: TraceLine[] = [];
  const output: string[] = [];
  if (!trimmed) return { state, output, trace };

  const dir = dirAt(state.root, state.cwd) as DirNode;
  const send = (text: string) => trace.push({ direction: "client", text });
  const reply = (text: string) => trace.push({ direction: "server", text });

  switch (command) {
    case "ls": {
      send("ls");
      const names = Object.entries(dir.children).map(([name, node]) => name + (node.type === "dir" ? "/" : ""));
      reply(names.length ? names.join("\\n") : "(empty string)");
      output.push(...(names.length ? names : ["(empty)"]));
      break;
    }
    case "pwd": {
      send("pwd");
      reply(pathString(state.cwd));
      output.push(pathString(state.cwd));
      break;
    }
    case "cd": {
      send(`cd ${argument}`);
      if (argument === "..") {
        if (state.cwd.length === 0) {
          reply("ERROR Already at root directory");
          output.push("ERROR Already at root directory");
        } else {
          state.cwd = state.cwd.slice(0, -1);
          reply("OK");
          output.push("OK");
        }
      } else {
        const target = dir.children[argument];
        if (!target || target.type !== "dir") {
          reply("ERROR Directory not found");
          output.push("ERROR Directory not found");
        } else {
          state.cwd = [...state.cwd, argument];
          reply("OK");
          output.push("OK");
        }
      }
      break;
    }
    case "mkdir": {
      send(`mkdir ${argument}`);
      if (!argument || dir.children[argument]) {
        reply("ERROR Unable to create directory");
        output.push("ERROR Unable to create directory");
      } else {
        dir.children[argument] = { type: "dir", children: {} };
        reply("OK");
        output.push("OK");
      }
      break;
    }
    case "delete": {
      send(`delete ${argument}`);
      const target = dir.children[argument];
      if (!target || target.type !== "file") {
        reply("ERROR Unable to delete file");
        output.push("ERROR Unable to delete file");
      } else {
        delete dir.children[argument];
        reply("OK");
        output.push("OK");
      }
      break;
    }
    case "get": {
      send(`get ${argument}`);
      const target = dir.children[argument];
      if (!target || target.type !== "file") {
        reply("ERROR File not found");
        output.push("ERROR File not found");
      } else {
        reply("OK");
        reply(`length ${target.size} (8-byte long)`);
        reply(`${target.size} bytes of file data`);
        state.local[argument] = target.size;
        output.push(`Downloaded ${argument} (${target.size} bytes)`);
      }
      break;
    }
    case "put": {
      send(`put ${argument}`);
      const size = state.local[argument];
      if (size === undefined) {
        output.push(`Local file not found: ${argument}`);
        trace.pop();
      } else {
        send(`length ${size} (8-byte long)`);
        send(`${size} bytes of file data`);
        dir.children[argument] = { type: "file", size };
        reply("OK");
        output.push(`Uploaded ${argument} (${size} bytes)`);
      }
      break;
    }
    case "quit": {
      send("quit");
      state.connected = false;
      output.push("Connection closed.");
      break;
    }
    default: {
      send(trimmed);
      reply("ERROR: Unknown command");
      output.push("ERROR: Unknown command");
    }
  }
  return { state, output, trace };
}

/** Flattened listing for display. */
export function listTree(dir: DirNode, prefix: string[] = []): { path: string[]; node: Node; depth: number }[] {
  const rows: { path: string[]; node: Node; depth: number }[] = [];
  for (const [name, node] of Object.entries(dir.children).sort((a, b) => a[0].localeCompare(b[0]))) {
    const path = [...prefix, name];
    rows.push({ path, node, depth: prefix.length });
    if (node.type === "dir") rows.push(...listTree(node, path));
  }
  return rows;
}
