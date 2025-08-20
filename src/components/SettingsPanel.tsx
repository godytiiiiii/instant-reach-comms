import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Settings,
  User,
  Shield,
  Palette,
  Bell,
  Briefcase,
  CreditCard,
  Eye,
  EyeOff,
  Lock,
  Zap,
  X
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface SettingsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function SettingsPanel({ isOpen, onClose }: SettingsPanelProps) {
  const [stealthMode, setStealthMode] = useState(false);
  const [autoReply, setAutoReply] = useState(false);
  const [businessMode, setBusinessMode] = useState(false);
  const [theme, setTheme] = useState("default");

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex">
      <div className="w-80 bg-card border-r border-border h-full animate-slide-in-right">
        {/* Header */}
        <div className="p-4 border-b border-border flex items-center justify-between">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5" />
            YOLOChat Settings
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Profile Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" alt="Profile" />
                  <AvatarFallback>YC</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-semibold">Your Name</h3>
                  <p className="text-sm text-muted-foreground">+1 234 567 8900</p>
                  <Badge variant="secondary" className="mt-1">
                    <Zap className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
              </div>
            </div>

            <Separator />

            {/* Privacy & Security */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Privacy & Security
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Stealth Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Hide online status & typing indicators
                    </p>
                  </div>
                  <Switch 
                    checked={stealthMode} 
                    onCheckedChange={setStealthMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">End-to-End Encryption</Label>
                    <p className="text-xs text-muted-foreground">
                      All messages are encrypted
                    </p>
                  </div>
                  <Lock className="h-4 w-4 text-primary" />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Read Receipts</Label>
                    <p className="text-xs text-muted-foreground">
                      Let others see when you read messages
                    </p>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>

            <Separator />

            {/* Business Features */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Briefcase className="h-4 w-4" />
                Business Features
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">Business Mode</Label>
                    <p className="text-xs text-muted-foreground">
                      Enable business tools & analytics
                    </p>
                  </div>
                  <Switch 
                    checked={businessMode} 
                    onCheckedChange={setBusinessMode}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="text-sm font-medium">AI Auto-Reply</Label>
                    <p className="text-xs text-muted-foreground">
                      Smart responses for busy times
                    </p>
                  </div>
                  <Switch 
                    checked={autoReply} 
                    onCheckedChange={setAutoReply}
                  />
                </div>

                <Button variant="outline" className="w-full justify-start">
                  <CreditCard className="h-4 w-4 mr-2" />
                  Payment Settings
                </Button>
              </div>
            </div>

            <Separator />

            {/* Customization */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Palette className="h-4 w-4" />
                Customization
              </h3>
              
              <div className="grid grid-cols-3 gap-2">
                {['default', 'dark', 'purple', 'green', 'blue', 'orange'].map((t) => (
                  <Button
                    key={t}
                    variant={theme === t ? "default" : "outline"}
                    size="sm"
                    onClick={() => setTheme(t)}
                  >
                    {t}
                  </Button>
                ))}
              </div>
            </div>

            <Separator />

            {/* Notifications */}
            <div className="space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Notifications
              </h3>
              
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Smart Notifications</Label>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">Message Previews</Label>
                  <Switch defaultChecked />
                </div>
              </div>
            </div>
          </div>
        </ScrollArea>
      </div>
      
      {/* Backdrop */}
      <div className="flex-1" onClick={onClose} />
    </div>
  );
}