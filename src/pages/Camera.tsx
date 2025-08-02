import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera as CameraIcon, Upload, FileImage, Zap } from "lucide-react";

const Camera = () => {
  const [isScanning, setIsScanning] = useState(false);

  const handleScanReceipt = () => {
    setIsScanning(true);
    // Simulate scanning process
    setTimeout(() => {
      setIsScanning(false);
    }, 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-md mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-foreground">Add Bill</h1>
              <p className="text-sm text-muted-foreground">Scan or upload a receipt</p>
            </div>
            <div className="bg-primary-soft rounded-full p-2">
              <CameraIcon className="h-6 w-6 text-primary" />
            </div>
          </div>
        </div>
      </div>

      {/* Camera Interface */}
      <div className="max-w-md mx-auto px-4 py-6 space-y-6">
        
        {/* Camera Preview Area */}
        <Card className="shadow-card border-border/50 overflow-hidden">
          <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center border-2 border-dashed border-border relative">
            {isScanning ? (
              <div className="text-center space-y-3">
                <div className="animate-spin">
                  <Zap className="h-12 w-12 text-primary mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground">Scanning receipt...</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <CameraIcon className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Camera preview will appear here</p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleScanReceipt}
            disabled={isScanning}
            className="w-full h-14 text-base font-medium"
            size="lg"
          >
            <CameraIcon className="h-6 w-6 mr-2" />
            {isScanning ? "Scanning..." : "Take Photo"}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button variant="outline" className="h-12">
              <Upload className="h-5 w-5 mr-2" />
              Upload
            </Button>
            <Button variant="outline" className="h-12">
              <FileImage className="h-5 w-5 mr-2" />
              Gallery
            </Button>
          </div>
        </div>

        {/* Quick Tips */}
        <Card className="shadow-card border-border/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Tips</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="text-sm text-muted-foreground">
              • Ensure receipt is well-lit and flat
            </div>
            <div className="text-sm text-muted-foreground">
              • Include all items and totals in frame
            </div>
            <div className="text-sm text-muted-foreground">
              • You can edit items after scanning
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Camera;