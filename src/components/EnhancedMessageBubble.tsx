import { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Check, 
  CheckCheck, 
  Clock, 
  Download, 
  Play, 
  Edit, 
  Trash2, 
  Reply, 
  MoreHorizontal,
  Eye,
  Timer
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  edited?: boolean;
  editHistory?: string[];
  isOneTime?: boolean;
  selfDestruct?: number;
  isPinned?: boolean;
  replyTo?: {
    content: string;
    sender: string;
  };
}

interface EnhancedMessageBubbleProps {
  message: Message;
  showAvatar?: boolean;
  onEdit?: (messageId: string) => void;
  onDelete?: (messageId: string) => void;
  onReply?: (message: Message) => void;
  onPin?: (messageId: string) => void;
}

export default function EnhancedMessageBubble({ 
  message, 
  showAvatar, 
  onEdit, 
  onDelete, 
  onReply, 
  onPin 
}: EnhancedMessageBubbleProps) {
  const [showEditHistory, setShowEditHistory] = useState(false);
  const [isDestroyed, setIsDestroyed] = useState(false);

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
    if (message.isOneTime && isDestroyed) {
      return (
        <div className="flex items-center gap-2 text-muted-foreground text-sm">
          <Eye className="h-4 w-4" />
          One-time message viewed
        </div>
      );
    }

    switch (message.type) {
      case 'image':
        return (
          <div className="rounded-lg overflow-hidden max-w-xs relative">
            <img 
              src={message.mediaUrl} 
              alt="Shared image" 
              className="w-full h-auto"
            />
            {message.isOneTime && (
              <div className="absolute top-2 right-2">
                <Badge variant="secondary" className="text-xs">
                  <Eye className="h-3 w-3 mr-1" />
                  Once
                </Badge>
              </div>
            )}
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
            {message.isOneTime && (
              <Badge variant="secondary" className="text-xs">
                <Eye className="h-3 w-3 mr-1" />
                Once
              </Badge>
            )}
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
        return (
          <div>
            {message.replyTo && (
              <div className="bg-white/10 border-l-2 border-primary pl-3 py-2 mb-2 rounded">
                <p className="text-xs text-primary font-medium">{message.replyTo.sender}</p>
                <p className="text-xs opacity-80 truncate">{message.replyTo.content}</p>
              </div>
            )}
            <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            {message.edited && (
              <p className="text-xs opacity-60 mt-1">
                edited
                {message.editHistory && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-auto p-0 ml-1 text-xs underline"
                    onClick={() => setShowEditHistory(!showEditHistory)}
                  >
                    (history)
                  </Button>
                )}
              </p>
            )}
            {showEditHistory && message.editHistory && (
              <div className="mt-2 p-2 bg-black/10 rounded text-xs">
                <p className="font-medium mb-1">Edit History:</p>
                {message.editHistory.map((edit, index) => (
                  <p key={index} className="opacity-70">
                    {index + 1}. {edit}
                  </p>
                ))}
              </div>
            )}
          </div>
        );
    }
  };

  return (
    <div className={`flex items-end gap-2 mb-4 group ${message.sent ? 'flex-row-reverse' : ''}`}>
      {showAvatar && !message.sent && message.sender && (
        <Avatar className="h-8 w-8">
          <AvatarImage src={message.sender.avatar} alt={message.sender.name} />
          <AvatarFallback className="text-xs">
            {message.sender.name[0]}
          </AvatarFallback>
        </Avatar>
      )}
      
      <div className={`max-w-[70%] relative ${message.sent ? 'ml-auto' : 'mr-auto'}`}>
        {!message.sent && showAvatar && message.sender && (
          <p className="text-xs text-muted-foreground mb-1 ml-3">
            {message.sender.name}
          </p>
        )}
        
        <div
          className={`rounded-2xl px-4 py-2 relative ${
            message.sent
              ? 'bg-message-sent text-message-sent-foreground rounded-br-md'
              : 'bg-message-received text-message-received-foreground rounded-bl-md'
          } ${message.isPinned ? 'ring-2 ring-primary/50' : ''}`}
        >
          {message.isPinned && (
            <div className="absolute -top-2 -right-2">
              <Badge variant="default" className="text-xs">
                Pinned
              </Badge>
            </div>
          )}

          {message.selfDestruct && (
            <div className="absolute -top-2 -left-2">
              <Badge variant="destructive" className="text-xs">
                <Timer className="h-3 w-3 mr-1" />
                {message.selfDestruct}s
              </Badge>
            </div>
          )}

          {renderMessageContent()}
          
          <div className={`flex items-center gap-1 mt-1 ${
            message.sent ? 'justify-end' : 'justify-start'
          }`}>
            <span className="text-xs opacity-70">{message.timestamp}</span>
            {message.sent && getStatusIcon()}
          </div>
        </div>

        {/* Message Actions */}
        <div className={`absolute top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity ${
          message.sent ? '-left-10' : '-right-10'
        }`}>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="h-8 w-8 bg-background shadow-md">
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align={message.sent ? "end" : "start"}>
              <DropdownMenuItem onClick={() => onReply?.(message)}>
                <Reply className="h-4 w-4 mr-2" />
                Reply
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onPin?.(message.id)}>
                Pin Message
              </DropdownMenuItem>
              {message.sent && (
                <>
                  <DropdownMenuItem onClick={() => onEdit?.(message.id)}>
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => onDelete?.(message.id)}
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}