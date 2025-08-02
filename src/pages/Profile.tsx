import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Settings, DollarSign, Palette, Info, Download } from "lucide-react";

const Profile = () => {
  const [currency, setCurrency] = useState("USD");

  const currencies = [
    { value: "USD", label: "US Dollar ($)" },
    { value: "EUR", label: "Euro (€)" },
    { value: "GBP", label: "British Pound (£)" },
    { value: "CAD", label: "Canadian Dollar (C$)" },
    { value: "AUD", label: "Australian Dollar (A$)" },
  ];

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Settings</h1>
              <p className="text-sm text-muted-foreground">Customize your experience</p>
            </div>
            <div className="bg-primary-soft rounded-full p-2">
              <Settings className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Currency Settings */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Currency
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">Default Currency</label>
              <Select value={currency} onValueChange={setCurrency}>
                <SelectTrigger>
                  <SelectValue placeholder="Select currency" />
                </SelectTrigger>
                <SelectContent>
                  {currencies.map((curr) => (
                    <SelectItem key={curr.value} value={curr.value}>
                      {curr.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <p className="text-xs text-muted-foreground">
              This will be used for all new bills and calculations
            </p>
          </CardContent>
        </Card>

        {/* App Preferences */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Palette className="h-4 w-4 mr-2" />
              Theme Settings
              <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Notification Settings
              <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
            </Button>
          </CardContent>
        </Card>

        {/* Data Management */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Download className="h-5 w-5" />
              Data
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start">
              <Download className="h-4 w-4 mr-2" />
              Export Data
              <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-2" />
              Backup Settings
              <span className="ml-auto text-xs text-muted-foreground">Coming Soon</span>
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <Info className="h-5 w-5" />
              About
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="text-center space-y-2">
              <h3 className="font-semibold text-foreground">SplitSnap</h3>
              <p className="text-sm text-muted-foreground">Version 1.0.0</p>
              <p className="text-xs text-muted-foreground">
                Split bills effortlessly with friends
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Profile;