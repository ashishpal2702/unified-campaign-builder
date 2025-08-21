import { useState } from "react";
import { Theme } from "@twilio-paste/core/theme";
import { CampaignBuilder } from "@/components/campaign/CampaignBuilder";
import { Header } from "@/components/layout/Header";
import { Sidebar } from "@/components/layout/Sidebar";
import { Analytics } from "@/pages/Analytics";
import { ManageContacts } from "@/pages/ManageContacts";

const Index = () => {
  const [activeCampaign, setActiveCampaign] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'campaigns' | 'analytics' | 'contacts'>('campaigns');

  return (
    <Theme.Provider theme="default">
      <div className="min-h-screen bg-background">
        <Header />
        <div className="flex">
          <Sidebar 
            activeCampaign={activeCampaign}
            onCampaignSelect={setActiveCampaign}
            onAnalyticsClick={() => setCurrentView('analytics')}
            onManageContactsClick={() => setCurrentView('contacts')}
          />
          <main className="flex-1 p-6">
            {currentView === 'campaigns' && <CampaignBuilder />}
            {currentView === 'analytics' && (
              <Analytics onBack={() => setCurrentView('campaigns')} />
            )}
            {currentView === 'contacts' && (
              <ManageContacts onBack={() => setCurrentView('campaigns')} />
            )}
          </main>
        </div>
      </div>
    </Theme.Provider>
  );
};

export default Index;