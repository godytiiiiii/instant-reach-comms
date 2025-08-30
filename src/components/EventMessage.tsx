import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Calendar, 
  Clock, 
  MapPin, 
  Users, 
  Check,
  X,
  HelpCircle,
  Bell
} from "lucide-react";
import { format } from "date-fns";

interface EventAttendee {
  id: string;
  name: string;
  avatar: string;
  response: 'going' | 'maybe' | 'not-going';
}

interface Event {
  id: string;
  title: string;
  description?: string;
  location?: string;
  date: Date;
  time?: string;
  createdBy: string;
  attendees: EventAttendee[];
  responses: {
    going: number;
    maybe: number;
    notGoing: number;
  };
  reminderBefore: string;
}

interface EventMessageProps {
  event: Event;
  userResponse?: 'going' | 'maybe' | 'not-going';
  onRespond: (response: 'going' | 'maybe' | 'not-going') => void;
}

export default function EventMessage({ event, userResponse, onRespond }: EventMessageProps) {
  const [showAttendees, setShowAttendees] = useState(false);

  const getResponseIcon = (response: string) => {
    switch (response) {
      case 'going': return <Check className="h-4 w-4" />;
      case 'maybe': return <HelpCircle className="h-4 w-4" />;
      case 'not-going': return <X className="h-4 w-4" />;
      default: return null;
    }
  };

  const getResponseColor = (response: string) => {
    switch (response) {
      case 'going': return "bg-green-500/20 text-green-700 border-green-500/30";
      case 'maybe': return "bg-yellow-500/20 text-yellow-700 border-yellow-500/30";
      case 'not-going': return "bg-red-500/20 text-red-700 border-red-500/30";
      default: return "bg-gray-500/20 text-gray-700 border-gray-500/30";
    }
  };

  const totalResponses = event.responses.going + event.responses.maybe + event.responses.notGoing;
  const isUpcoming = event.date > new Date();

  return (
    <Card className="p-4 bg-card border-primary/10 max-w-md">
      {/* Event Header */}
      <div className="flex items-center gap-2 mb-3">
        <Calendar className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-primary">EVENT</span>
        {!isUpcoming && (
          <Badge variant="secondary" className="text-xs">
            Past Event
          </Badge>
        )}
      </div>

      {/* Event Details */}
      <div className="space-y-3 mb-4">
        <h3 className="font-semibold text-foreground">
          {event.title}
        </h3>

        {event.description && (
          <p className="text-sm text-muted-foreground">
            {event.description}
          </p>
        )}

        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>{format(event.date, "EEEE, MMMM d, yyyy")}</span>
          </div>

          {event.time && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{event.time}</span>
            </div>
          )}

          {event.location && (
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{event.location}</span>
            </div>
          )}

          <div className="flex items-center gap-2 text-muted-foreground">
            <Bell className="h-4 w-4" />
            <span>
              Reminder: {event.reminderBefore === "0" ? "At event time" : 
                event.reminderBefore === "5" ? "5 min before" :
                event.reminderBefore === "15" ? "15 min before" :
                event.reminderBefore === "30" ? "30 min before" :
                event.reminderBefore === "60" ? "1 hour before" :
                event.reminderBefore === "1440" ? "1 day before" : "Custom"}
            </span>
          </div>
        </div>
      </div>

      {/* Response Buttons */}
      {isUpcoming && (
        <div className="grid grid-cols-3 gap-2 mb-4">
          <Button
            variant={userResponse === 'going' ? "default" : "outline"}
            size="sm"
            onClick={() => onRespond('going')}
            className="flex items-center gap-1"
          >
            <Check className="h-3 w-3" />
            Going
          </Button>
          <Button
            variant={userResponse === 'maybe' ? "default" : "outline"}
            size="sm"
            onClick={() => onRespond('maybe')}
            className="flex items-center gap-1"
          >
            <HelpCircle className="h-3 w-3" />
            Maybe
          </Button>
          <Button
            variant={userResponse === 'not-going' ? "default" : "outline"}
            size="sm"
            onClick={() => onRespond('not-going')}
            className="flex items-center gap-1"
          >
            <X className="h-3 w-3" />
            Can't Go
          </Button>
        </div>
      )}

      {/* Response Summary */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-green-600">
              <Check className="h-3 w-3" />
              <span>{event.responses.going}</span>
            </div>
            <div className="flex items-center gap-1 text-yellow-600">
              <HelpCircle className="h-3 w-3" />
              <span>{event.responses.maybe}</span>
            </div>
            <div className="flex items-center gap-1 text-red-600">
              <X className="h-3 w-3" />
              <span>{event.responses.notGoing}</span>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="sm"
            className="text-xs h-auto p-1"
            onClick={() => setShowAttendees(!showAttendees)}
          >
            <Users className="h-3 w-3 mr-1" />
            {totalResponses} responses
          </Button>
        </div>

        {/* User Response Indicator */}
        {userResponse && (
          <div className="flex items-center gap-2">
            <Badge className={getResponseColor(userResponse)}>
              {getResponseIcon(userResponse)}
              <span className="ml-1 capitalize">
                {userResponse === 'not-going' ? 'Not Going' : userResponse}
              </span>
            </Badge>
          </div>
        )}

        {/* Attendees List */}
        {showAttendees && event.attendees.length > 0 && (
          <div className="space-y-2 pt-2 border-t">
            {['going', 'maybe', 'not-going'].map((response) => {
              const attendees = event.attendees.filter(a => a.response === response);
              if (attendees.length === 0) return null;

              return (
                <div key={response} className="space-y-1">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {getResponseIcon(response)}
                    <span className="capitalize">
                      {response === 'not-going' ? 'Not Going' : response} ({attendees.length})
                    </span>
                  </div>
                  <div className="flex items-center gap-1 ml-5">
                    {attendees.slice(0, 5).map((attendee) => (
                      <Avatar key={attendee.id} className="h-6 w-6">
                        <AvatarImage src={attendee.avatar} />
                        <AvatarFallback className="text-xs">{attendee.name[0]}</AvatarFallback>
                      </Avatar>
                    ))}
                    {attendees.length > 5 && (
                      <span className="text-xs text-muted-foreground ml-1">
                        +{attendees.length - 5}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </Card>
  );
}