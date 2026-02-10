import { useAppStore } from "@/client/lib/store";

interface ChatHistoryDrawerProps {
    onSelectConversation: (messageId: string) => void;
}

export function ChatHistoryDrawer({
  onSelectConversation,
}: ChatHistoryDrawerProps) {
    const conversationsOrder = useAppStore((state) => state.conversation.conversationsOrder);
    const conversations = useAppStore((state) => state.conversation.conversations);
    const activeConversationId = useAppStore((state) => state.conversation.currentConversationId);
  return (
      <div className="h-full border-l border-gray-200 dark:border-gray-700">
        <div className="p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-lg font-bold text-gray-900">对话记录</h2>
          <ul className="mt-4 space-y-2 max-h-[400px] overflow-y-auto">
            {conversationsOrder.map((conversationId) => (
              <li key={conversationId}>
                <button
                  onClick={() => onSelectConversation(conversationId)}
                  className={`w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 ${activeConversationId === conversationId ? "bg-gray-200 font-semibold" : ""}`}
                >
                  {conversations[conversationId].title}
                </button>
              </li>
            ))}
          </ul>
        </div>
    </div>
  );
}