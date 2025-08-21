import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Type } from "lucide-react";
import { ChannelEditor } from "./ChannelEditor";

interface MessageComposerProps {
  message: {
    text: string;
    images: string[];
  };
  onMessageChange: (message: { text: string; images: string[] }) => void;
  channels: string[];
}

interface ChannelMessage {
  text: string;
  images: string[];
  subject?: string;
}

export const MessageComposer = ({ message, onMessageChange, channels }: MessageComposerProps) => {
  // Separate state for each channel
  const [channelMessages, setChannelMessages] = useState<Record<string, ChannelMessage>>(() => {
    const initial: Record<string, ChannelMessage> = {};
    channels.forEach(channel => {
      initial[channel] = {
        text: message.text,
        images: [...message.images],
        subject: channel === "email" ? "" : undefined
      };
    });
    return initial;
  });

  // Update channel messages when the main message prop changes (from AI Generator)
  useEffect(() => {
    if (message.text || message.images.length > 0) {
      const updatedMessages: Record<string, ChannelMessage> = {};
      
      channels.forEach(channel => {
        // Generate channel-optimized content
        let channelText = message.text;
        let channelSubject = "";
        
        // Apply channel-specific formatting
        if (channel === "sms" && message.text) {
          // Keep SMS short and add opt-out
          channelText = message.text.length > 140 
            ? message.text.substring(0, 140) + "... Text STOP to opt out."
            : message.text + " Text STOP to opt out.";
        } else if (channel === "email" && message.text) {
          // Add email structure
          channelSubject = "Important Update from Your Business";
          channelText = `Dear {FirstName},\n\n${message.text}\n\nThank you for your continued support!\n\nBest regards,\n{BrandName} Team`;
        } else if (channel === "whatsapp" && message.text) {
          // Add WhatsApp styling
          channelText = `👋 Hi {FirstName}!\n\n${message.text}\n\n💬 Reply to this message for instant support!`;
        } else if (channel === "rcs" && message.text) {
          // Add RCS interactive elements
          channelText = `🎉 ${message.text}\n\n[Learn More] [Contact Us]\n\nPowered by {BrandName}`;
        }
        
        updatedMessages[channel] = {
          text: channelText,
          images: channel === "sms" ? [] : [...message.images], // SMS doesn't support images
          subject: channel === "email" ? channelSubject : undefined
        };
      });
      
      setChannelMessages(updatedMessages);
      
      // Update the main message state with the first channel's data for backwards compatibility
      const firstChannel = channels[0];
      if (firstChannel && updatedMessages[firstChannel]) {
        onMessageChange({
          text: updatedMessages[firstChannel].text,
          images: updatedMessages[firstChannel].images
        });
      }
    }
  }, [message.text, message.images, channels, onMessageChange]);

  // Update channels when the channels array changes
  useEffect(() => {
    const updatedMessages = { ...channelMessages };
    
    // Add new channels
    channels.forEach(channel => {
      if (!updatedMessages[channel]) {
        updatedMessages[channel] = {
          text: message.text,
          images: channel === "sms" ? [] : [...message.images],
          subject: channel === "email" ? "" : undefined
        };
      }
    });
    
    // Remove channels that are no longer selected
    Object.keys(updatedMessages).forEach(channel => {
      if (!channels.includes(channel)) {
        delete updatedMessages[channel];
      }
    });
    
    setChannelMessages(updatedMessages);
  }, [channels]);

  const handleChannelMessageChange = (channel: string, channelMessage: ChannelMessage) => {
    const updatedMessages = {
      ...channelMessages,
      [channel]: channelMessage
    };
    setChannelMessages(updatedMessages);

    // Update the main message state with the first channel's data for backwards compatibility
    const firstChannel = channels[0];
    if (firstChannel && updatedMessages[firstChannel]) {
      onMessageChange({
        text: updatedMessages[firstChannel].text,
        images: updatedMessages[firstChannel].images
      });
    }
  };

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Type className="h-5 w-5 text-primary" />
            Compose Your Messages
          </CardTitle>
          <p className="text-muted-foreground">
            Create compelling content for each channel. Each editor is optimized for its specific platform with AI-powered improvements.
          </p>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-8">
            {channels.map((channel) => (
              <ChannelEditor
                key={channel}
                channel={channel}
                message={channelMessages[channel] || { text: "", images: [] }}
                onMessageChange={(channelMessage) => handleChannelMessageChange(channel, channelMessage)}
              />
            ))}
            
            {channels.length === 0 && (
              <div className="text-center py-12 text-muted-foreground">
                <Type className="h-16 w-16 mx-auto mb-4 opacity-50" />
                <p className="text-lg font-medium mb-2">No Channels Selected</p>
                <p>Please select at least one channel to start composing your message</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
