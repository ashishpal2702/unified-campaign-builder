import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  BarChart3, 
  Users, 
  MessageSquare, 
  TrendingUp,
  Mail,
  Smartphone,
  ArrowLeft
} from "lucide-react";
import { useCampaigns } from "@/hooks/useCampaigns";

interface AnalyticsProps {
  onBack: () => void;
}

export const Analytics = ({ onBack }: AnalyticsProps) => {
  const { campaigns, loading } = useCampaigns();

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Button variant="ghost" onClick={onBack} className="p-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-2xl font-bold">Loading Analytics...</h1>
        </div>
      </div>
    );
  }

  const totalCampaigns = campaigns.length;
  const activeCampaigns = campaigns.filter(c => c.status === 'active').length;
  const completedCampaigns = campaigns.filter(c => c.status === 'completed').length;
  const draftCampaigns = campaigns.filter(c => c.status === 'draft').length;

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Button variant="ghost" onClick={onBack} className="p-2">
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-foreground flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            Campaign Analytics
          </h1>
          <p className="text-muted-foreground">Track your campaign performance and insights</p>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <MessageSquare className="h-4 w-4" />
              Total Campaigns
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{totalCampaigns}</div>
            <Badge variant="secondary" className="mt-2">
              All time
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <TrendingUp className="h-4 w-4" />
              Active
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{activeCampaigns}</div>
            <Badge className="mt-2 bg-success text-success-foreground">
              Running now
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <Users className="h-4 w-4" />
              Completed
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">{completedCampaigns}</div>
            <Badge variant="secondary" className="mt-2">
              Finished
            </Badge>
          </CardContent>
        </Card>

        <Card className="shadow-card">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2 text-muted-foreground">
              <Mail className="h-4 w-4" />
              Drafts
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-warning">{draftCampaigns}</div>
            <Badge className="mt-2 bg-warning text-warning-foreground">
              In progress
            </Badge>
          </CardContent>
        </Card>
      </div>

      {/* Recent Campaigns */}
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-primary" />
            Recent Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent>
          {campaigns.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>No campaigns created yet</p>
            </div>
          ) : (
            <div className="space-y-3">
              {campaigns.slice(0, 5).map((campaign) => (
                <div
                  key={campaign.id}
                  className="flex items-center justify-between p-3 border border-border rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
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
                          {channel === "sms" ? <Smartphone className="h-3 w-3" /> : 
                           channel === "email" ? <Mail className="h-3 w-3" /> : 
                           <MessageSquare className="h-3 w-3" />}
                        </div>
                      ))}
                    </div>
                    <div>
                      <p className="font-medium text-foreground">{campaign.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {new Date(campaign.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                  <Badge 
                    variant="secondary"
                    className={
                      campaign.status === "active" ? "bg-success text-success-foreground" :
                      campaign.status === "completed" ? "bg-muted" :
                      campaign.status === "draft" ? "bg-warning text-warning-foreground" :
                      "bg-primary text-primary-foreground"
                    }
                  >
                    {campaign.status}
                  </Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};