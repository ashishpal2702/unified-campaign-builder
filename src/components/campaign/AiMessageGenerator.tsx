import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Wand2, 
  Loader2, 
  Sparkles, 
  Copy, 
  RefreshCw,
  Image,
  Type,
  Target,
  Zap
} from "lucide-react";
import { toast } from "sonner";

interface AiMessageGeneratorProps {
  onClose: () => void;
  onGenerate: (content: { text: string; images?: string[] }) => void;
  channels: string[];
}

export const AiMessageGenerator = ({ onClose, onGenerate, channels }: AiMessageGeneratorProps) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [campaignType, setCampaignType] = useState("");
  const [tone, setTone] = useState("");
  const [includeImages, setIncludeImages] = useState(false);
  const [generatedContent, setGeneratedContent] = useState<{
    text: string;
    images: string[];
    channelVersions?: Record<string, string>;
  } | null>(null);
  const [selectedEditChannel, setSelectedEditChannel] = useState<string>("");

  const campaignTypes = [
    "Product Launch",
    "Promotional Sale",
    "Event Announcement",
    "Newsletter",
    "Customer Welcome",
    "Abandoned Cart",
    "Survey Request",
    "Holiday Greeting",
    "Service Update",
    "Educational Content"
  ];

  const tones = [
    "Professional",
    "Friendly",
    "Excited",
    "Urgent",
    "Casual",
    "Formal",
    "Playful",
    "Reassuring"
  ];

  const generateContent = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt");
      return;
    }

    setIsGenerating(true);
    
    try {
      // Simulate AI generation (in real app, this would call OpenAI API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockGeneratedText = `🎉 Exciting news from ${businessName || "our company"}! 
      
${prompt} 

Don't miss out on this amazing opportunity! 

${campaignType === "Promotional Sale" ? "Limited time offer - act fast!" : ""}
${campaignType === "Product Launch" ? "Be among the first to experience innovation!" : ""}

Visit our website or contact us today!

Best regards,
${businessName || "The Team"}`;

      const mockImages = includeImages ? [
        "https://via.placeholder.com/400x300?text=Generated+Image+1",
        "https://via.placeholder.com/400x300?text=Generated+Image+2"
      ] : [];

      // Generate channel-specific versions
      const channelVersions: Record<string, string> = {};
      channels.forEach(channel => {
        if (channel === "sms") {
          channelVersions[channel] = `${businessName || "Our company"}: ${prompt.substring(0, 100)}... Text STOP to opt out.`;
        } else if (channel === "email") {
          channelVersions[channel] = `Subject: ${campaignType || "Important Update"}\n\n${mockGeneratedText}\n\nBest regards,\n${businessName || "The Team"}`;
        } else if (channel === "rcs") {
          channelVersions[channel] = `🎉 ${mockGeneratedText}\n\n[Tap for more info] [Visit website]`;
        } else {
          channelVersions[channel] = mockGeneratedText;
        }
      });

      setGeneratedContent({
        text: mockGeneratedText,
        images: mockImages,
        channelVersions
      });
      
      toast.success("Content generated successfully!");
    } catch (error) {
      toast.error("Failed to generate content");
    } finally {
      setIsGenerating(false);
    }
  };

  const useGenerated = () => {
    if (generatedContent) {
      const finalText = selectedEditChannel && generatedContent.channelVersions?.[selectedEditChannel] 
        ? generatedContent.channelVersions[selectedEditChannel] 
        : generatedContent.text;
      onGenerate({
        text: finalText,
        images: generatedContent.images
      });
    }
  };

  const copyToClipboard = () => {
    if (generatedContent) {
      const textToCopy = selectedEditChannel && generatedContent.channelVersions?.[selectedEditChannel] 
        ? generatedContent.channelVersions[selectedEditChannel] 
        : generatedContent.text;
      navigator.clipboard.writeText(textToCopy);
      toast.success("Copied to clipboard!");
    }
  };

  const updateChannelVersion = (channel: string, newText: string) => {
    if (generatedContent) {
      setGeneratedContent({
        ...generatedContent,
        channelVersions: {
          ...generatedContent.channelVersions,
          [channel]: newText
        }
      });
    }
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl flex items-center gap-2">
            <Wand2 className="h-6 w-6 text-primary" />
            AI Message Generator
          </DialogTitle>
          <p className="text-muted-foreground">
            Generate compelling campaign content with AI. Customize the prompt and let AI create professional messages for your channels.
          </p>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          {/* Input Section */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Target className="h-5 w-5 text-brand-blue" />
                  Campaign Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="business">Business Name</Label>
                  <Input
                    id="business"
                    placeholder="Enter your business name"
                    value={businessName}
                    onChange={(e) => setBusinessName(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Campaign Type</Label>
                  <Select value={campaignType} onValueChange={setCampaignType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select campaign type" />
                    </SelectTrigger>
                    <SelectContent>
                      {campaignTypes.map(type => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Tone</Label>
                  <Select value={tone} onValueChange={setTone}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select tone" />
                    </SelectTrigger>
                    <SelectContent>
                      {tones.map(toneOption => (
                        <SelectItem key={toneOption} value={toneOption}>{toneOption}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="prompt">Message Prompt</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Describe what you want to communicate (e.g., 'Announce our new AI-powered app that helps businesses automate customer service')"
                    value={prompt}
                    onChange={(e) => setPrompt(e.target.value)}
                    className="min-h-24"
                  />
                </div>

                {/* Channel Context */}
                {channels.length > 0 && (
                  <div className="space-y-2">
                    <Label>Target Channels</Label>
                    <div className="flex flex-wrap gap-2">
                      {channels.map(channel => (
                        <Badge key={channel} variant="secondary" className="capitalize">
                          {channel}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Options */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="includeImages"
                      checked={includeImages}
                      onChange={(e) => setIncludeImages(e.target.checked)}
                      className="rounded"
                    />
                    <Label htmlFor="includeImages" className="flex items-center gap-2">
                      <Image className="h-4 w-4" />
                      Generate images (not available for SMS)
                    </Label>
                  </div>
                </div>

                <Button
                  onClick={generateContent}
                  disabled={isGenerating || !prompt.trim()}
                  className="w-full bg-gradient-primary hover:shadow-glow"
                >
                  {isGenerating ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generate Content
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Output Section */}
          <div className="space-y-6">
            <Card className="shadow-card">
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <Type className="h-5 w-5 text-brand-green" />
                  Generated Content
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!generatedContent ? (
                  <div className="text-center py-12 text-muted-foreground">
                    <Wand2 className="h-16 w-16 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium mb-2">Ready to Generate</p>
                    <p>Fill in the details and click "Generate Content" to create your message</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {/* Channel Selection for Editing */}
                    {channels.length > 1 && (
                      <div className="space-y-2">
                        <Label>Edit for Specific Channel</Label>
                        <Select value={selectedEditChannel} onValueChange={setSelectedEditChannel}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select channel to customize" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="">General Version</SelectItem>
                            {channels.map(channel => (
                              <SelectItem key={channel} value={channel}>
                                {channel.toUpperCase()} Version
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {/* Generated Text */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <Label>
                          {selectedEditChannel ? `${selectedEditChannel.toUpperCase()} Message` : "Generated Message"}
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={copyToClipboard}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      </div>
                      
                      {selectedEditChannel ? (
                        <Textarea
                          value={generatedContent.channelVersions?.[selectedEditChannel] || generatedContent.text}
                          onChange={(e) => updateChannelVersion(selectedEditChannel, e.target.value)}
                          className="min-h-32 text-sm"
                          placeholder={`Customize message for ${selectedEditChannel}...`}
                        />
                      ) : (
                        <div className="bg-muted/50 p-4 rounded-lg border max-h-40 overflow-y-auto">
                          <p className="whitespace-pre-wrap text-sm">{generatedContent.text}</p>
                        </div>
                      )}
                      
                      <p className="text-xs text-muted-foreground mt-1">
                        {(selectedEditChannel && generatedContent.channelVersions?.[selectedEditChannel] 
                          ? generatedContent.channelVersions[selectedEditChannel] 
                          : generatedContent.text).length} characters
                      </p>
                    </div>

                    {/* Generated Images */}
                    {generatedContent.images.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Generated Images</Label>
                        <div className="grid grid-cols-2 gap-2">
                          {generatedContent.images.map((image, index) => (
                            <img
                              key={index}
                              src={image}
                              alt={`Generated ${index + 1}`}
                              className="w-full h-24 object-cover rounded border"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Actions */}
                    <div className="flex gap-2 pt-4">
                      <Button
                        variant="outline"
                        onClick={generateContent}
                        disabled={isGenerating}
                        className="flex-1"
                      >
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Regenerate
                      </Button>
                      <Button
                        onClick={useGenerated}
                        className="flex-1 bg-gradient-success"
                      >
                        <Zap className="h-4 w-4 mr-2" />
                        Use This Content
                      </Button>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* AI Tips */}
            <Card className="border-primary/20 bg-primary/5">
              <CardContent className="p-4">
                <h4 className="font-medium text-primary mb-2">💡 AI Generation Tips</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Be specific about your product/service and target audience</li>
                  <li>• Include key benefits or features you want to highlight</li>
                  <li>• Mention any urgency, discounts, or special offers</li>
                  <li>• The AI will optimize content for your selected channels</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};