import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowLeft, ShoppingCart, ChevronRight } from "lucide-react";

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

interface User {
  id: string;
  name: string;
  color: string;
}

const AssignItems = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { receiptData, selectedUsers } = location.state as {
    receiptData: AnalyzedReceipt;
    selectedUsers: User[];
  };

  const [itemAssignments, setItemAssignments] = useState<{[key: number]: string}>({});

  if (!receiptData || !selectedUsers) {
    navigate("/camera");
    return null;
  }

  const handleItemAssignment = (itemIndex: number, userId: string) => {
    setItemAssignments(prev => ({
      ...prev,
      [itemIndex]: userId
    }));
  };

  const handleContinue = () => {
    const allItemsAssigned = receiptData.items.every((_, index) => 
      itemAssignments[index]
    );

    if (!allItemsAssigned) return;

    navigate("/camera/final-breakdown", {
      state: {
        receiptData,
        selectedUsers,
        itemAssignments
      }
    });
  };

  const allItemsAssigned = receiptData.items.every((_, index) => 
    itemAssignments[index]
  );

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/camera/billbreakdown", { state: { receiptData } })}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground">Assign Items</h1>
              <p className="text-sm text-muted-foreground">Who ordered what?</p>
            </div>
            <div className="bg-primary-soft rounded-full p-2">
              <ShoppingCart className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Participants */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Participants ({selectedUsers.length})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {selectedUsers.map((user) => (
                <div key={user.id} className="flex items-center gap-2 bg-muted/30 rounded-full px-3 py-1">
                  <div className={`w-6 h-6 rounded-full ${user.color} flex items-center justify-center text-white text-xs font-medium`}>
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{user.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Item Assignment */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Assign Items</CardTitle>
            <p className="text-sm text-muted-foreground">Select who ordered each item</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {receiptData.items.map((item, index) => (
                <div key={index} className="flex items-center justify-between p-4 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex-1">
                    <div className="font-medium">{item.name}</div>
                    <div className="text-sm text-muted-foreground">
                      ${item.price.toFixed(2)}
                      {item.quantity && item.quantity > 1 && ` × ${item.quantity}`}
                    </div>
                  </div>
                  <div className="w-40">
                    <Select 
                      value={itemAssignments[index] || ""} 
                      onValueChange={(value) => handleItemAssignment(index, value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select person" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedUsers.map((user) => (
                          <SelectItem key={user.id} value={user.id}>
                            <div className="flex items-center gap-2">
                              <div className={`w-4 h-4 rounded-full ${user.color}`} />
                              {user.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Continue Button */}
        <Button 
          onClick={handleContinue}
          disabled={!allItemsAssigned}
          className="w-full h-14 text-base font-medium"
          size="lg"
        >
          {allItemsAssigned ? "Continue to Final Breakdown" : `Assign ${receiptData.items.length - Object.keys(itemAssignments).length} more items`}
          <ChevronRight className="h-5 w-5 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default AssignItems;