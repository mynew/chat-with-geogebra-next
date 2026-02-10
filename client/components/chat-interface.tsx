"use client"

import type React from "react"
import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Card, CardContent, CardFooter } from "@/client/components/ui/card"
import { Input } from "@/client/components/ui/input"
import { Button } from "@/client/components/ui/button"
import { Send, AlertCircle, StopCircleIcon } from "lucide-react"
import { Alert, AlertDescription } from "@/client/components/ui/alert"
import { useGeoGebraCommands } from "@/client/hooks/use-geogebra-commands"
import { ChatMessageItem } from "@/client/components/chat-message-item"

interface ChatInterfaceProps {
  messages: any
  input: string
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  handleSubmit: (e: React.FormEvent<HTMLFormElement>) => void
  handleStop: () => void
  isThinking: boolean
  isLoading: boolean
  onOpenConfig?: () => void
  error?: string | null
}

export function ChatInterface({
  messages,
  input,
  handleInputChange,
  handleSubmit,
  handleStop,
  isThinking,
  isLoading,
  error,
}: ChatInterfaceProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [expandedMessages, setExpandedMessages] = useState<Record<string, boolean>>({});
  const { extractAllMessagesCommands } = useGeoGebraCommands();

  // 自动滚动到底部
  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  // 当消息更新时滚动到底部
  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // 为每个消息提取GeoGebra命令
  const messageCommandsMap = useMemo(() => {
    return extractAllMessagesCommands(messages)
  }, [messages, extractAllMessagesCommands])

  // 切换消息命令的展开/折叠状态
  const toggleMessageExpanded = useCallback((messageId: string) => {
    setExpandedMessages((prev) => ({
      ...prev,
      [messageId]: !prev[messageId],
    }))
  }, [])

  return (
    <Card className="flex-1 flex flex-col h-full overflow-hidden border-0 rounded-none grow">
      <CardContent className="flex-1 p-0 relative overflow-hidden grow">
        <div className="chat-messages-container absolute top-0 left-0 right-0 bottom-16 p-4 overflow-y-auto h-full">
          {error && (
            <Alert variant="destructive" className="mb-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {messages.length === 0 ? (
            <div className="h-full flex items-center justify-center text-center p-8">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">开启一次对话</h3>
                <p className="text-muted-foreground">
                  提出问题或开始新话题以开始聊天。
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-3 pt-2 pb-1">
              {messages.map((message: any) => {
              const messageId = message.id || `msg-${Math.random()}`;
              const commands = messageCommandsMap[messageId] || [];

              return (
                <ChatMessageItem
                key={messageId}
                message={message}
                commands={commands}
                isExpanded={expandedMessages[messageId] || false}
                onToggleExpand={toggleMessageExpanded}
                />
              );
              })}

              {/* 正在思考中的提示 */}
              {isThinking && (
              <div className="flex items-start gap-2 mb-2 shrink-0 w-fit">
                <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                <span className="text-sm">🤖</span>
                </div>
                <div className="flex-1 bg-muted rounded-lg p-3 w-fit max-w-xs">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <div className="flex gap-1">
                  <span className="animate-bounce" style={{ animationDelay: '0ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '150ms' }}>●</span>
                  <span className="animate-bounce" style={{ animationDelay: '300ms' }}>●</span>
                  </div>
                  <span className="text-sm">正在思考中...</span>
                </div>
                </div>
              </div>
              )}

              <div ref={messagesEndRef} />
            </div>
          )}
        </div>
      </CardContent>

      <CardFooter className="border-t p-4 shrink-0 sticky bottom-0 bg-background z-10">
        <form onSubmit={handleSubmit} className="flex w-full gap-2">
          <Input
            placeholder="输入您的消息..."
            value={input}
            onChange={handleInputChange}
            className="flex-1"
            disabled={isLoading}
          />
          {isLoading ? (
            <Button onClick={handleStop}>
              <StopCircleIcon className="h-4 w-4" />
            </Button>
          ) : (
            <Button type="submit" disabled={!input.trim()}>
              <Send className="h-4 w-4" />
            </Button>
          )}
        </form>
      </CardFooter>
    </Card>
  );
}

