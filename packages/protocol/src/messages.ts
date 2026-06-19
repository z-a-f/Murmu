import { idWithPrefix } from "./encoding.js";
import type { AgentMessage, AgentMessageKind, JsonObject } from "./types.js";

export function createAgentMessage(
  kind: AgentMessageKind,
  body: JsonObject,
  options: { id?: string; createdAt?: string; replyTo?: string; threadId?: string } = {},
): AgentMessage {
  return {
    id: options.id ?? idWithPrefix("msg"),
    kind,
    createdAt: options.createdAt ?? new Date().toISOString(),
    body,
    replyTo: options.replyTo,
    threadId: options.threadId,
  };
}

export function assertAgentMessage(value: AgentMessage): void {
  const allowed = new Set(["task", "status", "tool_request", "tool_result", "note"]);
  if (!value.id || !allowed.has(value.kind) || !value.createdAt || !value.body) {
    throw new Error("Invalid agent message");
  }
}

