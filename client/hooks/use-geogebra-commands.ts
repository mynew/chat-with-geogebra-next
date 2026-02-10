"use client"

import { useCallback } from "react"
import { UIMessage } from "ai";

export function useGeoGebraCommands() {

  // 从消息内容中提取GeoGebra命令
  const extractAllMessagesCommands = useCallback((messages: UIMessage[]) => {
    const allMessagesCommands: Record<string, string[]> = {};
    for (let message of messages) {
      const commands: string[] = [];
      if (message.role === "assistant" && message.parts) { 
        for (let part of message.parts) {
          if (part.type === "tool-executeGeoGebraCommand") {
            if (
              part.input &&
              typeof part.input === "object" &&
              "command" in part.input &&
              typeof (part.input as any).command === "string"
            ) {
              commands.push((part.input as any).command);
            }
          }
        }
      }
      if (commands.length > 0) {
        allMessagesCommands[message.id] = commands;
      }
    }
    return allMessagesCommands;
  }, [])

  return {
    extractAllMessagesCommands,
  }
}

