import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Camera, Upload, Receipt, Users, Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface AddBillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const AddBillModal = ({ open, onOpenChange }: AddBillModalProps) => {
  const [step, setStep] = useState<'upload' | 'review' | 'assign'>('upload');
  const [billName, setBillName] = useState("");
  const [participants, setParticipants] = useState<string[]>(["Alex", "Sam", "Riley"]);
  const [newParticipant, setNewParticipant] = useState("");

  // Mock receipt data for demo
  const mockReceipt = {
    items: [
      { id: 1, name: "Cappuccino", price: 4.50, assignedTo: [] },
      { id: 2, name: "Avocado Toast", price: 12.00, assignedTo: [] },
      { id: 3, name: "Croissant", price: 3.50, assignedTo: [] },
      { id: 4, name: "Orange Juice", price: 5.00, assignedTo: [] }
    ],
    subtotal: 25.00,
    tax: 2.25,
    tip: 4.50,
    total: 31.75
  };

  const handleClose = () => {
    setStep('upload');
    setBillName("");
    onOpenChange(false);
  };

  const addParticipant = () => {
    if (newParticipant.trim() && !participants.includes(newParticipant.trim())) {
      setParticipants([...participants, newParticipant.trim()]);
      setNewParticipant("");
    }
  };

  const removeParticipant = (name: string) => {
    setParticipants(participants.filter(p => p !== name));
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md mx-auto max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Add New Bill
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 max-h-[60vh] overflow-y-auto">
          {step === 'upload' && (
            <>
              <div className="space-y-3">
                <Label htmlFor="billName">Bill Name (Optional)</Label>
                <Input
                  id="billName"
                  placeholder="e.g., Coffee at Blue Bottle"
                  value={billName}
                  onChange={(e) => setBillName(e.target.value)}
                />
              </div>

              <Card className="border-dashed border-2 border-border">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto w-12 h-12 bg-primary-soft rounded-full flex items-center justify-center">
                    <Camera className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium mb-1">Snap a photo of your receipt</h3>
                    <p className="text-sm text-muted-foreground">
                      We'll automatically extract items and prices
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Button 
                      className="w-full"
                      onClick={() => setStep('review')}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Take Photo
                    </Button>
                    <Button variant="outline" className="w-full">
                      <Upload className="h-4 w-4 mr-2" />
                      Upload from Gallery
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </>
          )}

          {step === 'review' && (
            <>
              <div className="bg-primary-soft/30 p-3 rounded-lg">
                <p className="text-sm text-primary">
                  📷 Great! We've scanned your receipt. Review the items below.
                </p>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Extracted Items</h3>
                {mockReceipt.items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center p-3 bg-card rounded-lg border">
                    <span className="text-sm">{item.name}</span>
                    <span className="font-medium">Rp {item.price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                ))}
                
                <div className="border-t pt-3 space-y-1">
                  <div className="flex justify-between text-sm">
                    <span>Subtotal</span>
                    <span>Rp {mockReceipt.subtotal.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tax</span>
                    <span>Rp {mockReceipt.tax.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Tip</span>
                    <span>Rp {mockReceipt.tip.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                  <div className="flex justify-between font-semibold border-t pt-1">
                    <span>Total</span>
                    <span>Rp {mockReceipt.total.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>
              </div>

              <Button 
                className="w-full"
                onClick={() => setStep('assign')}
              >
                <Users className="h-4 w-4 mr-2" />
                Assign Items to People
              </Button>
            </>
          )}

          {step === 'assign' && (
            <>
              <div className="space-y-3">
                <h3 className="font-medium">Add People</h3>
                <div className="flex gap-2">
                  <Input
                    placeholder="Add person..."
                    value={newParticipant}
                    onChange={(e) => setNewParticipant(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addParticipant()}
                  />
                  <Button onClick={addParticipant} size="sm">
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {participants.map((person) => (
                    <Badge key={person} variant="secondary" className="flex items-center gap-1">
                      {person}
                      <button 
                        onClick={() => removeParticipant(person)}
                        className="ml-1 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <h3 className="font-medium">Assign Items</h3>
                <p className="text-sm text-muted-foreground">
                  Tap items to assign them to people
                </p>
                {mockReceipt.items.map((item) => (
                  <Card key={item.id} className="cursor-pointer hover:shadow-card transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex justify-between items-center mb-2">
                        <span className="font-medium">{item.name}</span>
                        <span className="text-primary font-semibold">Rp {item.price.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                      </div>
                      <div className="flex flex-wrap gap-1">
                        {participants.map((person) => (
                          <Badge 
                            key={person} 
                            variant="outline" 
                            className="text-xs cursor-pointer hover:bg-primary-soft"
                          >
                            {person}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              <Button 
                className="w-full"
                onClick={handleClose}
              >
                Save Bill
              </Button>
            </>
          )}
        </div>

        {step !== 'upload' && (
          <Button 
            variant="outline" 
            onClick={() => setStep(step === 'assign' ? 'review' : 'upload')}
            className="mt-4"
          >
            Back
          </Button>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default AddBillModal;