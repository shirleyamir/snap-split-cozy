import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, DollarSign, Receipt } from "lucide-react";

const mockBills = [
  {
    id: "1",
    name: "Café Central - Brunch",
    date: "Dec 16, 2024",
    amount: 45.80,
    participants: ["Alex", "Sam"],
    items: 6
  },
  {
    id: "2", 
    name: "Corner Store - Snacks",
    date: "Dec 15, 2024",
    amount: 23.40,
    participants: ["Alex", "Sam", "Riley"],
    items: 4
  }
];

const Trips = () => {
  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Your Trips</h1>
              <p className="text-sm text-muted-foreground">Manage your group expenses</p>
            </div>
            <div className="bg-primary-soft rounded-full p-2">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Active Trip */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Weekend Café Hopping</h2>
            <Badge variant="secondary" className="text-xs">Active</Badge>
          </div>
          
          <div className="space-y-3">
            {mockBills.map((bill) => (
              <Card key={bill.id} className="shadow-card border-border/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground mb-1">{bill.name}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {bill.date}
                        </div>
                        <div className="flex items-center gap-1">
                          <Receipt className="h-3 w-3" />
                          {bill.items} items
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-muted-foreground">Split between:</span>
                        <div className="flex gap-1">
                          {bill.participants.map((person, idx) => (
                            <Badge key={idx} variant="outline" className="text-xs">
                              {person}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-semibold text-primary">${bill.amount}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Trip Summary */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Trip Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <div className="text-2xl font-semibold text-primary">$69.20</div>
                <div className="text-xs text-muted-foreground">Total Spent</div>
              </div>
              <div>
                <div className="text-2xl font-semibold text-primary">2</div>
                <div className="text-xs text-muted-foreground">Bills Added</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Trips;