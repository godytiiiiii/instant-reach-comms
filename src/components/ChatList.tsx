import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Search, Phone, Video, MoreVertical } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Chat {
  id: string;
  name: string;
  lastMessage: string;
  timestamp: string;
  avatar: string;
  unreadCount?: number;
  isOnline?: boolean;
  isGroup?: boolean;
}

const mockChats: Chat[] = [
  {
    id: "1",
    name: "Sarah Johnson",
    lastMessage: "Hey! How was your meeting today?",
    timestamp: "2:30 PM",
    avatar: "/placeholder.svg",
    unreadCount: 2,
    isOnline: true,
  },
  {
    id: "2",
    name: "Family Group",
    lastMessage: "Mom: Don't forget dinner tomorrow!",
    timestamp: "1:45 PM",
    avatar: "/placeholder.svg",
    unreadCount: 5,
    isGroup: true,
  },
  {
    id: "3",
    name: "Alex Thompson",
    lastMessage: "Thanks for the documents 📄",
    timestamp: "12:20 PM",
    avatar: "/placeholder.svg",
    isOnline: true,
  },
  {
    id: "4",
    name: "Work Team",
    lastMessage: "John: The project is almost ready",
    timestamp: "11:30 AM",
    avatar: "/placeholder.svg",
    unreadCount: 1,
    isGroup: true,
  },
  {
    id: "5",
    name: "Emma Wilson",
    lastMessage: "Voice message (0:45)",
    timestamp: "Yesterday",
    avatar: "/placeholder.svg",
  },
];

interface ChatListProps {
  selectedChatId?: string;
  onChatSelect: (chatId: string) => void;
}

export default function ChatList({ selectedChatId, onChatSelect }: ChatListProps) {
  return (
    <div className="w-80 border-r border-border bg-sidebar-background flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl font-semibold">Chats</h1>
          <div className="flex gap-2">
            <Button variant="ghost" size="icon">
              <Phone className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <Video className="h-5 w-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-5 w-5" />
            </Button>
          </div>
        </div>
        
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search chats..." 
            className="pl-10 bg-muted"
          />
        </div>
      </div>

      {/* Chat List */}
      <ScrollArea className="flex-1">
        <div className="p-2">
          {mockChats.map((chat) => (
            <div
              key={chat.id}
              onClick={() => onChatSelect(chat.id)}
              className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted ${
                selectedChatId === chat.id ? 'bg-accent' : ''
              }`}
            >
              <div className="relative">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={chat.avatar} alt={chat.name} />
                  <AvatarFallback>
                    {chat.name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                {chat.isOnline && (
                  <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-primary rounded-full border-2 border-background"></div>
                )}
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium truncate">{chat.name}</h3>
                  <span className="text-xs text-muted-foreground">{chat.timestamp}</span>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                  {chat.unreadCount && (
                    <Badge variant="default" className="ml-2 bg-primary text-primary-foreground">
                      {chat.unreadCount}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}