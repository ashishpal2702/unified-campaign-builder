import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Smartphone, 
  Mail, 
  MessageSquare, 
  MessageCircle,
  Plus,
  X,
  Send,
  User,
  Building,
  Wand2,
  Loader2
} from "lucide-react";
import { toast } from "sonner";

interface ChannelEditorProps {
  channel: string;
  message: {
    text: string;
    images: string[];
    subject?: string;
  };
  onMessageChange: (message: { text: string; images: string[]; subject?: string }) => void;
}

export const ChannelEditor = ({ channel, message, onMessageChange }: ChannelEditorProps) => {
  const [isImproving, setIsImproving] = useState(false);

  const getChannelIcon = (channel: string) => {
    switch (channel) {
      case "sms": return <Smartphone className="h-4 w-4" />;
      case "email": return <Mail className="h-4 w-4" />;
      case "whatsapp": return <MessageSquare className="h-4 w-4" />;
      case "rcs": return <MessageCircle className="h-4 w-4" />;
      default: return null;
    }
  };

  const getChannelLimits = (channel: string) => {
    switch (channel) {
      case "sms": return { text: 160, images: 0 };
      case "email": return { text: 10000, images: 10 };
      case "whatsapp": return { text: 4096, images: 10 };
      case "rcs": return { text: 2048, images: 10 };
      default: return { text: 1000, images: 5 };
    }
  };

  const getChannelColor = (channel: string) => {
    switch (channel) {
      case "sms": return "channel-sms";
      case "email": return "channel-email";
      case "whatsapp": return "channel-whatsapp";
      case "rcs": return "channel-rcs";
      default: return "muted";
    }
  };

  const updateText = (text: string) => {
    onMessageChange({ ...message, text });
  };

  const updateSubject = (subject: string) => {
    onMessageChange({ ...message, subject });
  };

  const addImage = () => {
    const newImageUrl = `https://via.placeholder.com/400x300?text=${channel.toUpperCase()}+Image+${message.images.length + 1}`;
    onMessageChange({
      ...message,
      images: [...message.images, newImageUrl]
    });
  };

  const removeImage = (index: number) => {
    onMessageChange({
      ...message,
      images: message.images.filter((_, i) => i !== index)
    });
  };

  const improveWithAI = async () => {
    if (!message.text.trim()) {
      toast.error("Please enter some text to improve");
      return;
    }

    setIsImproving(true);
    
    try {
      // Simulate AI improvement (in real app, this would call OpenAI API)
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      let improvedText = message.text;
      
      // Channel-specific improvements
      switch (channel) {
        case "sms":
          improvedText = `✅ ${message.text.substring(0, 130)} Text STOP to opt out.`;
          break;
        case "email":
          improvedText = `Dear {FirstName},\n\n${message.text}\n\nThank you for your continued support!\n\nBest regards,\n{BrandName} Team`;
          break;
        case "whatsapp":
          improvedText = `👋 Hi {FirstName}!\n\n${message.text}\n\n💬 Reply to this message for instant support!`;
          break;
        case "rcs":
          improvedText = `🎉 ${message.text}\n\n[Learn More] [Contact Us]\n\nPowered by {BrandName}`;
          break;
      }
      
      updateText(improvedText);
      toast.success(`Message improved for ${channel.toUpperCase()}!`);
    } catch (error) {
      toast.error("Failed to improve message");
    } finally {
      setIsImproving(false);
    }
  };

  const limits = getChannelLimits(channel);
  const isOverLimit = message.text.length > limits.text;
  const colorClass = getChannelColor(channel);

  const renderPreview = () => {
    if (channel === "email") {
      return (
        <div className="space-y-4">
          {/* Email Preview */}
          <div className="bg-background border-2 border-muted rounded-lg shadow-lg overflow-hidden max-w-lg">
            {/* Browser Header */}
            <div className="bg-muted/50 px-4 py-2 border-b">
              <div className="flex items-center gap-2">
                <div className="flex gap-1">
                  <div className="w-3 h-3 rounded-full bg-red-500"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-background rounded px-3 py-1 text-xs text-muted-foreground">
                    inbox.gmail.com
                  </div>
                </div>
              </div>
            </div>
            
            {/* Email Interface */}
            <div className="bg-background">
              <div className="border-b bg-muted/20 px-4 py-3">
                <div className="flex items-center gap-3 mb-2">
                  <Mail className="h-5 w-5 text-channel-email" />
                  <span className="font-medium">Campaign Email</span>
                </div>
                {message.subject && (
                  <div className="text-lg font-semibold">{message.subject}</div>
                )}
                <div className="text-sm text-muted-foreground">
                  From: your-business@company.com
                </div>
              </div>
              
              <div className="p-4 space-y-4 max-h-40 overflow-y-auto">
                {message.text && (
                  <div className="prose prose-sm max-w-none">
                    <p className="whitespace-pre-wrap text-sm leading-relaxed">{message.text}</p>
                  </div>
                )}
                
                {message.images.length > 0 && (
                  <div className="grid grid-cols-1 gap-2">
                    {message.images.slice(0, limits.images).map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Email image ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    // Mobile Preview for SMS, WhatsApp, RCS
    return (
      <div className="space-y-4">
        <div className="bg-background border-2 border-muted rounded-3xl shadow-2xl overflow-hidden max-w-xs mx-auto" style={{aspectRatio: '9/16'}}>
          {/* Phone Header */}
          <div className="bg-background px-4 py-2 border-b">
            <div className="flex items-center justify-between">
              <div className="text-xs text-muted-foreground">9:41</div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-2 bg-muted rounded-sm"></div>
                <div className="w-1 h-2 bg-muted rounded-sm"></div>
                <div className="w-6 h-3 border border-muted rounded-sm">
                  <div className="w-4 h-full bg-green-500 rounded-sm"></div>
                </div>
              </div>
            </div>
          </div>
          
          {/* App Header */}
          <div className={`px-4 py-3 ${
            channel === "whatsapp" ? "bg-[#075E54] text-white" : 
            channel === "rcs" ? "bg-[#4285F4] text-white" : "bg-muted"
          } border-b`}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-muted-foreground/20 flex items-center justify-center">
                {getChannelIcon(channel)}
              </div>
              <div>
                <div className="font-medium text-sm">
                  {channel === "whatsapp" ? "Customer" : 
                   channel === "rcs" ? "Customer" : "Contact"}
                </div>
                <div className="text-xs opacity-70">
                  {channel === "whatsapp" ? "online" : 
                   channel === "rcs" ? "RCS enabled" : "Mobile"}
                </div>
              </div>
            </div>
          </div>
          
          {/* Messages Area */}
          <div className={`flex-1 p-4 ${
            channel === "whatsapp" ? "bg-[#ECE5DD]" : 
            channel === "rcs" ? "bg-gradient-to-b from-blue-50 to-white" : "bg-background"
          } min-h-[200px] flex flex-col justify-end`}>
            <div className="space-y-2">
              {message.text && (
                <div className={`ml-auto max-w-[90%] p-3 rounded-lg ${
                  channel === "whatsapp" 
                    ? "bg-[#DCF8C6] text-black" 
                    : channel === "rcs"
                    ? "bg-[#4285F4] text-white shadow-lg"
                    : "bg-blue-500 text-white"
                }`}>
                  <p className="text-xs whitespace-pre-wrap">{message.text}</p>
                  <div className="text-xs opacity-70 mt-1 text-right">
                    {channel === "whatsapp" ? "✓✓" : 
                     channel === "rcs" ? "✓ Read" : "Delivered"} 9:41
                  </div>
                </div>
              )}
              
              {message.images.length > 0 && (channel === "whatsapp" || channel === "rcs") && (
                <div className="ml-auto max-w-[90%] space-y-1">
                  {message.images.slice(0, limits.images).map((image, index) => (
                    <div key={index} className={`p-1 rounded-lg ${
                      channel === "whatsapp" ? "bg-[#DCF8C6]" : "bg-[#4285F4]/10 border border-[#4285F4]/30"
                    }`}>
                      <img
                        src={image}
                        alt={`${channel} image ${index + 1}`}
                        className="w-full h-16 object-cover rounded"
                      />
                      <div className="text-xs opacity-70 mt-1 text-right px-2 pb-1">
                        {channel === "whatsapp" ? "✓✓" : "✓ Read"} 9:41
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card className="shadow-card">
      <CardHeader>
        <CardTitle className={`text-lg flex items-center gap-2 text-${colorClass}`}>
          {getChannelIcon(channel)}
          {channel.toUpperCase()} Editor
          <Badge variant="secondary" className="ml-auto">
            {message.text.length}/{limits.text} chars
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Editor Section */}
          <div className="space-y-4">
            {/* Email Subject */}
            {channel === "email" && (
              <div className="space-y-2">
                <Label htmlFor={`subject-${channel}`}>Email Subject</Label>
                <Input
                  id={`subject-${channel}`}
                  placeholder="Enter email subject..."
                  value={message.subject || ""}
                  onChange={(e) => updateSubject(e.target.value)}
                />
              </div>
            )}

            {/* Message Content */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor={`message-${channel}`}>Message Content</Label>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={improveWithAI}
                    disabled={isImproving}
                    className="text-xs px-2 py-1 h-auto bg-primary/10 hover:bg-primary/20 text-primary"
                  >
                    {isImproving ? (
                      <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    ) : (
                      <Wand2 className="h-3 w-3 mr-1" />
                    )}
                    {isImproving ? "Improving..." : "AI Improve"}
                  </Button>
                </div>
              </div>
              
              <div className="flex gap-1 mb-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateText(message.text + "{FirstName}")}
                  className="text-xs px-2 py-1 h-auto"
                >
                  <User className="h-3 w-3 mr-1" />
                  +FirstName
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => updateText(message.text + "{BrandName}")}
                  className="text-xs px-2 py-1 h-auto"
                >
                  <Building className="h-3 w-3 mr-1" />
                  +BrandName
                </Button>
              </div>
              
              <Textarea
                id={`message-${channel}`}
                placeholder={`Type your ${channel.toUpperCase()} message here... Use {FirstName}, {BrandName} for personalization`}
                value={message.text}
                onChange={(e) => updateText(e.target.value)}
                className="min-h-32 resize-none"
              />
              
              <div className="flex justify-between text-sm text-muted-foreground">
                <span className={isOverLimit ? "text-destructive" : ""}>
                  {message.text.length}/{limits.text} characters
                </span>
                {channel === "sms" && message.text.length > 160 && (
                  <span className="text-warning">⚠ May be split into multiple messages</span>
                )}
              </div>
            </div>

            {/* Images (not for SMS) */}
            {channel !== "sms" && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Images</Label>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={addImage}
                    className="flex items-center gap-2"
                  >
                    <Plus className="h-4 w-4" />
                    Add Image
                  </Button>
                </div>
                
                {message.images.length > 0 && (
                  <div className="grid grid-cols-2 gap-2">
                    {message.images.map((image, index) => (
                      <div key={index} className="relative group">
                        <img
                          src={image}
                          alt={`Image ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <Button
                          variant="destructive"
                          size="sm"
                          className="absolute top-1 right-1 h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          onClick={() => removeImage(index)}
                        >
                          <X className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
                
                <div className="text-sm text-muted-foreground">
                  {message.images.length}/{limits.images} images
                </div>
              </div>
            )}

            {/* Channel-specific warnings */}
            {(isOverLimit || (channel !== "sms" && message.images.length > limits.images)) && (
              <div className="p-3 bg-warning/10 border border-warning/20 rounded-lg">
                <div className="flex items-center gap-2 mb-1">
                  {getChannelIcon(channel)}
                  <span className="font-medium capitalize text-warning">{channel} Issues:</span>
                </div>
                <ul className="text-sm text-warning">
                  {isOverLimit && (
                    <li>• Text exceeds {limits.text} character limit</li>
                  )}
                  {channel !== "sms" && message.images.length > limits.images && (
                    <li>• Too many images (max {limits.images})</li>
                  )}
                </ul>
              </div>
            )}
          </div>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <Label className="text-sm font-medium">Live Preview</Label>
              <Badge variant="outline" className="text-xs">
                {channel.toUpperCase()}
              </Badge>
            </div>
            {renderPreview()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};