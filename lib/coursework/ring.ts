/**
 * The ring logic of my key-value service (Distributed Computing project 4), including two behaviours
 * of the original that I found when rereading the code for this demo.
 *
 *  - original: a join only takes keys from the BOOTSTRAP server's own map, and an exit hands keys to the
 *    successor remembered from join time.
 *  - corrected: a join takes keys from the real successor, and an exit hands keys to the current successor.
 *
 * Key space 0..1023. The bootstrap server is node 0, and a key belongs to the first node at or after it,
 * wrapping around to node 0. Data is held in memory and seeded from the bootstrap config file.
 */

export const KEY_SPACE = 1024;
export type RingMode = "original" | "corrected";

export const SEED_DATA: Record<number, string> = {
  12: "Cabbage", 26: "Okra", 47: "Cucumber", 62: "Potato", 89: "Apricot", 109: "Carrot", 143: "Broccoli",
  152: "Peas", 187: "Fig", 226: "Kiwi", 264: "Grape", 288: "Cherry", 325: "Beetroot", 366: "Onion",
  410: "Fennel", 434: "Lemon", 500: "Garlic", 502: "Apple", 572: "Cantaloupe", 616: "Guava", 618: "Lettuce",
  740: "Asparagus", 773: "Limabeans", 800: "Ginger", 826: "Eggplant", 899: "Mango", 900: "Orange",
  911: "Strawberry", 939: "Blueberry", 969: "Pineapple", 992: "Kale", 999: "Spinach", 1005: "Watermelon",
  1016: "Zucchini", 1023: "Radish",
};

export interface NodeState {
  data: Record<number, string>;
  /** Predecessor and successor as they were when the node joined. Never updated afterwards. */
  predAtJoin: number;
  succAtJoin: number;
}

export interface RingState {
  mode: RingMode;
  nodes: Record<number, NodeState>;
  /** Nodes whose process exited without telling the bootstrap server. */
  dead: number[];
  log: string[];
}

export function initialRing(mode: RingMode = "original"): RingState {
  return {
    mode,
    nodes: { 0: { data: { ...SEED_DATA }, predAtJoin: 0, succAtJoin: 0 } },
    dead: [],
    log: ["Bootstrap online (node 0) holding the 35 seeded keys."],
  };
}

export function ringIds(state: RingState): number[] {
  return Object.keys(state.nodes).map(Number).sort((a, b) => a - b);
}

export function ownerOf(ids: number[], key: number): number {
  return ids.find((id) => id >= key) ?? ids[0];
}
function predecessorOf(ids: number[], id: number): number {
  const lower = ids.filter((x) => x < id);
  return lower.length ? lower[lower.length - 1] : ids[ids.length - 1];
}
function successorOf(ids: number[], id: number): number {
  return ids.find((x) => x > id) ?? ids[0];
}

/** Is `key` in the ring range (from, to]? */
export function inRange(key: number, from: number, to: number): boolean {
  return from < to ? key > from && key <= to : key > from || key <= to;
}

function copy(state: RingState): RingState {
  return structuredClone(state);
}

export interface OpResult {
  state: RingState;
  ok: boolean;
  message: string;
  /** Keys that moved between nodes during a join or exit. */
  moved: { key: number; from: number; to: number }[];
  path?: number[];
}

export function join(previous: RingState, id: number): OpResult {
  const state = copy(previous);
  if (!Number.isInteger(id) || id < 1 || id >= KEY_SPACE) return { state, ok: false, message: "Node ids must be 1 to 1023.", moved: [] };
  if (state.nodes[id]) return { state, ok: false, message: `Node ${id} is already in the ring.`, moved: [] };
  const ids = ringIds(state);
  const succ = ownerOf(ids, id);
  const pred = predecessorOf(ids, succ);

  // Original: only the bootstrap server's map is searched. Corrected: the real successor's map.
  const sourceId = state.mode === "original" ? 0 : succ;
  const source = state.nodes[sourceId].data;
  const moved: OpResult["moved"] = [];
  const taken: Record<number, string> = {};
  for (const [k, v] of Object.entries(source)) {
    const key = Number(k);
    if (inRange(key, pred, id)) {
      taken[key] = v;
      moved.push({ key, from: sourceId, to: id });
    }
  }
  for (const m of moved) delete source[m.key];
  state.nodes[id] = { data: taken, predAtJoin: pred, succAtJoin: succ };
  const where = state.mode === "original" && sourceId !== succ ? ` (the keys in that range were held by node ${succ}, which the original does not ask)` : "";
  const message = `Node ${id} joined: range (${pred}, ${id}], predecessor ${pred}, successor ${succ}. ${moved.length} key${moved.length === 1 ? "" : "s"} moved from node ${sourceId}${where}.`;
  state.log = [...state.log.slice(-9), message];
  return { state, ok: true, message, moved };
}

