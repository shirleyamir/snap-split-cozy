import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, Receipt, Share } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

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

const FinalBreakdown = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const { receiptData, selectedUsers, itemAssignments } = location.state as {
    receiptData: AnalyzedReceipt;
    selectedUsers: User[];
    itemAssignments: {[key: number]: string};
  };

  if (!receiptData || !selectedUsers || !itemAssignments) {
    navigate("/camera");
    return null;
  }

  // Calculate each user's breakdown
  const userBreakdowns = selectedUsers.map(user => {
    const userItems = receiptData.items
      .map((item, index) => ({ item, index }))
      .filter(({ index }) => itemAssignments[index] === user.id)
      .map(({ item }) => item);

    const userSubtotal = userItems.reduce((sum, item) => sum + item.price, 0);
    const userTaxShare = (receiptData.tax || 0) * (userSubtotal / (receiptData.subtotal || receiptData.total));
    const userServiceShare = (receiptData.serviceCharge || 0) * (userSubtotal / (receiptData.subtotal || receiptData.total));
    const userDiscountShare = (receiptData.discount || 0) * (userSubtotal / (receiptData.subtotal || receiptData.total));
    
    const userTotal = userSubtotal + userTaxShare + userServiceShare - userDiscountShare;

    return {
      user,
      items: userItems,
      subtotal: userSubtotal,
      taxShare: userTaxShare,
      serviceShare: userServiceShare,
      discountShare: userDiscountShare,
      total: userTotal
    };
  });

  const handleShare = () => {
    const breakdown = userBreakdowns.map(ub => 
      `${ub.user.name}: Rp ${ub.total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n` +
      ub.items.map(item => `  • ${item.name}: Rp ${item.price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`).join('\n')
    ).join('\n\n');

    const shareText = `Bill Split Breakdown:\n\n${breakdown}\n\nTotal: Rp ${receiptData.total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

    if (navigator.share) {
      navigator.share({
        title: 'Bill Split Breakdown',
        text: shareText
      });
    } else {
      navigator.clipboard.writeText(shareText);
      toast({
        title: "Copied to clipboard!",
        description: "Bill breakdown has been copied to your clipboard",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button 
              variant="ghost" 
              onClick={() => navigate("/camera/assign-items", { 
                state: { receiptData, selectedUsers } 
              })}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="text-center">
              <h1 className="text-2xl font-semibold text-foreground">Final Breakdown</h1>
              <p className="text-sm text-muted-foreground">Everyone's share</p>
            </div>
            <div className="bg-primary-soft rounded-full p-2">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">
        {/* Total Summary */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Bill Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary">Rp {receiptData.total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
              <div className="text-sm text-muted-foreground">Total Bill</div>
            </div>
          </CardContent>
        </Card>

        {/* Individual Breakdowns */}
        {userBreakdowns.map((breakdown) => (
          <Card key={breakdown.user.id} className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-3">
                <div className={`w-8 h-8 rounded-full ${breakdown.user.color} flex items-center justify-center text-white text-sm font-medium`}>
                  {breakdown.user.name.charAt(0).toUpperCase()}
                </div>
                {breakdown.user.name}
                <span className="ml-auto text-xl font-bold text-primary">
                  Rp {breakdown.total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {/* Items */}
                <div>
                  <h4 className="font-medium text-sm text-muted-foreground mb-2">Items:</h4>
                  <div className="space-y-1">
                    {breakdown.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.name}</span>
                        <span>Rp {item.price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Breakdown */}
                <div className="pt-2 border-t border-border/30 space-y-1 text-sm">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>${breakdown.subtotal.toFixed(2)}</span>
                  </div>
                  {breakdown.taxShare > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Tax share:</span>
                      <span>${breakdown.taxShare.toFixed(2)}</span>
                    </div>
                  )}
                  {breakdown.serviceShare > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Service charge share:</span>
                      <span>${breakdown.serviceShare.toFixed(2)}</span>
                    </div>
                  )}
                  {breakdown.discountShare > 0 && (
                    <div className="flex justify-between text-muted-foreground">
                      <span>Discount share:</span>
                      <span>-${breakdown.discountShare.toFixed(2)}</span>
                    </div>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={handleShare}
            className="w-full h-14 text-base font-medium"
            size="lg"
          >
            <Share className="h-5 w-5 mr-2" />
            Share Breakdown
          </Button>
          
          <Button 
            variant="outline"
            onClick={() => navigate("/camera")}
            className="w-full h-12 text-base"
          >
            Split Another Bill
          </Button>
        </div>
      </div>
    </div>
  );
};

export default FinalBreakdown;