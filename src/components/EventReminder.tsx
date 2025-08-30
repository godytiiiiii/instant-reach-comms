import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Calendar as CalendarIcon, 
  Clock, 
  MapPin, 
  Users, 
  Bell,
  X,
  Plus
} from "lucide-react";
import { format } from "date-fns";

interface EventReminderProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateEvent: (event: any) => void;
}

export default function EventReminder({ isOpen, onClose, onCreateEvent }: EventReminderProps) {
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    location: "",
    date: undefined as Date | undefined,
    time: "",
    reminderBefore: "15" // minutes
  });

  const handleCreateEvent = () => {
    if (!eventData.title.trim() || !eventData.date) return;

    const event = {
      id: Date.now().toString(),
      ...eventData,
      createdAt: new Date(),
      attendees: [],
      responses: { going: 0, maybe: 0, notGoing: 0 }
    };

    onCreateEvent(event);
    onClose();
    
    // Reset form
    setEventData({
      title: "",
      description: "",
      location: "",
      date: undefined,
      time: "",
      reminderBefore: "15"
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-[500px] max-h-[600px] bg-background border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-5 w-5 text-primary" />
            <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
              Create Event
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-4 max-h-[500px] overflow-y-auto">
          {/* Event Title */}
          <div className="space-y-2">
            <Label htmlFor="title">Event Title *</Label>
            <Input
              id="title"
              placeholder="What's the event?"
              value={eventData.title}
              onChange={(e) => setEventData(prev => ({ ...prev, title: e.target.value }))}
            />
          </div>

          {/* Event Description */}
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add more details about the event..."
              value={eventData.description}
              onChange={(e) => setEventData(prev => ({ ...prev, description: e.target.value }))}
              rows={3}
            />
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label>Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-full justify-start text-left font-normal">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {eventData.date ? format(eventData.date, "MMM d, yyyy") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={eventData.date}
                    onSelect={(date) => setEventData(prev => ({ ...prev, date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="time">Time</Label>
              <Input
                id="time"
                type="time"
                value={eventData.time}
                onChange={(e) => setEventData(prev => ({ ...prev, time: e.target.value }))}
              />
            </div>
          </div>

          {/* Location */}
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="location"
                placeholder="Where is the event?"
                value={eventData.location}
                onChange={(e) => setEventData(prev => ({ ...prev, location: e.target.value }))}
                className="pl-10"
              />
            </div>
          </div>

          {/* Reminder Settings */}
          <div className="space-y-2">
            <Label>Reminder</Label>
            <Select 
              value={eventData.reminderBefore} 
              onValueChange={(value) => setEventData(prev => ({ ...prev, reminderBefore: value }))}
            >
              <SelectTrigger>
                <Bell className="mr-2 h-4 w-4" />
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="0">At event time</SelectItem>
                <SelectItem value="5">5 minutes before</SelectItem>
                <SelectItem value="15">15 minutes before</SelectItem>
                <SelectItem value="30">30 minutes before</SelectItem>
                <SelectItem value="60">1 hour before</SelectItem>
                <SelectItem value="1440">1 day before</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleCreateEvent} 
              className="flex-1"
              disabled={!eventData.title.trim() || !eventData.date}
            >
              Create Event
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}