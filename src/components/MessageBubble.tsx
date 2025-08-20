import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Check, CheckCheck, Clock, Download, Play } from "lucide-react";
import { Button } from "@/components/ui/button";

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

interface MessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
}

export default function MessageBubble({ message, showAvatar }: MessageBubbleProps) {
  const getStatusIcon = () => {
    switch (message.status) {
      case 'sending':
        return <Clock className="h-3 w-3" />;
      case 'sent':
        return <Check className="h-3 w-3" />;
      case 'delivered':
        return <CheckCheck className="h-3 w-3" />;
      case 'read':
        return <CheckCheck className="h-3 w-3 text-primary" />;
      default:
        return null;
    }
  };

  const renderMessageContent = () => {
    switch (message.type) {
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden max-w-xs">
            <img 
              src={message.mediaUrl} 
              alt="Shared image" 
              className="w-full h-auto"
            />
            {message.content && (
              <div className="p-2 bg-black/20">
                <p className="text-sm">{message.content}</p>
              </div>
            )}
          </div>
        );
      
      case 'audio':
        return (
          <div className="flex items-center gap-3 min-w-48">
            <Button size="icon" variant="ghost" className="h-8 w-8 rounded-full bg-white/20">
              <Play className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <div className="h-1 bg-white/30 rounded-full">
                <div className="h-1 bg-white rounded-full w-1/3"></div>
              </div>
            </div>
            <span className="text-xs opacity-80">{message.audioDuration}</span>
          </div>
        );
      
      case 'document':
        return (
          <div className="flex items-center gap-3 min-w-48">
            <div className="h-10 w-10 bg-white/20 rounded-lg flex items-center justify-center">
              <Download className="h-5 w-5" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">{message.fileName}</p>
              <p className="text-xs opacity-80">{message.fileSize}</p>
            </div>
          </div>
        );
      
      default:
        return <p className="text-sm whitespace-pre-wrap">{message.content}</p>;
    }
  };

  return (
    <div className={`flex items-end gap-2 mb-4 ${message.sent ? 'flex-row-reverse' : ''}`}>
      {showAvatar && !message.sent && message.sender && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback className="text-xs">
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] ${message.sent ? 'ml-auto' : 'mr-auto'}`}>
        {!message.sent && showAvatar && message.sender && (
          <p className="text-xs text-muted-foreground mb-1 ml-3">
            {message.sender.name}
          </p>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 ${
            message.sent
              ? 'bg-message-sent text-message-sent-foreground rounded-br-md'
              : 'bg-message-received text-message-received-foreground rounded-bl-md'
          }`}
        >
          {renderMessageContent()}
          
          <div className={`flex items-center gap-1 mt-1 ${
            message.sent ? 'justify-end' : 'justify-start'
          }`}>
            <span className="text-xs opacity-70">{message.timestamp}</span>
            {message.sent && getStatusIcon()}
          </div>
        </div>
      </div>
    </div>
  );
}