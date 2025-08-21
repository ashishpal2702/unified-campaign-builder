import { useState } from "react";
import { Theme } from "@twilio-paste/core/theme";
import { CampaignBuilder } from "@/components/campaign/CampaignBuilder";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";

const Index = () => {
  const [activeCampaign, setActiveCampaign] = useState<string | null>(null);

  return (
    <Theme.Provider theme="default">
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar 
            activeCampaign={activeCampaign}
            onCampaignSelect={setActiveCampaign}
          />
          <main className="flex-1 p-6">
            <CampaignBuilder />
          </main>
        </div>
      </div>
    </Theme.Provider>
  );
};

export default Index;