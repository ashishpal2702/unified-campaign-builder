import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Plus, 
  MessageSquare, 
  Mail, 
  Smartphone, 
  BarChart3, 
  Users, 
  Calendar,
  Zap
} from "lucide-react";

interface SidebarProps {
  activeCampaign: string | null;
  onCampaignSelect: (campaignId: string) => void;
}

export const Sidebar = ({ activeCampaign, onCampaignSelect }: SidebarProps) => {
  const [campaigns] = useState([
    { 
      id: "1", 
      name: "Holiday Sale", 
      status: "active", 
      channels: ["sms", "email"],
      reach: "12.5K"
    },
    { 
      id: "2", 
      name: "Product Launch", 
      status: "draft", 
      channels: ["whatsapp", "email"],
      reach: "8.2K"
    },
    { 
      id: "3", 
      name: "Customer Welcome", 
      status: "scheduled", 
      channels: ["sms"],
      reach: "2.1K"
    }
  ]);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "sms": return <Smartphone className="h-3 w-3" />;
      case "email": return <Mail className="h-3 w-3" />;
      case "whatsapp": return <MessageSquare className="h-3 w-3" />;
      default: return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-brand-green";
      case "draft": return "bg-muted";
      case "scheduled": return "bg-brand-blue";
      default: return "bg-muted";
    }
  };

  return (
    <aside className="w-80 border-r border-border bg-card h-[calc(100vh-4rem)] overflow-y-auto">
      <div className="p-6 space-y-6">
        {/* Quick Actions */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="h-4 w-4 text-brand-orange" />
              Quick Actions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Button className="w-full justify-start bg-gradient-primary hover:shadow-glow transition-all duration-300">
              <Plus className="h-4 w-4 mr-2" />
              New Campaign
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Users className="h-4 w-4 mr-2" />
              Manage Contacts
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <BarChart3 className="h-4 w-4 mr-2" />
              Analytics
            </Button>
          </CardContent>
        </Card>

        {/* Recent Campaigns */}
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4 text-brand-blue" />
              Recent Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {campaigns.map((campaign) => (
              <div
                key={campaign.id}
                className={`p-3 rounded-lg border cursor-pointer transition-all duration-200 hover:shadow-md ${
                  activeCampaign === campaign.id 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50"
                }`}
                onClick={() => onCampaignSelect(campaign.id)}
              >
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm text-foreground truncate">
                    {campaign.name}
                  </h4>
                  <Badge 
                    variant="secondary" 
                    className={`${getStatusColor(campaign.status)} text-white text-xs`}
                  >
                    {campaign.status}
                  </Badge>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex gap-1">
                    {campaign.channels.map((channel, index) => (
                      <div
                        key={index}
                        className={`p-1 rounded ${
                          channel === "sms" ? "bg-channel-sms/10 text-channel-sms" :
                          channel === "email" ? "bg-channel-email/10 text-channel-email" :
                          "bg-channel-whatsapp/10 text-channel-whatsapp"
                        }`}
                      >
                        {getChannelIcon(channel)}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {campaign.reach} contacts
                  </span>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </aside>
  );
};