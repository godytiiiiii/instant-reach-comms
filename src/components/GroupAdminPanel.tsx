import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Shield, 
  UserMinus, 
  MessageSquare, 
  Clock, 
  Users,
  Settings,
  Crown,
  Ban
} from "lucide-react";

interface GroupMember {
  id: string;
  name: string;
  avatar: string;
  role: 'admin' | 'moderator' | 'member';
  joinedAt: string;
  isOnline: boolean;
}

interface GroupAdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  groupName: string;
  memberCount: number;
}

const mockMembers: GroupMember[] = [
  { id: "1", name: "Sarah Johnson", avatar: "/placeholder.svg", role: "admin", joinedAt: "Jan 2024", isOnline: true },
  { id: "2", name: "Mike Chen", avatar: "/placeholder.svg", role: "moderator", joinedAt: "Jan 2024", isOnline: false },
  { id: "3", name: "Lisa Park", avatar: "/placeholder.svg", role: "member", joinedAt: "Feb 2024", isOnline: true },
  { id: "4", name: "David Kim", avatar: "/placeholder.svg", role: "member", joinedAt: "Mar 2024", isOnline: true }
];

export default function GroupAdminPanel({ isOpen, onClose, groupName, memberCount }: GroupAdminPanelProps) {
  const [members] = useState<GroupMember[]>(mockMembers);
  const [settings, setSettings] = useState({
    restrictPosting: false,
    approveNewMembers: true,
    allowMediaSharing: true,
    muteNonAdmins: false
  });

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'admin': return <Crown className="h-3 w-3" />;
      case 'moderator': return <Shield className="h-3 w-3" />;
      default: return null;
    }
  };

  const getRoleBadge = (role: string) => {
    const variants = {
      admin: "bg-yellow-500/20 text-yellow-700 border-yellow-500/30",
      moderator: "bg-blue-500/20 text-blue-700 border-blue-500/30", 
      member: "bg-gray-500/20 text-gray-700 border-gray-500/30"
    };
    
    return (
      <Badge className={`${variants[role as keyof typeof variants]} text-xs`}>
        {getRoleIcon(role)}
        <span className="ml-1 capitalize">{role}</span>
      </Badge>
    );
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center">
      <Card className="w-[700px] h-[600px] bg-background border-primary/20">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="bg-gradient-primary bg-clip-text text-transparent">
                Group Admin Panel
              </CardTitle>
              <p className="text-sm text-muted-foreground">{groupName} • {memberCount} members</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" onClick={onClose}>
            ×
          </Button>
        </CardHeader>

        <CardContent>
          <Tabs defaultValue="members" className="h-[480px]">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="members">Members</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
              <TabsTrigger value="moderation">Moderation</TabsTrigger>
            </TabsList>

            <TabsContent value="members" className="space-y-4 h-[420px] overflow-y-auto">
              <div className="space-y-3">
                {members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between p-3 rounded-lg border bg-card">
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name[0]}</AvatarFallback>
                        </Avatar>
                        {member.isOnline && (
                          <div className="absolute -bottom-0.5 -right-0.5 h-3 w-3 bg-green-500 border-2 border-background rounded-full" />
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{member.name}</span>
                          {getRoleBadge(member.role)}
                        </div>
                        <p className="text-xs text-muted-foreground">Joined {member.joinedAt}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Button variant="ghost" size="sm">
                        <MessageSquare className="h-4 w-4" />
                      </Button>
                      {member.role !== 'admin' && (
                        <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-600">
                          <UserMinus className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="settings" className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Restrict Posting</h4>
                    <p className="text-sm text-muted-foreground">Only admins and moderators can post</p>
                  </div>
                  <Switch 
                    checked={settings.restrictPosting}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, restrictPosting: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Approve New Members</h4>
                    <p className="text-sm text-muted-foreground">New join requests require admin approval</p>
                  </div>
                  <Switch 
                    checked={settings.approveNewMembers}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, approveNewMembers: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Allow Media Sharing</h4>
                    <p className="text-sm text-muted-foreground">Members can share photos, videos, and files</p>
                  </div>
                  <Switch 
                    checked={settings.allowMediaSharing}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, allowMediaSharing: checked }))}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Mute Non-Admins</h4>
                    <p className="text-sm text-muted-foreground">Temporarily silence all members</p>
                  </div>
                  <Switch 
                    checked={settings.muteNonAdmins}
                    onCheckedChange={(checked) => setSettings(prev => ({ ...prev, muteNonAdmins: checked }))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="moderation" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Ban className="h-4 w-4 text-red-500" />
                    <h4 className="font-medium">Banned Members</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">0 banned members</p>
                  <Button variant="outline" size="sm" className="w-full">
                    View Banned List
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-orange-500" />
                    <h4 className="font-medium">Pending Requests</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">3 pending requests</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Review Requests
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Users className="h-4 w-4 text-blue-500" />
                    <h4 className="font-medium">Invite Link</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Share group access</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Generate Link
                  </Button>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Settings className="h-4 w-4 text-gray-500" />
                    <h4 className="font-medium">Auto-Moderation</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">Configure filters</p>
                  <Button variant="outline" size="sm" className="w-full">
                    Setup Filters
                  </Button>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}