export function exit(previous: RingState, id: number): OpResult {
  const state = copy(previous);
  const node = state.nodes[id];
  if (id === 0) return { state, ok: false, message: "The bootstrap server does not exit.", moved: [] };
  if (!node || state.dead.includes(id)) return { state, ok: false, message: `Node ${id} is not in the ring.`, moved: [] };
  const ids = ringIds(state);
  const target = state.mode === "original" ? node.succAtJoin : successorOf(ids, id);
  const targetNode = state.nodes[target];

  if (!targetNode || state.dead.includes(target)) {
    // The original's transfer fails with an exception, so the node exits without sending LEAVE.
    state.dead.push(id);
    const message = `Node ${id} tried to hand over to node ${target}, which is gone. The transfer failed and the node stopped without leaving the ring.`;
    state.log = [...state.log.slice(-9), message];
    return { state, ok: false, message, moved: [] };
  }

  const moved: OpResult["moved"] = Object.keys(node.data).map((k) => ({ key: Number(k), from: id, to: target }));
  Object.assign(targetNode.data, node.data);
  delete state.nodes[id];
  const actual = successorOf(ringIds(state), id);
  const note = target !== actual ? ` The real successor is node ${actual}, so these keys are now on the wrong node.` : "";
  const message = `Node ${id} exited: handed ${moved.length} key${moved.length === 1 ? "" : "s"} to node ${target}.${note}`;
  state.log = [...state.log.slice(-9), message];
  return { state, ok: true, message, moved };
}

export type Request = { type: "lookup"; key: number } | { type: "insert"; key: number; value: string } | { type: "delete"; key: number };

export function request(previous: RingState, req: Request): OpResult {
  const state = copy(previous);
  if (!Number.isInteger(req.key) || req.key < 0 || req.key >= KEY_SPACE) {
    return { state, ok: false, message: "Keys must be 0 to 1023.", moved: [] };
  }
  const ids = ringIds(state);
  const owner = ownerOf(ids, req.key);
  const path = owner === 0 ? [0] : [0, owner];
  const pathText = `path=[${path.join(",")}]`;

  if (state.dead.includes(owner)) {
    return { state, ok: false, message: `ERROR; ${pathText} (node ${owner} is not responding)`, moved: [], path };
  }
  const data = state.nodes[owner].data;
  let message: string;
  let ok = true;
  if (req.type === "lookup") {
    const value = data[req.key];
    if (value === undefined) {
      ok = false;
      message = `Key not found; ${pathText}`;
    } else message = `Value=${value}; served by=${owner}; ${pathText}`;
  } else if (req.type === "insert") {
    data[req.key] = req.value;
    message = `Inserted @${owner}; ${pathText}`;
  } else {
    if (data[req.key] === undefined) {
      ok = false;
      message = `Key not found; ${pathText}`;
    } else {
      delete data[req.key];
      message = `Successful deletion; ${pathText}`;
    }
  }
  state.log = [...state.log.slice(-9), `${req.type} ${req.key}: ${message}`];
  return { state, ok, message, moved: [], path };
}

/** Where every key currently lives, and whether that is the node the ring says should hold it. */
export function keyPlacement(state: RingState): { key: number; value: string; holder: number; owner: number; misplaced: boolean }[] {
  const ids = ringIds(state);
  const rows: { key: number; value: string; holder: number; owner: number; misplaced: boolean }[] = [];
  for (const id of ids) {
    for (const [k, v] of Object.entries(state.nodes[id].data)) {
      const key = Number(k);
      const owner = ownerOf(ids, key);
      rows.push({ key, value: v, holder: id, owner, misplaced: owner !== id });
    }
  }
  return rows.sort((a, b) => a.key - b.key);
}

export function rangeOf(state: RingState, id: number): [number, number] {
  const ids = ringIds(state);
  return [predecessorOf(ids, id), id];
}
