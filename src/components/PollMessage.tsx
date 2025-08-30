import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  BarChart3, 
  Clock, 
  Users, 
  Check,
  Eye
} from "lucide-react";
import { format } from "date-fns";

interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters?: { name: string; avatar: string }[];
}

interface Poll {
  id: string;
  question: string;
  options: PollOption[];
  totalVotes: number;
  deadline?: Date;
  isExpired: boolean;
  allowMultiple: boolean;
  anonymous: boolean;
  createdBy: string;
  createdAt: Date;
}

interface PollMessageProps {
  poll: Poll;
  userVotes?: string[];
  onVote: (optionIds: string[]) => void;
}

export default function PollMessage({ poll, userVotes = [], onVote }: PollMessageProps) {
  const [selectedOptions, setSelectedOptions] = useState<string[]>(userVotes);
  const [showResults, setShowResults] = useState(false);

  const handleOptionClick = (optionId: string) => {
    if (poll.isExpired) return;

    let newSelection: string[];
    
    if (poll.allowMultiple) {
      newSelection = selectedOptions.includes(optionId)
        ? selectedOptions.filter(id => id !== optionId)
        : [...selectedOptions, optionId];
    } else {
      newSelection = selectedOptions.includes(optionId) ? [] : [optionId];
    }
    
    setSelectedOptions(newSelection);
  };

  const handleVote = () => {
    if (selectedOptions.length > 0) {
      onVote(selectedOptions);
    }
  };

  const getOptionPercentage = (votes: number) => {
    return poll.totalVotes > 0 ? (votes / poll.totalVotes) * 100 : 0;
  };

  const hasVoted = userVotes.length > 0;
  const canVote = !poll.isExpired && !hasVoted;

  return (
    <Card className="p-4 bg-card border-primary/10 max-w-md">
      {/* Poll Header */}
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="h-4 w-4 text-primary" />
        <span className="text-xs font-medium text-primary">POLL</span>
        {poll.isExpired && (
          <Badge variant="secondary" className="text-xs">
            Expired
          </Badge>
        )}
      </div>

      {/* Poll Question */}
      <h3 className="font-semibold mb-4 text-foreground">
        {poll.question}
      </h3>

      {/* Poll Options */}
      <div className="space-y-2 mb-4">
        {poll.options.map((option) => {
          const percentage = getOptionPercentage(option.votes);
          const isSelected = selectedOptions.includes(option.id);
          const isUserVote = userVotes.includes(option.id);
          
          return (
            <div key={option.id} className="relative">
              <Button
                variant={isSelected ? "default" : "outline"}
                className={`w-full justify-start p-3 h-auto relative overflow-hidden ${
                  canVote ? "cursor-pointer" : "cursor-default"
                } ${isUserVote ? "ring-2 ring-primary/50" : ""}`}
                onClick={() => canVote && handleOptionClick(option.id)}
                disabled={!canVote}
              >
                {/* Progress background */}
                {(hasVoted || showResults || poll.isExpired) && (
                  <div 
                    className="absolute left-0 top-0 h-full bg-primary/10 transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                  />
                )}
                
                <div className="flex items-center justify-between w-full relative z-10">
                  <div className="flex items-center gap-2">
                    {isSelected && canVote && (
                      <Check className="h-4 w-4" />
                    )}
                    {isUserVote && !canVote && (
                      <Check className="h-4 w-4 text-primary" />
                    )}
                    <span className="text-left">{option.text}</span>
                  </div>
                  
                  {(hasVoted || showResults || poll.isExpired) && (
                    <div className="flex items-center gap-2 text-sm">
                      <span>{option.votes}</span>
                      <span className="text-muted-foreground">
                        ({percentage.toFixed(0)}%)
                      </span>
                    </div>
                  )}
                </div>
              </Button>

              {/* Voters (if not anonymous) */}
              {!poll.anonymous && (hasVoted || showResults) && option.voters && option.voters.length > 0 && (
                <div className="flex items-center gap-1 mt-1 ml-2">
                  {option.voters.slice(0, 3).map((voter, index) => (
                    <Avatar key={index} className="h-5 w-5">
                      <AvatarImage src={voter.avatar} />
                      <AvatarFallback className="text-xs">{voter.name[0]}</AvatarFallback>
                    </Avatar>
                  ))}
                  {option.voters.length > 3 && (
                    <span className="text-xs text-muted-foreground ml-1">
                      +{option.voters.length - 3}
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Vote Button */}
      {canVote && selectedOptions.length > 0 && (
        <Button onClick={handleVote} className="w-full mb-3">
          Vote {poll.allowMultiple && selectedOptions.length > 1 && `(${selectedOptions.length})`}
        </Button>
      )}

      {/* Poll Footer */}
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            <span>{poll.totalVotes} votes</span>
          </div>
          
          {!hasVoted && !poll.isExpired && (
            <Button
              variant="ghost"
              size="sm"
              className="h-auto p-0 text-xs"
              onClick={() => setShowResults(!showResults)}
            >
              <Eye className="h-3 w-3 mr-1" />
              {showResults ? "Hide" : "View"} Results
            </Button>
          )}
        </div>

        {poll.deadline && (
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {poll.isExpired ? "Expired" : `Ends ${format(poll.deadline, "MMM d")}`}
            </span>
          </div>
        )}
      </div>
    </Card>
  );
}