import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus, Camera, Users, Receipt, DollarSign } from "lucide-react";
import AddBillModal from "@/components/AddBillModal";
import TripCard from "@/components/TripCard";

// Mock data for demonstration
const mockTrips = [
  {
    id: "1",
    name: "Weekend Café Hopping",
    date: "Dec 15-16, 2024",
    totalAmount: 142.50,
    billsCount: 4,
    participants: ["Alex", "Sam", "Riley"],
    isActive: true
  },
  {
    id: "2", 
    name: "Beach House Trip",
    date: "Nov 20-25, 2024",
    totalAmount: 847.20,
    billsCount: 12,
    participants: ["Alex", "Sam", "Riley", "Jordan", "Casey"],
    isActive: false
  }
];

const Index = () => {
  const [showAddBill, setShowAddBill] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-warm">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">SplitSnap</h1>
              <p className="text-sm text-muted-foreground">Split bills with friends</p>
            </div>
            <div className="bg-primary-soft rounded-full p-2">
              <Receipt className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Quick Actions */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Actions</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button 
              onClick={() => setShowAddBill(true)}
              className="w-full h-12 text-base font-medium"
              size="lg"
            >
              <Camera className="h-5 w-5 mr-2" />
              Add New Bill
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button variant="outline" className="h-10">
                <Users className="h-4 w-4 mr-2" />
                New Trip
              </Button>
              <Button variant="outline" className="h-10">
                <DollarSign className="h-4 w-4 mr-2" />
                Summary
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Active/Recent Trips */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Your Trips</h2>
            <Button variant="ghost" size="sm">
              <Plus className="h-4 w-4 mr-1" />
              New
            </Button>
          </div>
          
          <div className="space-y-3">
            {mockTrips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </div>
        </div>

      </div>

      {/* Add Bill Modal */}
      <AddBillModal 
        open={showAddBill} 
        onOpenChange={setShowAddBill}
      />
    </div>
  );
};

export default Index;