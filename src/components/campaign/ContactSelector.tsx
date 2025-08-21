import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Users, Upload, Filter, UserCheck } from "lucide-react";

interface ContactSelectorProps {
  selectedContacts: string[];
  onContactsChange: (contacts: string[]) => void;
}

// Mock contact data
const mockContacts = [
  { id: "1", name: "John Doe", email: "john@example.com", phone: "+1234567890", tags: ["VIP", "Premium"], lastActive: "2024-01-15" },
  { id: "2", name: "Jane Smith", email: "jane@example.com", phone: "+1234567891", tags: ["New"], lastActive: "2024-01-14" },
  { id: "3", name: "Mike Johnson", email: "mike@example.com", phone: "+1234567892", tags: ["Regular"], lastActive: "2024-01-13" },
  { id: "4", name: "Sarah Wilson", email: "sarah@example.com", phone: "+1234567893", tags: ["VIP"], lastActive: "2024-01-12" },
  { id: "5", name: "David Brown", email: "david@example.com", phone: "+1234567894", tags: ["Premium"], lastActive: "2024-01-11" }
];

const mockSegments = [
  { id: "vip", name: "VIP Customers", count: 450, description: "High-value customers with premium status" },
  { id: "new", name: "New Subscribers", count: 1200, description: "Recently subscribed users" },
  { id: "inactive", name: "Inactive Users", count: 800, description: "Users who haven't engaged recently" },
  { id: "premium", name: "Premium Members", count: 650, description: "Users with premium subscriptions" }
];

export const ContactSelector = ({ selectedContacts, onContactsChange }: ContactSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSegments, setSelectedSegments] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState("individual");

  const filteredContacts = mockContacts.filter(contact =>
    contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contact.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const toggleContact = (contactId: string) => {
    if (selectedContacts.includes(contactId)) {
      onContactsChange(selectedContacts.filter(id => id !== contactId));
    } else {
      onContactsChange([...selectedContacts, contactId]);
    }
  };

  const toggleSegment = (segmentId: string) => {
    if (selectedSegments.includes(segmentId)) {
      setSelectedSegments(selectedSegments.filter(id => id !== segmentId));
    } else {
      setSelectedSegments([...selectedSegments, segmentId]);
    }
  };

  const selectAll = () => {
    onContactsChange(filteredContacts.map(contact => contact.id));
  };

  const clearAll = () => {
    onContactsChange([]);
  };

  const totalSelectedFromSegments = selectedSegments.reduce((total, segmentId) => {
    const segment = mockSegments.find(s => s.id === segmentId);
    return total + (segment?.count || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="text-xl flex items-center gap-2">
            <Users className="h-5 w-5 text-brand-blue" />
            Select Your Audience
          </CardTitle>
          <p className="text-muted-foreground">
            Choose individual contacts or segments to target with your campaign.
          </p>
        </CardHeader>
        
        <CardContent>
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="individual" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Individual Contacts
              </TabsTrigger>
              <TabsTrigger value="segments" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                Segments
              </TabsTrigger>
            </TabsList>

            <TabsContent value="individual" className="space-y-4">
              {/* Search and Actions */}
              <div className="flex items-center gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search contacts..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filter
                </Button>
                <Button variant="outline" size="sm">
                  <Upload className="h-4 w-4 mr-2" />
                  Import
                </Button>
              </div>

              {/* Bulk Actions */}
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-4">
                  <Button variant="ghost" size="sm" onClick={selectAll}>
                    Select All ({filteredContacts.length})
                  </Button>
                  <Button variant="ghost" size="sm" onClick={clearAll}>
                    Clear Selection
                  </Button>
                </div>
                <Badge variant="secondary">
                  {selectedContacts.length} selected
                </Badge>
              </div>

              {/* Contacts List */}
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {filteredContacts.map((contact) => (
                  <Card
                    key={contact.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedContacts.includes(contact.id)
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleContact(contact.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-center gap-4">
                        <Checkbox
                          checked={selectedContacts.includes(contact.id)}
                          onChange={() => toggleContact(contact.id)}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium">{contact.name}</h4>
                            {contact.tags.map(tag => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">{contact.email}</p>
                          <p className="text-sm text-muted-foreground">{contact.phone}</p>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-xs text-muted-foreground">Last active</p>
                          <p className="text-xs">{contact.lastActive}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="segments" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {mockSegments.map((segment) => (
                  <Card
                    key={segment.id}
                    className={`cursor-pointer transition-all duration-300 ${
                      selectedSegments.includes(segment.id)
                        ? "border-primary bg-primary/5 shadow-glow"
                        : "border-border hover:border-primary/50"
                    }`}
                    onClick={() => toggleSegment(segment.id)}
                  >
                    <CardContent className="p-4">
                      <div className="flex items-start gap-4">
                        <Checkbox
                          checked={selectedSegments.includes(segment.id)}
                          onChange={() => toggleSegment(segment.id)}
                        />
                        
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <h4 className="font-medium">{segment.name}</h4>
                            <Badge variant="secondary" className="bg-brand-blue text-primary-foreground">
                              {segment.count.toLocaleString()}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{segment.description}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {selectedSegments.length > 0 && (
                <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
                  <div className="flex items-center gap-2 mb-2">
                    <UserCheck className="h-4 w-4 text-primary" />
                    <h4 className="font-medium text-primary">Selected Segments</h4>
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">
                    Total reach: <span className="font-medium">{totalSelectedFromSegments.toLocaleString()}</span> contacts
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {selectedSegments.map(segmentId => {
                      const segment = mockSegments.find(s => s.id === segmentId);
                      return (
                        <Badge key={segmentId} variant="secondary" className="bg-primary text-primary-foreground">
                          {segment?.name} ({segment?.count.toLocaleString()})
                        </Badge>
                      );
                    })}
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};