import { useState } from "react";
import ChatList from "./ChatList";
import ChatHeader from "./ChatHeader";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { ScrollArea } from "@/components/ui/scroll-area";

interface Message {
  id: string;
  content: string;
  timestamp: string;
  sent: boolean;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
  type?: 'text' | 'image' | 'audio' | 'document';
  mediaUrl?: string;
  fileName?: string;
  fileSize?: string;
  audioDuration?: string;
  sender?: {
    name: string;
    avatar: string;
  };
}

interface Chat {
  id: string;
  name: string;
  avatar: string;
  isOnline?: boolean;
  isGroup?: boolean;
  memberCount?: number;
  messages: Message[];
}

const mockChats: { [key: string]: Chat } = {
  "1": {
    id: "1",
    name: "Sarah Johnson",
    avatar: "/placeholder.svg",
    isOnline: true,
    messages: [
      {
        id: "1",
        content: "Hey! How was your meeting today?",
        timestamp: "2:30 PM",
        sent: false,
        status: 'read'
      },
      {
        id: "2", 
        content: "It went really well! The client loved our proposal 🎉",
        timestamp: "2:32 PM",
        sent: true,
        status: 'read'
      },
      {
        id: "3",
        content: "That's awesome! I knew you'd nail it. Want to celebrate later?",
        timestamp: "2:33 PM", 
        sent: false,
        status: 'read'
      },
      {
        id: "4",
        content: "Absolutely! How about that new restaurant downtown?",
        timestamp: "2:35 PM",
        sent: true,
        status: 'delivered'
      }
    ]
  },
  "2": {
    id: "2", 
    name: "Family Group",
    avatar: "/placeholder.svg",
    isGroup: true,
    memberCount: 5,
    messages: [
      {
        id: "1",
        content: "Don't forget dinner tomorrow at 7 PM!",
        timestamp: "1:45 PM",
        sent: false,
        sender: { name: "Mom", avatar: "/placeholder.svg" }
      },
      {
        id: "2",
        content: "I'll be there! Should I bring anything?",
        timestamp: "1:50 PM", 
        sent: true,
        status: 'read'
      },
      {
        id: "3",
        content: "Just bring yourself! ❤️",
        timestamp: "1:52 PM",
        sent: false,
        sender: { name: "Mom", avatar: "/placeholder.svg" }
      }
    ]
  }
};

export default function MessagingApp() {
  const [selectedChatId, setSelectedChatId] = useState<string>("1");
  const [chats, setChats] = useState(mockChats);

  const selectedChat = chats[selectedChatId];

  const handleSendMessage = (content: string, type: string = 'text') => {
    if (!selectedChat || !content.trim()) return;

    const newMessage: Message = {
      id: Date.now().toString(),
      content,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      sent: true,
      status: 'sending',
      type: type as any
    };

    setChats(prev => ({
      ...prev,
      [selectedChatId]: {
        ...prev[selectedChatId],
        messages: [...prev[selectedChatId].messages, newMessage]
      }
    }));

    // Simulate message status updates
    setTimeout(() => {
      setChats(prev => ({
        ...prev,
        [selectedChatId]: {
          ...prev[selectedChatId],
          messages: prev[selectedChatId].messages.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'sent' } : msg
          )
        }
      }));
    }, 1000);

    setTimeout(() => {
      setChats(prev => ({
        ...prev,
        [selectedChatId]: {
          ...prev[selectedChatId],
          messages: prev[selectedChatId].messages.map(msg => 
            msg.id === newMessage.id ? { ...msg, status: 'delivered' } : msg
          )
        }
      }));
    }, 2000);
  };

  return (
    <div className="h-screen flex bg-background">
      {/* Chat List Sidebar */}
      <ChatList 
        selectedChatId={selectedChatId}
        onChatSelect={setSelectedChatId}
      />

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col">
        {selectedChat ? (
          <>
            {/* Chat Header */}
            <ChatHeader
              chatName={selectedChat.name}
              chatAvatar={selectedChat.avatar}
              isOnline={selectedChat.isOnline}
              isGroup={selectedChat.isGroup}
              memberCount={selectedChat.memberCount}
            />

            {/* Messages Area */}
            <ScrollArea className="flex-1 bg-chat-background">
              <div className="p-4">
                {selectedChat.messages.map((message, index) => {
                  const showAvatar = selectedChat.isGroup && !message.sent && 
                    (index === 0 || selectedChat.messages[index - 1].sender?.name !== message.sender?.name);
                  
                  return (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      showAvatar={showAvatar}
                    />
                  );
                })}
              </div>
            </ScrollArea>

            {/* Message Input */}
            <MessageInput onSendMessage={handleSendMessage} />
          </>
        ) : (
          <div className="flex-1 flex items-center justify-center bg-chat-background">
            <div className="text-center text-muted-foreground">
              <h2 className="text-2xl font-semibold mb-2">Welcome to WhatsApp</h2>
              <p>Select a chat to start messaging</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}