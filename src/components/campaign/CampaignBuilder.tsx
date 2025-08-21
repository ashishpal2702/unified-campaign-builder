import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChannelSelector } from "./ChannelSelector";
import { MessageComposer } from "./MessageComposer";
import { ContactSelector } from "./ContactSelector";
import { CampaignPreview } from "./CampaignPreview";
import { AiMessageGenerator } from "./AiMessageGenerator";
import { Wand2, Send, Eye, Users, MessageSquare } from "lucide-react";

export interface Campaign {
  id: string;
  name: string;
  channels: string[];
  message: {
    text: string;
    images: string[];
  };
  contacts: string[];
  status: "draft" | "scheduled" | "sent";
}

export const CampaignBuilder = () => {
  const [campaign, setCampaign] = useState<Campaign>({
    id: "new",
    name: "New Campaign",
    channels: [],
    message: { text: "", images: [] },
    contacts: [],
    status: "draft"
  });

  const [activeTab, setActiveTab] = useState("channels");
  const [showAiGenerator, setShowAiGenerator] = useState(false);

  const updateCampaign = (updates: Partial<Campaign>) => {
    setCampaign(prev => ({ ...prev, ...updates }));
  };

  const canProceedToNext = () => {
    switch (activeTab) {
      case "channels": return campaign.channels.length > 0;
      case "audience": return campaign.contacts.length > 0;
      case "message": return campaign.message.text.length > 0;
      default: return true;
    }
  };

  const getNextTab = () => {
    switch (activeTab) {
      case "channels": return "audience";
      case "audience": return "message";
      case "message": return "preview";
      default: return "preview";
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Campaign Header */}
      <Card className="shadow-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-2xl bg-gradient-primary bg-clip-text text-transparent">
                Campaign Builder
              </CardTitle>
              <p className="text-muted-foreground mt-1">
                Create multi-channel marketing campaigns with AI-powered content
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => setShowAiGenerator(true)}
                className="hover:shadow-elegant transition-all duration-300"
              >
                <Wand2 className="h-4 w-4 mr-2" />
                AI Generator
              </Button>
              <Badge variant="secondary" className="bg-primary/10 text-primary">
                Draft
              </Badge>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Builder Interface */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <TabsList className="grid w-full grid-cols-4 h-12">
              <TabsTrigger 
                value="channels" 
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MessageSquare className="h-4 w-4" />
                Channels
              </TabsTrigger>
              <TabsTrigger 
                value="audience"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Users className="h-4 w-4" />
                Audience
              </TabsTrigger>
              <TabsTrigger 
                value="message"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <MessageSquare className="h-4 w-4" />
                Message
              </TabsTrigger>
              <TabsTrigger 
                value="preview"
                className="flex items-center gap-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
              >
                <Eye className="h-4 w-4" />
                Preview
              </TabsTrigger>
            </TabsList>
          </CardContent>
        </Card>

        <TabsContent value="channels" className="space-y-6">
          <ChannelSelector
            selectedChannels={campaign.channels}
            onChannelsChange={(channels) => updateCampaign({ channels })}
          />
        </TabsContent>

        <TabsContent value="audience" className="space-y-6">
          <ContactSelector
            selectedContacts={campaign.contacts}
            onContactsChange={(contacts) => updateCampaign({ contacts })}
          />
        </TabsContent>

        <TabsContent value="message" className="space-y-6">
          <MessageComposer
            message={campaign.message}
            onMessageChange={(message) => updateCampaign({ message })}
            channels={campaign.channels}
          />
        </TabsContent>

        <TabsContent value="preview" className="space-y-6">
          <CampaignPreview campaign={campaign} />
        </TabsContent>
      </Tabs>

      {/* Action Buttons */}
      <Card className="shadow-card">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between">
            <div className="text-sm text-muted-foreground">
              {campaign.channels.length > 0 && (
                <span>
                  {campaign.channels.length} channel{campaign.channels.length > 1 ? "s" : ""} selected
                  {campaign.contacts.length > 0 && (
                    <> • {campaign.contacts.length} contact{campaign.contacts.length > 1 ? "s" : ""}</>
                  )}
                </span>
              )}
            </div>
            
            <div className="flex gap-3">
              {activeTab !== "preview" && (
                <Button
                  onClick={() => setActiveTab(getNextTab())}
                  disabled={!canProceedToNext()}
                  className="bg-gradient-primary hover:shadow-glow transition-all duration-300"
                >
                  Continue
                </Button>
              )}
              
              {activeTab === "preview" && (
                <Button
                  className="bg-gradient-success hover:shadow-glow transition-all duration-300"
                  disabled={!campaign.message.text || campaign.contacts.length === 0}
                >
                  <Send className="h-4 w-4 mr-2" />
                  Send Campaign
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* AI Generator Modal */}
      {showAiGenerator && (
        <AiMessageGenerator
          onClose={() => setShowAiGenerator(false)}
          onGenerate={(content) => {
            updateCampaign({
              message: {
                text: content.text,
                images: content.images || []
              }
            });
            setShowAiGenerator(false);
            setActiveTab("message");
          }}
          channels={campaign.channels}
        />
      )}
    </div>
  );
};