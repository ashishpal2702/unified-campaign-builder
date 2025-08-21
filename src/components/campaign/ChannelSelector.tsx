import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Smartphone, Mail, MessageSquare, MessageCircle, Check } from "lucide-react";

interface ChannelSelectorProps {
  selectedChannels: string[];
  onChannelsChange: (channels: string[]) => void;
}

const channels = [
  {
    id: "sms",
    name: "SMS",
    description: "Reach customers instantly with text messages",
    icon: Smartphone,
    color: "channel-sms",
    features: ["Instant delivery", "High open rates", "Global reach"],
    limitations: ["160 character limit", "Text only"]
  },
  {
    id: "email",
    name: "Email",
    description: "Rich content with images and formatting",
    icon: Mail,
    color: "channel-email",
    features: ["Rich media support", "Detailed analytics", "Cost effective"],
    limitations: ["Spam filters", "Lower urgency"]
  },
  {
    id: "whatsapp",
    name: "WhatsApp",
    description: "Personal messaging on popular platform",
    icon: MessageSquare,
    color: "channel-whatsapp",
    features: ["Rich media", "Two-way messaging", "High engagement"],
    limitations: ["Template approval required", "Business account needed"]
  },
  {
    id: "rcs",
    name: "RCS",
    description: "Rich Communication Services with interactive features",
    icon: MessageCircle,
    color: "channel-rcs",
    features: ["Rich media", "Interactive buttons", "Delivery receipts", "Branding"],
    limitations: ["Carrier support required", "Android-focused", "Fallback to SMS needed"]
  }
];

export const ChannelSelector = ({ selectedChannels, onChannelsChange }: ChannelSelectorProps) => {
  const toggleChannel = (channelId: string) => {
    if (selectedChannels.includes(channelId)) {
      onChannelsChange(selectedChannels.filter(id => id !== channelId));
    } else {
      onChannelsChange([...selectedChannels, channelId]);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl">Choose Your Channels</CardTitle>
          <p className="text-muted-foreground">
            Select the communication channels for your campaign. You can choose multiple channels to maximize reach.
          </p>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const isSelected = selectedChannels.includes(channel.id);
              
              return (
                <Card
                  key={channel.id}
                  className={`cursor-pointer transition-all duration-300 hover:shadow-elegant ${
                    isSelected 
                      ? "border-primary bg-primary/5 shadow-glow" 
                      : "border-border hover:border-primary/50"
                  }`}
                  onClick={() => toggleChannel(channel.id)}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className={`p-3 rounded-lg bg-${channel.color}/10`}>
                        <Icon className={`h-6 w-6 text-${channel.color}`} />
                      </div>
                      {isSelected && (
                        <div className="p-1 rounded-full bg-primary">
                          <Check className="h-4 w-4 text-primary-foreground" />
                        </div>
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{channel.name}</h3>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-success mb-2">✓ Features</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {channel.features.map((feature, index) => (
                          <li key={index}>• {feature}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-warning mb-2">⚠ Considerations</h4>
                      <ul className="text-xs text-muted-foreground space-y-1">
                        {channel.limitations.map((limitation, index) => (
                          <li key={index}>• {limitation}</li>
                        ))}
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          
          {selectedChannels.length > 0 && (
            <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-primary">Selected Channels</h4>
                  <p className="text-sm text-muted-foreground">
                    Your campaign will be sent through {selectedChannels.length} channel{selectedChannels.length > 1 ? "s" : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  {selectedChannels.map(channelId => {
                    const channel = channels.find(c => c.id === channelId);
                    return (
                      <Badge key={channelId} variant="secondary" className="bg-primary text-primary-foreground">
                        {channel?.name}
                      </Badge>
                    );
                  })}
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};