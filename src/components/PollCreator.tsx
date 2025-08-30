import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { 
  BarChart3, 
  Plus, 
  X, 
  Calendar as CalendarIcon,
  Clock
} from "lucide-react";
import { format } from "date-fns";

interface PollOption {
  id: string;
  text: string;
}

interface PollCreatorProps {
  isOpen: boolean;
  onClose: () => void;
  onCreatePoll: (poll: any) => void;
}

export default function PollCreator({ isOpen, onClose, onCreatePoll }: PollCreatorProps) {
  const [question, setQuestion] = useState("");
  const [options, setOptions] = useState<PollOption[]>([
    { id: "1", text: "" },
    { id: "2", text: "" }
  ]);
  const [settings, setSettings] = useState({
    allowMultiple: false,
    anonymous: false,
    hasDeadline: false
  });
  const [deadline, setDeadline] = useState<Date>();

  const addOption = () => {
    setOptions(prev => [...prev, { id: Date.now().toString(), text: "" }]);
  };

  const removeOption = (id: string) => {
    if (options.length > 2) {
      setOptions(prev => prev.filter(option => option.id !== id));
    }
  };

  const updateOption = (id: string, text: string) => {
    setOptions(prev => prev.map(option => 
      option.id === id ? { ...option, text } : option
    ));
  };

  const handleCreatePoll = () => {
    const validOptions = options.filter(opt => opt.text.trim());
    
    if (!question.trim() || validOptions.length < 2) return;

    const poll = {
      id: Date.now().toString(),
      question: question.trim(),
      options: validOptions,
      settings,
      deadline: settings.hasDeadline ? deadline : null,
      createdAt: new Date(),
      votes: {}
    };

    onCreatePoll(poll);
    onClose();
    
    // Reset form
    setQuestion("");
    setOptions([{ id: "1", text: "" }, { id: "2", text: "" }]);
    setSettings({ allowMultiple: false, anonymous: false, hasDeadline: false });
    setDeadline(undefined);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-[500px] max-h-[600px] bg-background border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
              Create Poll
            </CardTitle>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>

        <CardContent className="space-y-6 max-h-[500px] overflow-y-auto">
          {/* Poll Question */}
          <div className="space-y-2">
            <Label htmlFor="question">Poll Question</Label>
            <Input
              id="question"
              placeholder="What's your question?"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="text-base"
            />
          </div>

          {/* Poll Options */}
          <div className="space-y-3">
            <Label>Options</Label>
            {options.map((option, index) => (
              <div key={option.id} className="flex items-center gap-2">
                <div className="flex-1">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option.text}
                    onChange={(e) => updateOption(option.id, e.target.value)}
                  />
                </div>
                {options.length > 2 && (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeOption(option.id)}
                    className="text-red-500 hover:text-red-600"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>
            ))}
            
            {options.length < 6 && (
              <Button
                variant="outline"
                onClick={addOption}
                className="w-full"
                size="sm"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            )}
          </div>

          {/* Poll Settings */}
          <div className="space-y-4 border-t pt-4">
            <h4 className="font-medium">Poll Settings</h4>
            
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="multiple">Allow Multiple Choices</Label>
                <p className="text-xs text-muted-foreground">Users can select more than one option</p>
              </div>
              <Switch
                id="multiple"
                checked={settings.allowMultiple}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowMultiple: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="anonymous">Anonymous Voting</Label>
                <p className="text-xs text-muted-foreground">Hide who voted for what</p>
              </div>
              <Switch
                id="anonymous"
                checked={settings.anonymous}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, anonymous: checked }))}
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="deadline">Set Deadline</Label>
                <p className="text-xs text-muted-foreground">Poll expires at a specific time</p>
              </div>
              <Switch
                id="deadline"
                checked={settings.hasDeadline}
                onCheckedChange={(checked) => setSettings(prev => ({ ...prev, hasDeadline: checked }))}
              />
            </div>

            {settings.hasDeadline && (
              <div className="space-y-2">
                <Label>Deadline</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-start text-left font-normal">
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {deadline ? format(deadline, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={deadline}
                      onSelect={setDeadline}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose} className="flex-1">
              Cancel
            </Button>
            <Button 
              onClick={handleCreatePoll} 
              className="flex-1"
              disabled={!question.trim() || options.filter(opt => opt.text.trim()).length < 2}
            >
              Create Poll
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}