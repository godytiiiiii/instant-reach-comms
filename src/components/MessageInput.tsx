import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PollCreator from "./PollCreator";
import EventReminder from "./EventReminder";
import { 
  Send, 
  Paperclip, 
  Mic, 
  MicOff, 
  Image, 
  Camera, 
  FileText, 
  Smile,
  BarChart3,
  Calendar
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface MessageInputProps {
  onSendMessage: (message: string, type?: string, extraData?: any) => void;
}

export default function MessageInput({ onSendMessage }: MessageInputProps) {
  const [message, setMessage] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [showPollCreator, setShowPollCreator] = useState(false);
  const [showEventCreator, setShowEventCreator] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = () => {
    if (message.trim()) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
    // TODO: Implement actual voice recording
  };

  const handleFileSelect = (type: string) => {
    // TODO: Implement file selection
    console.log('File type selected:', type);
  };

  const handleCreatePoll = (poll: any) => {
    onSendMessage(`📊 ${poll.question}`, 'poll', poll);
  };

  const handleCreateEvent = (event: any) => {
    onSendMessage(`📅 ${event.title}`, 'event', event);
  };

  return (
    <>
      {/* Poll Creator Modal */}
      <PollCreator
        isOpen={showPollCreator}
        onClose={() => setShowPollCreator(false)}
        onCreatePoll={handleCreatePoll}
      />
      
      {/* Event Creator Modal */}
      <EventReminder
        isOpen={showEventCreator}
        onClose={() => setShowEventCreator(false)}
        onCreateEvent={handleCreateEvent}
      />

      <div className="border-t border-border p-4 bg-card">
        <div className="flex items-end gap-2">
          {/* Attachment Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="shrink-0">
                <Paperclip className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-48">
              <DropdownMenuItem onClick={() => handleFileSelect('document')}>
                <FileText className="h-4 w-4 mr-2" />
                Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFileSelect('image')}>
                <Image className="h-4 w-4 mr-2" />
                Photos & Videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleFileSelect('camera')}>
                <Camera className="h-4 w-4 mr-2" />
                Camera
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowPollCreator(true)}>
                <BarChart3 className="h-4 w-4 mr-2" />
                Create Poll
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setShowEventCreator(true)}>
                <Calendar className="h-4 w-4 mr-2" />
                Create Event
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

        {/* Message Input */}
        <div className="flex-1 relative">
          <Input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type a message..."
            className="pr-10 py-2 rounded-3xl bg-muted border-0 focus-visible:ring-1"
          />
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6"
          >
            <Smile className="h-4 w-4" />
          </Button>
        </div>

        {/* Voice/Send Button */}
        {message.trim() ? (
          <Button onClick={handleSend} size="icon" className="shrink-0 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        ) : (
          <Button 
            onClick={toggleRecording}
            size="icon" 
            variant={isRecording ? "destructive" : "default"}
            className="shrink-0 rounded-full"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
        )}
        </div>

        {isRecording && (
          <div className="mt-2 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <div className="w-2 h-2 bg-destructive rounded-full animate-pulse"></div>
            Recording... tap to stop
          </div>
        )}

        <input
          ref={fileInputRef}
          type="file"
          className="hidden"
          multiple
          accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        />
      </div>
    </>
  );
}