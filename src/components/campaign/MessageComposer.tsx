import { useState } from "react";
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