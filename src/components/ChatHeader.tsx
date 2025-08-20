import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  ArrowLeft,
  Shield,
  Eye,
  EyeOff,
  Users,
  Calendar,
  Share
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface ChatHeaderProps {
  chatName: string;
  chatAvatar: string;
  isOnline?: boolean;
  isGroup?: boolean;
  memberCount?: number;
  onBackClick?: () => void;
  isEncrypted?: boolean;
  isStealthMode?: boolean;
  hasActiveEvent?: boolean;
}

export default function ChatHeader({ 
  chatName, 
  chatAvatar, 
  isOnline, 
  isGroup, 
  memberCount,
  onBackClick,
  isEncrypted = true,
  isStealthMode = false,
  hasActiveEvent = false
}: ChatHeaderProps) {
  return (
    <div className="border-b border-border p-4 bg-card">
      <div className="flex items-center gap-3">
        {/* Back button for mobile */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden"
          onClick={onBackClick}
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        {/* Chat Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="relative">
            <Avatar className="h-10 w-10">
              <AvatarImage src={chatAvatar} alt={chatName} />
              <AvatarFallback>
                {chatName.split(' ').map(n => n[0]).join('')}
              </AvatarFallback>
            </Avatar>
            {!isGroup && isOnline && (
              <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-primary rounded-full border-2 border-background"></div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h2 className="font-semibold truncate">{chatName}</h2>
              {isEncrypted && (
                <div title="End-to-end encrypted">
                  <Shield className="h-3 w-3 text-primary" />
                </div>
              )}
              {isStealthMode && (
                <div title="Stealth mode active">
                  <Eye className="h-3 w-3 text-muted-foreground" />
                </div>
              )}
            </div>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">
                {isGroup 
                  ? `${memberCount} members`
                  : isOnline 
                    ? 'Online' 
                    : 'Last seen recently'
                }
              </p>
              {hasActiveEvent && (
                <Badge variant="secondary" className="text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  Event
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Phone className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Video className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon">
            <Search className="h-5 w-5" />
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Users className="h-4 w-4 mr-2" />
                {isGroup ? 'Group info' : 'Contact info'}
              </DropdownMenuItem>
              <DropdownMenuItem>
                Media, links, and docs
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Calendar className="h-4 w-4 mr-2" />
                Event planner
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Share className="h-4 w-4 mr-2" />
                Share chat
              </DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Self-destruct messages</DropdownMenuItem>
              <DropdownMenuItem>Custom wallpaper</DropdownMenuItem>
              <DropdownMenuItem className="text-destructive">
                Clear chat
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </div>
  );
}