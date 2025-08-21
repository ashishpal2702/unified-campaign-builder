import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Bell, Settings, User } from "lucide-react";

export const Header = () => {
  return (
    <header className="h-16 border-b border-border bg-card px-6 flex items-center justify-between shadow-card">
      <div className="flex items-center space-x-4">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">C</span>
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">CampaignBuilder</h1>
            <p className="text-sm text-muted-foreground">Multi-channel marketing platform</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <Badge variant="secondary" className="bg-brand-green text-success-foreground">
          Pro Plan
        </Badge>
        
        <Button variant="ghost" size="sm">
          <Bell className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
        
        <Button variant="ghost" size="sm">
          <User className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};