import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Upload, FileSpreadsheet, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import Papa from "papaparse";
import * as XLSX from "xlsx";
import type { Database } from "@/integrations/supabase/types";

type ContactInsert = Database['public']['Tables']['contacts']['Insert'];

interface FileUploadProps {
  onContactsImported: (contacts: ContactInsert[]) => void;
  onClose: () => void;
}

interface ParsedContact {
  name: string;
  email?: string;
  phone?: string;
  tags?: string[];
  valid: boolean;
  errors: string[];
}

export const FileUpload = ({ onContactsImported, onClose }: FileUploadProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [parsing, setParsing] = useState(false);
  const [parsedContacts, setParsedContacts] = useState<ParsedContact[]>([]);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateContact = (contact: any): ParsedContact => {
    const errors: string[] = [];
    const parsed: ParsedContact = {
      name: "",
      email: undefined,
      phone: undefined,
      tags: [],
      valid: false,
      errors: []
    };

    // Validate name (required)
    if (!contact.name || typeof contact.name !== 'string' || contact.name.trim().length === 0) {
      errors.push("Name is required");
    } else {
      parsed.name = contact.name.trim();
    }

    // Validate email (optional but must be valid if provided)
    if (contact.email && contact.email.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (emailRegex.test(contact.email.trim())) {
        parsed.email = contact.email.trim();
      } else {
        errors.push("Invalid email format");
      }
    }

    // Validate phone (optional)
    if (contact.phone && contact.phone.trim()) {
      parsed.phone = contact.phone.trim();
    }

    // Handle tags
    if (contact.tags) {
      if (typeof contact.tags === 'string') {
        parsed.tags = contact.tags.split(',').map((tag: string) => tag.trim()).filter(Boolean);
      } else if (Array.isArray(contact.tags)) {
        parsed.tags = contact.tags.filter(Boolean);
      }
    }

    parsed.valid = errors.length === 0;
    parsed.errors = errors;

    return parsed;
  };

  const parseCSV = (file: File): Promise<ParsedContact[]> => {
    return new Promise((resolve, reject) => {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (results.errors.length > 0) {
            reject(new Error(`CSV parsing error: ${results.errors[0].message}`));
            return;
          }

          const contacts = results.data.map((row: any) => validateContact(row));
          resolve(contacts);
        },
        error: (error) => {
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      });
    });
  };

  const parseExcel = (file: File): Promise<ParsedContact[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: 'array' });
          const worksheet = workbook.Sheets[workbook.SheetNames[0]];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);

          const contacts = jsonData.map((row: any) => validateContact(row));
          resolve(contacts);
        } catch (error) {
          reject(new Error(`Failed to parse Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (!selectedFile) return;

    const allowedTypes = [
      'text/csv',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      toast.error("Please select a CSV or Excel file");
      return;
    }

    setFile(selectedFile);
    setParsedContacts([]);
  };

  const handleParseFile = async () => {
    if (!file) return;

    setParsing(true);
    setUploadProgress(10);

    try {
      let contacts: ParsedContact[] = [];

      setUploadProgress(30);

      if (file.type === 'text/csv') {
        contacts = await parseCSV(file);
      } else {
        contacts = await parseExcel(file);
      }

      setUploadProgress(70);
      setParsedContacts(contacts);
      setUploadProgress(100);

      const validCount = contacts.filter(c => c.valid).length;
      const invalidCount = contacts.length - validCount;

      toast.success(`Parsed ${contacts.length} contacts. ${validCount} valid, ${invalidCount} with errors.`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to parse file');
    } finally {
      setParsing(false);
    }
  };

  const handleImport = () => {
    const validContacts = parsedContacts
      .filter(contact => contact.valid)
      .map(contact => ({
        name: contact.name,
        email: contact.email || null,
        phone: contact.phone || null,
        tags: contact.tags || [],
        user_id: null // Will be set by RLS
      }));

    if (validContacts.length === 0) {
      toast.error("No valid contacts to import");
      return;
    }

    onContactsImported(validContacts);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Import Contacts from File
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Upload a CSV or Excel file with columns: name (required), email, phone, tags
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,.xlsx,.xls"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {!file ? (
              <div className="space-y-3">
                <div className="flex justify-center gap-2 text-muted-foreground">
                  <FileSpreadsheet className="h-8 w-8" />
                  <FileText className="h-8 w-8" />
                </div>
                <div>
                  <p className="text-sm font-medium">Choose a file to upload</p>
                  <p className="text-xs text-muted-foreground">CSV, XLS, or XLSX files supported</p>
                </div>
                <Button
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                >
                  Select File
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <div className="flex items-center justify-center gap-2">
                  <FileSpreadsheet className="h-5 w-5 text-primary" />
                  <span className="text-sm font-medium">{file.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button
                    onClick={handleParseFile}
                    disabled={parsing}
                    className="bg-gradient-primary"
                  >
                    {parsing ? "Parsing..." : "Parse File"}
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFile(null);
                      setParsedContacts([]);
                      setUploadProgress(0);
                    }}
                  >
                    Remove
                  </Button>
                </div>
              </div>
            )}
          </div>

          {parsing && (
            <div className="space-y-2">
              <Progress value={uploadProgress} className="w-full" />
              <p className="text-sm text-center text-muted-foreground">
                Processing file... {uploadProgress}%
              </p>
            </div>
          )}

          {parsedContacts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Preview ({parsedContacts.length} contacts)</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {parsedContacts.slice(0, 10).map((contact, index) => (
                    <div
                      key={index}
                      className={`p-2 rounded border ${
                        contact.valid 
                          ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-950' 
                          : 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950'
                      }`}
                    >
                      <div className="flex items-start gap-2">
                        {contact.valid ? (
                          <CheckCircle className="h-4 w-4 text-green-500 mt-0.5" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500 mt-0.5" />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{contact.name || 'No name'}</p>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            {contact.email && <span>📧 {contact.email}</span>}
                            {contact.phone && <span>📱 {contact.phone}</span>}
                            {contact.tags && contact.tags.length > 0 && (
                              <span>🏷️ {contact.tags.join(', ')}</span>
                            )}
                          </div>
                          {contact.errors.length > 0 && (
                            <p className="text-xs text-red-600 dark:text-red-400">
                              {contact.errors.join(', ')}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                  {parsedContacts.length > 10 && (
                    <p className="text-sm text-muted-foreground text-center">
                      ... and {parsedContacts.length - 10} more contacts
                    </p>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4 pt-4 border-t">
                  <div className="text-sm text-muted-foreground">
                    {parsedContacts.filter(c => c.valid).length} valid • {' '}
                    {parsedContacts.filter(c => !c.valid).length} with errors
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={onClose}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleImport}
                      disabled={parsedContacts.filter(c => c.valid).length === 0}
                      className="bg-gradient-primary"
                    >
                      Import {parsedContacts.filter(c => c.valid).length} Contacts
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </CardContent>
      </Card>
    </div>
  );
};