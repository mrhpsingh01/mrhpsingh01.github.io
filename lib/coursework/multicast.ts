/**
 * The coordinator's rules from my multicast project (Distributed Computing project 3), on a virtual clock.
 *
 *  - msend: recipients are everyone registered at that moment (online or not); online ones get it now
 *  - the coordinator keeps each message for `td` seconds
 *  - register and reconnect send every kept message the participant was a recipient of
 *
 * In "original" mode the coordinator does not remember what it already delivered, so a reconnect can resend
 * a message the participant already has, and the participant appends it to its log again. "once" mode
 * remembers deliveries.
 */

export type ParticipantId = "P1" | "P2" | "P3";
export const PARTICIPANTS: ParticipantId[] = ["P1", "P2", "P3"];
export type Mode = "original" | "once";

export interface Message {
  id: number;
  from: ParticipantId;
  content: string;
  sentAt: number;
  recipients: ParticipantId[];
}

export interface LogEntry {
  messageId: number;
  at: number;
  content: string;
  duplicate: boolean;
}

export interface MulticastState {
  now: number;
  td: number;
  mode: Mode;
  /** Registered participants and whether each is online. Absent means not registered. */
  members: Partial<Record<ParticipantId, { online: boolean }>>;
  history: Message[];
  delivered: Record<string, number[]>; // participant -> message ids, for "once" mode
  logs: Record<ParticipantId, LogEntry[]>;
  coordinatorLog: string[];
  nextMessageId: number;
}

export function initialState(td = 20, mode: Mode = "original"): MulticastState {
  return {
    now: 0,
    td,
    mode,
    members: {},
    history: [],
    delivered: {},
    logs: { P1: [], P2: [], P3: [] },
    coordinatorLog: [],
    nextMessageId: 1,
  };
}

function clone(state: MulticastState): MulticastState {
  return structuredClone(state);
}

function deliver(state: MulticastState, to: ParticipantId, message: Message) {
  const duplicate = state.logs[to].some((entry) => entry.messageId === message.id);
  state.logs[to].push({ messageId: message.id, at: state.now, content: message.content, duplicate });
  const list = state.delivered[to] ?? [];
  if (!list.includes(message.id)) list.push(message.id);
  state.delivered[to] = list;
  state.coordinatorLog.push(`t=${state.now}s sent message ${message.id} to ${to}${duplicate ? " (it already had this one)" : ""}`);
}

function sendPending(state: MulticastState, id: ParticipantId) {
  const member = state.members[id];
  if (!member || !member.online) return;
  for (const message of state.history) {
    const withinWindow = state.now - message.sentAt <= state.td;
    if (!withinWindow || !message.recipients.includes(id)) continue;
    if (state.mode === "once" && (state.delivered[id] ?? []).includes(message.id)) continue;
    deliver(state, id, message);
  }
}

export type Command =
  | { type: "register"; id: ParticipantId }
  | { type: "deregister"; id: ParticipantId }
  | { type: "disconnect"; id: ParticipantId }
  | { type: "reconnect"; id: ParticipantId }
  | { type: "msend"; id: ParticipantId; text: string }
  | { type: "advance"; seconds: number };

/** Returns the new state and a one-line message like the participant's console would print. */
export function apply(previous: MulticastState, command: Command): { state: MulticastState; message: string } {
  const state = clone(previous);
  if (command.type === "advance") {
    state.now += command.seconds;
    return { state, message: `clock is now ${state.now}s` };
  }
  const { id } = command;
  const registered = state.members[id] !== undefined;

  switch (command.type) {
    case "register": {
      if (registered) return { state, message: `${id}: already registered. Use deregister or disconnect first.` };
      state.members[id] = { online: true };
      state.coordinatorLog.push(`t=${state.now}s ${id} registered`);
      sendPending(state, id);
      return { state, message: `${id}: registered successfully` };
    }
    case "deregister": {
      if (!registered) return { state, message: `${id}: not registered. Use register first.` };
      delete state.members[id];
      state.coordinatorLog.push(`t=${state.now}s ${id} deregistered`);
      return { state, message: `${id}: deregistered` };
    }
    case "disconnect": {
      if (!registered) return { state, message: `${id}: not registered. Use register first.` };
      (state.members[id] as { online: boolean }).online = false;
      state.coordinatorLog.push(`t=${state.now}s ${id} disconnected`);
      return { state, message: `${id}: disconnected from the multicast group` };
    }
    case "reconnect": {
      if (!registered) return { state, message: `${id}: not registered or disconnected. Use register first.` };
      (state.members[id] as { online: boolean }).online = true;
      state.coordinatorLog.push(`t=${state.now}s ${id} reconnected`);
      sendPending(state, id);
      return { state, message: `${id}: reconnected successfully` };
    }
    case "msend": {
      if (!registered) return { state, message: `${id}: not registered. Use register first.` };
      const message: Message = {
        id: state.nextMessageId,
        from: id,
        content: command.text,
        sentAt: state.now,
        recipients: (Object.keys(state.members) as ParticipantId[]).sort(),
      };
      state.nextMessageId += 1;
      state.history.push(message);
      state.coordinatorLog.push(`t=${state.now}s message ${message.id} from ${id}, recipients ${message.recipients.join(", ")}`);
      for (const recipient of message.recipients) {
        if (state.members[recipient]?.online) deliver(state, recipient, message);
      }
      return { state, message: `${id}: message ${message.id} sent` };
    }
  }
}

export function expiresAt(state: MulticastState, message: Message): number {
  return message.sentAt + state.td;
}
