import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Campaign } from "./CampaignBuilder";
import { 
  Send, 
  Clock, 
  Users, 
  MessageSquare, 
  Mail, 
  Smartphone,
  Calendar,
  Target,
  Save,
  Eye
} from "lucide-react";
import { useState } from "react";
import { useCampaigns } from "@/hooks/useCampaigns";
import { toast } from "sonner";

interface CampaignPreviewProps {
  campaign: Campaign;
}

export const CampaignPreview = ({ campaign }: CampaignPreviewProps) => {
  const { createCampaign } = useCampaigns();
  const [isScheduleDialogOpen, setIsScheduleDialogOpen] = useState(false);
  const [scheduledDate, setScheduledDate] = useState("");
  const [scheduledTime, setScheduledTime] = useState("");

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "sms": return <Smartphone className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "whatsapp": return <MessageSquare className="h-4 w-4" />;
      default: return null;
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "sms": return "bg-channel-sms text-white";
      case "email": return "bg-channel-email text-white";
      case "whatsapp": return "bg-channel-whatsapp text-white";
      default: return "bg-muted";
    }
  };

  const estimatedReach = campaign.contacts.length * campaign.channels.length;
  const estimatedCost = campaign.channels.reduce((total, channel) => {
    const rates = { sms: 0.05, email: 0.001, whatsapp: 0.02 };
    return total + ((rates[channel as keyof typeof rates] || 0) * campaign.contacts.length);
  }, 0);

  const handleSaveDraft = async () => {
    try {
      const campaignData = {
        name: campaign.name,
        channels: campaign.channels,
        message: campaign.message,
        selected_contacts: campaign.contacts,
        status: 'draft' as const,
        user_id: null // Will be set by RLS
      };

      const result = await createCampaign(campaignData);
      if (!result.error) {
        toast.success("Campaign saved as draft successfully");
      } else {
        toast.error("Failed to save campaign: " + result.error);
      }
    } catch (error) {
      toast.error("Failed to save campaign");
    }
  };

  const handleScheduleCampaign = () => {
    setIsScheduleDialogOpen(true);
  };

  const handleConfirmSchedule = async () => {
    if (!scheduledDate || !scheduledTime) {
      toast.error("Please select both date and time");
      return;
    }

    try {
      const scheduledDateTime = new Date(`${scheduledDate}T${scheduledTime}`).toISOString();
      
      const campaignData = {
        name: campaign.name,
        channels: campaign.channels,
        message: campaign.message,
        selected_contacts: campaign.contacts,
        status: 'scheduled' as const,
        scheduled_at: scheduledDateTime,
        user_id: null // Will be set by RLS
      };

      const result = await createCampaign(campaignData);
      if (!result.error) {
        toast.success("Campaign scheduled successfully");
        setIsScheduleDialogOpen(false);
        setScheduledDate("");
        setScheduledTime("");
      } else {
        toast.error("Failed to schedule campaign: " + result.error);
      }
    } catch (error) {
      toast.error("Failed to schedule campaign");
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Target className="h-5 w-5 text-brand-green" />
            Campaign Preview
          </CardTitle>
          <p className="text-muted-foreground">
            Review your campaign details before sending. Make sure everything looks perfect!
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Campaign Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <MessageSquare className="h-8 w-8 text-primary" />
                </div>
                <div className="text-2xl font-bold text-primary">{campaign.channels.length}</div>
                <div className="text-sm text-muted-foreground">Channel{campaign.channels.length > 1 ? "s" : ""}</div>
              </CardContent>
            </Card>
            
            <Card className="border-brand-blue/20 bg-brand-blue/5">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="h-8 w-8 text-brand-blue" />
                </div>
                <div className="text-2xl font-bold text-brand-blue">{campaign.contacts.length}</div>
                <div className="text-sm text-muted-foreground">Contact{campaign.contacts.length > 1 ? "s" : ""}</div>
              </CardContent>
            </Card>
            
            <Card className="border-brand-green/20 bg-brand-green/5">
              <CardContent className="p-4 text-center">
                <div className="flex items-center justify-center mb-2">
                  <Send className="h-8 w-8 text-brand-green" />
                </div>
                <div className="text-2xl font-bold text-brand-green">{estimatedReach}</div>
                <div className="text-sm text-muted-foreground">Total Messages</div>
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Channel Details */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Selected Channels</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {campaign.channels.map((channel) => (
                <Card key={channel} className="border-2 border-dashed">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`p-2 rounded ${getChannelColor(channel)}`}>
                        {getChannelIcon(channel)}
                      </div>
                      <div>
                        <h4 className="font-medium capitalize">{channel}</h4>
                        <p className="text-sm text-muted-foreground">
                          {campaign.contacts.length} recipients
                        </p>
                      </div>
                    </div>
                    
                    {/* Message Preview */}
                    <div className="bg-muted/50 p-3 rounded text-sm">
                      <p className="line-clamp-3">{campaign.message.text || "No message content"}</p>
                      {campaign.message.images.length > 0 && channel !== "sms" && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          +{campaign.message.images.length} image{campaign.message.images.length > 1 ? "s" : ""}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <Separator />

          {/* Message Content */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Message Content</h3>
            <Card className="border-2 border-dashed">
              <CardContent className="p-4">
                {campaign.message.text ? (
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium mb-2">Text Content</h4>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{campaign.message.text}</p>
                      </div>
                      <p className="text-sm text-muted-foreground mt-2">
                        {campaign.message.text.length} characters
                      </p>
                    </div>
                    
                    {campaign.message.images.length > 0 && (
                      <div>
                        <h4 className="font-medium mb-2">Images ({campaign.message.images.length})</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                          {campaign.message.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Image ${index + 1}`}
                              className="w-full h-20 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-muted-foreground">
                    <MessageSquare className="h-12 w-12 mx-auto mb-2 opacity-50" />
                    <p>No message content created yet</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Separator />

          {/* Campaign Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Delivery Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Send Time</p>
                    <p className="text-sm text-muted-foreground">Immediately after confirmation</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="font-medium">Estimated Delivery</p>
                    <p className="text-sm text-muted-foreground">Within 5 minutes</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Cost Estimate</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Base cost:</span>
                  <span>${estimatedCost.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Platform fee:</span>
                  <span>$0.00</span>
                </div>
                <Separator />
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span className="text-brand-green">${estimatedCost.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status and Actions */}
          <div className="flex items-center justify-between p-4 bg-primary/5 rounded-lg border border-primary/20">
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="bg-warning text-warning-foreground">
                Ready to Send
              </Badge>
              <span className="text-sm text-muted-foreground">
                All requirements met
              </span>
            </div>
            
            <div className="flex gap-3">
              <Button variant="outline" onClick={handleSaveDraft}>
                <Save className="h-4 w-4 mr-2" />
                Save as Draft
              </Button>
              <Button variant="outline" onClick={handleScheduleCampaign}>
                <Calendar className="h-4 w-4 mr-2" />
                Schedule
              </Button>
              <Button className="bg-gradient-primary hover:shadow-glow">
                <Send className="h-4 w-4 mr-2" />
                Send Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Schedule Dialog */}
      <Dialog open={isScheduleDialogOpen} onOpenChange={setIsScheduleDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Schedule Campaign</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="scheduled-date">Date</Label>
              <Input
                id="scheduled-date"
                type="date"
                value={scheduledDate}
                onChange={(e) => setScheduledDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
              />
            </div>
            <div>
              <Label htmlFor="scheduled-time">Time</Label>
              <Input
                id="scheduled-time"
                type="time"
                value={scheduledTime}
                onChange={(e) => setScheduledTime(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => setIsScheduleDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                className="flex-1"
                onClick={handleConfirmSchedule}
              >
                Schedule
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};