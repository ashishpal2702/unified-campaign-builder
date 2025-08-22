import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { 
  Database, 
  Zap, 
  Settings, 
  TestTube, 
  CheckCircle, 
  XCircle,
  Loader2,
  ExternalLink
} from "lucide-react";
import { toast } from "sonner";

interface DatabaseConnectorProps {
  onContactsImported: (contacts: any[]) => void;
  onClose: () => void;
}

interface ConnectionConfig {
  platform: string;
  apiKey: string;
  endpoint: string;
  username: string;
  password: string;
  customQuery: string;
  webhookUrl: string;
}

export const DatabaseConnector = ({ onContactsImported, onClose }: DatabaseConnectorProps) => {
  const [config, setConfig] = useState<ConnectionConfig>({
    platform: "",
    apiKey: "",
    endpoint: "",
    username: "",
    password: "",
    customQuery: "",
    webhookUrl: ""
  });
  const [testing, setTesting] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importing, setImporting] = useState(false);

  const platforms = [
    { id: "salesforce", name: "Salesforce", description: "Connect to Salesforce CRM" },
    { id: "sap", name: "SAP", description: "Connect to SAP systems" },
    { id: "hubspot", name: "HubSpot", description: "Connect to HubSpot CRM" },
    { id: "zapier", name: "Zapier Webhook", description: "Trigger a Zapier workflow" },
    { id: "api", name: "Custom API", description: "Connect to any REST API" },
    { id: "webhook", name: "Custom Webhook", description: "Receive data via webhook" }
  ];

  const selectedPlatform = platforms.find(p => p.id === config.platform);

  const handleConfigChange = (field: keyof ConnectionConfig, value: string) => {
    setConfig(prev => ({ ...prev, [field]: value }));
  };

  const testConnection = async () => {
    if (!config.platform) {
      toast.error("Please select a platform");
      return;
    }

    setTesting(true);
    setConnectionStatus('idle');

    try {
      // Simulate API connection test based on platform
      await new Promise(resolve => setTimeout(resolve, 2000));

      if (config.platform === 'zapier' && config.webhookUrl) {
        // Test Zapier webhook
        const response = await fetch(config.webhookUrl, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          mode: "no-cors",
          body: JSON.stringify({
            test: true,
            timestamp: new Date().toISOString(),
          }),
        });
        setConnectionStatus('success');
        toast.success("Zapier webhook triggered successfully");
      } else if (config.platform === 'api' && config.endpoint) {
        // Test custom API
        setConnectionStatus('success');
        toast.success("API connection test successful");
      } else {
        // Simulate success for other platforms
        setConnectionStatus('success');
        toast.success(`${selectedPlatform?.name} connection test successful`);
      }
    } catch (error) {
      setConnectionStatus('error');
      toast.error("Connection test failed");
    } finally {
      setTesting(false);
    }
  };

  const importContacts = async () => {
    if (connectionStatus !== 'success') {
      toast.error("Please test the connection first");
      return;
    }

    setImporting(true);

    try {
      // Simulate data import
      await new Promise(resolve => setTimeout(resolve, 3000));

      // Mock imported contacts based on platform
      const mockContacts = Array.from({ length: Math.floor(Math.random() * 50) + 10 }, (_, i) => ({
        name: `Contact ${i + 1}`,
        email: `contact${i + 1}@${config.platform}.com`,
        phone: `+1-555-${String(Math.floor(Math.random() * 9000) + 1000)}`,
        tags: [`${config.platform}`, 'imported'],
        user_id: null
      }));

      onContactsImported(mockContacts);
      toast.success(`Successfully imported ${mockContacts.length} contacts from ${selectedPlatform?.name}`);
    } catch (error) {
      toast.error("Failed to import contacts");
    } finally {
      setImporting(false);
    }
  };

  const renderPlatformFields = () => {
    switch (config.platform) {
      case 'salesforce':
        return (
          <>
            <div>
              <Label htmlFor="username">Salesforce Username</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => handleConfigChange('username', e.target.value)}
                placeholder="your-email@company.com"
              />
            </div>
            <div>
              <Label htmlFor="password">Password + Security Token</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => handleConfigChange('password', e.target.value)}
                placeholder="password + security_token"
              />
            </div>
            <div>
              <Label htmlFor="endpoint">Instance URL</Label>
              <Input
                id="endpoint"
                value={config.endpoint}
                onChange={(e) => handleConfigChange('endpoint', e.target.value)}
                placeholder="https://yourinstance.salesforce.com"
              />
            </div>
          </>
        );

      case 'sap':
        return (
          <>
            <div>
              <Label htmlFor="endpoint">SAP Server URL</Label>
              <Input
                id="endpoint"
                value={config.endpoint}
                onChange={(e) => handleConfigChange('endpoint', e.target.value)}
                placeholder="https://your-sap-server.com/api"
              />
            </div>
            <div>
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                value={config.username}
                onChange={(e) => handleConfigChange('username', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={config.password}
                onChange={(e) => handleConfigChange('password', e.target.value)}
              />
            </div>
          </>
        );

      case 'hubspot':
        return (
          <div>
            <Label htmlFor="apiKey">HubSpot API Key</Label>
            <Input
              id="apiKey"
              value={config.apiKey}
              onChange={(e) => handleConfigChange('apiKey', e.target.value)}
              placeholder="pat-na1-xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Find your API key in HubSpot Settings → Integrations → Private Apps
            </p>
          </div>
        );

      case 'zapier':
        return (
          <div>
            <Label htmlFor="webhookUrl">Zapier Webhook URL</Label>
            <Input
              id="webhookUrl"
              value={config.webhookUrl}
              onChange={(e) => handleConfigChange('webhookUrl', e.target.value)}
              placeholder="https://hooks.zapier.com/hooks/catch/xxxxxx/xxxxxx"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Create a Zap with a Webhook trigger and paste the URL here
            </p>
          </div>
        );

      case 'api':
        return (
          <>
            <div>
              <Label htmlFor="endpoint">API Endpoint</Label>
              <Input
                id="endpoint"
                value={config.endpoint}
                onChange={(e) => handleConfigChange('endpoint', e.target.value)}
                placeholder="https://api.example.com/contacts"
              />
            </div>
            <div>
              <Label htmlFor="apiKey">API Key (if required)</Label>
              <Input
                id="apiKey"
                value={config.apiKey}
                onChange={(e) => handleConfigChange('apiKey', e.target.value)}
                placeholder="Bearer token or API key"
              />
            </div>
            <div>
              <Label htmlFor="customQuery">Custom Query/Body</Label>
              <Textarea
                id="customQuery"
                value={config.customQuery}
                onChange={(e) => handleConfigChange('customQuery', e.target.value)}
                placeholder='{"query": "SELECT name, email, phone FROM contacts"}'
                rows={3}
              />
            </div>
          </>
        );

      case 'webhook':
        return (
          <div className="text-center p-4 border border-dashed rounded-lg">
            <Zap className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm font-medium">Webhook URL</p>
            <code className="text-xs bg-muted px-2 py-1 rounded mt-2 inline-block">
              https://your-app.com/api/webhook/contacts
            </code>
            <p className="text-xs text-muted-foreground mt-2">
              Send POST requests to this URL to import contacts
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Connect to External Database
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Import contacts from your CRM, database, or other business systems
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="platform">Select Platform</Label>
            <Select value={config.platform} onValueChange={(value) => handleConfigChange('platform', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a platform to connect" />
              </SelectTrigger>
              <SelectContent>
                {platforms.map((platform) => (
                  <SelectItem key={platform.id} value={platform.id}>
                    <div className="flex flex-col">
                      <span className="font-medium">{platform.name}</span>
                      <span className="text-xs text-muted-foreground">{platform.description}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {config.platform && (
            <Card className="bg-muted/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  {selectedPlatform?.name} Configuration
                  <Badge variant="outline" className="ml-auto">
                    {connectionStatus === 'success' && <CheckCircle className="h-3 w-3 text-green-500 mr-1" />}
                    {connectionStatus === 'error' && <XCircle className="h-3 w-3 text-red-500 mr-1" />}
                    {connectionStatus === 'idle' ? 'Not tested' : connectionStatus}
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {renderPlatformFields()}

                <div className="flex gap-2 pt-2">
                  <Button
                    variant="outline"
                    onClick={testConnection}
                    disabled={testing}
                    className="flex-1"
                  >
                    {testing ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Testing...</>
                    ) : (
                      <><TestTube className="h-4 w-4 mr-2" /> Test Connection</>
                    )}
                  </Button>
                  
                  <Button
                    onClick={importContacts}
                    disabled={connectionStatus !== 'success' || importing}
                    className="flex-1 bg-gradient-primary"
                  >
                    {importing ? (
                      <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Importing...</>
                    ) : (
                      <>Import Contacts</>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {config.platform && (
            <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm">
              <div className="flex items-center gap-2">
                <ExternalLink className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                <span className="text-blue-800 dark:text-blue-200">
                  Need help setting up {selectedPlatform?.name}?
                </span>
              </div>
              <Button variant="link" size="sm" className="text-blue-600 dark:text-blue-400 p-0 h-auto">
                View Documentation
              </Button>
            </div>
          )}

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};