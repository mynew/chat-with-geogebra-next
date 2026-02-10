import { UIMessage } from "ai";
import { useAppStore } from "./store";

export function collectOneMessage(stream: string) {
  stream = stream.trim();
  let chunks: any[] = stream.split("\n");
  chunks = chunks
    .slice(0, chunks.length - 1)
    .filter((chunk: string) => chunk.trim() !== "")
    .map((chunk: string) => {
      const matchedArray = /^data: (.*)/.exec(chunk);
      return JSON.parse(matchedArray![1]);
    }); // 去掉首尾的特殊标记
  let message = {
    role: "assistant" as const,
    metadata: undefined,
    id: "" as string,
    parts: [] as any[],
    messages: [] as UIMessage[],
  };
  let deltaBuffer: { [key: string]: any[] | { [key: string]: any } } = {};
  for (let chunk of chunks) {
    switch (chunk.type) {
      case "start":
        continue;
      case "start-step":
        message.parts.push({ type: "step-start" });
        break;
      case "text-start":
        deltaBuffer[chunk.id] = [];
        break;
      case "text-delta":
        deltaBuffer[chunk.id].push(chunk.delta);
        break;
      case "text-end":
        let fullText = deltaBuffer[chunk.id].join("");
        message.parts.push({ type: "text", id: chunk.id, text: fullText });
        delete deltaBuffer[chunk.id];
        break;
      case "finish-step":
        message.id = "";
        break;
      case "finish":
        return message;
      case "tool-input-available":
        deltaBuffer[chunk.toolCallId] = {
          toolCallId: chunk.toolCallId,
          input: chunk.input,
          toolName: chunk.toolName,
        };
        break;
      case "tool-output-available":
        deltaBuffer[chunk.toolCallId] = {
          state: "output-available",
          output: chunk.output,
          ...deltaBuffer[chunk.toolCallId],
        };
        message.parts.push({
          type: `tool-${chunk.toolName}`,
          ...deltaBuffer[chunk.toolCallId],
        });
        break;
      default:
        break;
    }
  }
  throw new Error("流未正确结束");
}

export async function uploadOneMessageToCollection(conversationId: string, message: UIMessage) {
  let headers = {
    "Content-Type": "application/json",
    "authorization": `Bearer ${useAppStore.getState().user.token || ""}`,
  }
  fetch("/api/collection", {
    method: "POST",
    headers,
    body: JSON.stringify({ conversationId, message }),
  })
}

export async function uploadLastTwoMessagesToCollection(conversationId: string, messages: UIMessage[]) {
  if (messages.length < 2) return;
  let headers = {
    "Content-Type": "application/json",
    "authorization": `Bearer ${useAppStore.getState().user.token || ""}`,
  }
  fetch("/api/collection", {
    method: "POST",
    headers,
    body: JSON.stringify({ conversationId, messages: messages.slice(-2) }),
  });
}
