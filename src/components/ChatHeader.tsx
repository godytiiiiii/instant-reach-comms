import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { 
  Phone, 
  Video, 
  MoreVertical, 
  Search,
  ArrowLeft
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
}

export default function ChatHeader({ 
  chatName, 
  chatAvatar, 
  isOnline, 
  isGroup, 
  memberCount,
  onBackClick 
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
            <h2 className="font-semibold truncate">{chatName}</h2>
            <p className="text-sm text-muted-foreground">
              {isGroup 
                ? `${memberCount} members`
                : isOnline 
                  ? 'Online' 
                  : 'Last seen recently'
              }
            </p>
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
              <DropdownMenuItem>View contact</DropdownMenuItem>
              <DropdownMenuItem>Media, links, and docs</DropdownMenuItem>
              <DropdownMenuItem>Search</DropdownMenuItem>
              <DropdownMenuItem>Mute notifications</DropdownMenuItem>
              <DropdownMenuItem>Disappearing messages</DropdownMenuItem>
              <DropdownMenuItem>Wallpaper</DropdownMenuItem>
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