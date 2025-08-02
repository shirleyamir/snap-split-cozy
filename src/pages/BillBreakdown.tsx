import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowLeft, Users, ChevronRight } from "lucide-react";

interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
}

interface AnalyzedReceipt {
  items: ReceiptItem[];
  subtotal: number;
  total: number;
  tax?: number;
  serviceCharge?: number;
  discount?: number;
  tip?: number;
}

const mockUsers = [
  { id: "1", name: "Alex", color: "bg-primary" },
  { id: "2", name: "Sam", color: "bg-secondary" },
  { id: "3", name: "Riley", color: "bg-accent" },
];

const BillBreakdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const receiptData = location.state?.receiptData as AnalyzedReceipt;
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  if (!receiptData) {
    navigate("/camera");
    return null;
  }

  const handleUserToggle = (userId: string) => {
    setSelectedUsers(prev => 
      prev.includes(userId) 
        ? prev.filter(id => id !== userId)
        : [...prev, userId]
    );
  };

  const handleContinue = () => {
    if (selectedUsers.length === 0) return;
    
    navigate("/camera/assign-items", {
      state: {
        receiptData,
        selectedUsers: selectedUsers.map(id => 
          mockUsers.find(user => user.id === id)
        ).filter(Boolean)
      }
    });
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/camera")}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground">Select Participants</h1>
              <p className="text-sm text-muted-foreground">Who participated in this meal?</p>
            </div>
            <div className="bg-primary-soft rounded-full p-2">
              <Users className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Receipt Summary */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bill Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span>${(receiptData.subtotal || receiptData.total).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
              {receiptData.tax && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tax</span>
                  <span>${receiptData.tax.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {receiptData.serviceCharge && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Service Charge</span>
                  <span>${receiptData.serviceCharge.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {receiptData.tip && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Tip</span>
                  <span>${receiptData.tip.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              {receiptData.discount && (
                <div className="flex justify-between text-muted-foreground">
                  <span>Discount</span>
                  <span>-${receiptData.discount.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                </div>
              )}
              <div className="flex justify-between font-semibold text-lg pt-2 border-t border-border/50">
                <span>Total</span>
                <span>${receiptData.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* User Selection */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Select Friends</CardTitle>
            <p className="text-sm text-muted-foreground">Choose who participated in this meal</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {mockUsers.map((user) => (
                <div 
                  key={user.id} 
                  className="flex items-center space-x-3 p-3 rounded-lg border border-border/50 bg-muted/20 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => handleUserToggle(user.id)}
                >
                  <Checkbox 
                    checked={selectedUsers.includes(user.id)}
                    onCheckedChange={() => handleUserToggle(user.id)}
                  />
                  <div className={`w-8 h-8 rounded-full ${user.color} flex items-center justify-center text-white text-sm font-medium`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="font-medium text-foreground flex-1">{user.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={selectedUsers.length === 0}
          className="w-full h-14 text-base font-medium"
          size="lg"
        >
          Continue to Assign Items ({selectedUsers.length} selected)
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default BillBreakdown;