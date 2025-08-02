import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Camera as CameraIcon, Upload, FileImage, Zap, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface ReceiptItem {
  name: string;
  price: number;
  quantity?: number;
}

interface AnalyzedReceipt {
  items: ReceiptItem[];
  total: number;
  tax?: number;
  tip?: number;
}

const Camera = () => {
  const [isScanning, setIsScanning] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [analyzedReceipt, setAnalyzedReceipt] = useState<AnalyzedReceipt | null>(null);
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const analyzeReceipt = async (imageFile: File) => {
    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);
      
      const { data, error } = await supabase.functions.invoke('analyze-receipt', {
        body: formData
      });
      
      if (error) {
        throw error;
      }
      
      const result = data;
      setAnalyzedReceipt(result);
      toast({
        title: "Receipt analyzed!",
        description: `Found ${result.items.length} items`,
      });
    } catch (error) {
      console.error('Error analyzing receipt:', error);
      toast({
        title: "Analysis failed",
        description: "Please try again with a clearer image",
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  const handleImageCapture = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      setCapturedImage(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    analyzeReceipt(file);
  };

  const handleCameraClick = () => {
    cameraInputRef.current?.click();
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleImageCapture(file);
    }
  };

  const clearImage = () => {
    setCapturedImage(null);
    setAnalyzedReceipt(null);
  };

  return (
    <div className="min-h-screen bg-gradient-warm pb-20">
      {/* Header */}
      <div className="bg-card/80 backdrop-blur-sm border-b border-border/50 sticky top-0 z-10">
        <div className="max-w-4xl mx-auto px-4 py-4">
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
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="space-y-6">
        
        {/* Hidden file inputs */}
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={handleFileChange}
          className="hidden"
        />
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />

        {/* Camera Preview Area */}
        <Card className="shadow-card border-border/50 overflow-hidden">
          <div className="aspect-[4/3] bg-muted/30 flex items-center justify-center border-2 border-dashed border-border relative">
            {capturedImage ? (
              <div className="relative w-full h-full">
                <img 
                  src={capturedImage} 
                  alt="Captured receipt" 
                  className="w-full h-full object-cover"
                />
                <Button
                  onClick={clearImage}
                  size="sm"
                  variant="outline"
                  className="absolute top-2 right-2 h-8 w-8 p-0"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            ) : isScanning ? (
              <div className="text-center space-y-3">
                <div className="animate-spin">
                  <Zap className="h-12 w-12 text-primary mx-auto" />
                </div>
                <p className="text-sm text-muted-foreground">Analyzing receipt...</p>
              </div>
            ) : (
              <div className="text-center space-y-3">
                <CameraIcon className="h-16 w-16 text-muted-foreground mx-auto" />
                <p className="text-sm text-muted-foreground">Take a photo or upload an image</p>
              </div>
            )}
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="space-y-4">
          <Button 
            onClick={handleCameraClick}
            disabled={isScanning}
            className="w-full h-14 text-base font-medium"
            size="lg"
          >
            <CameraIcon className="h-6 w-6 mr-2" />
            {isScanning ? "Analyzing..." : "Take Photo"}
          </Button>

          <div className="grid grid-cols-2 gap-3">
            <Button 
              variant="outline" 
              className="h-12"
              onClick={handleUploadClick}
              disabled={isScanning}
            >
              <Upload className="h-5 w-5 mr-2" />
              Upload
            </Button>
            <Button 
              variant="outline" 
              className="h-12"
              onClick={handleCameraClick}
              disabled={isScanning}
            >
              <FileImage className="h-5 w-5 mr-2" />
              Gallery
            </Button>
          </div>
        </div>

        {/* Analysis Results */}
        {analyzedReceipt && (
          <Card className="shadow-card border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg">Receipt Analysis</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                {analyzedReceipt.items.map((item, index) => (
                  <div key={index} className="flex justify-between items-center py-2 border-b border-border/30 last:border-0">
                    <div>
                      <span className="font-medium">{item.name}</span>
                      {item.quantity && <span className="text-muted-foreground ml-2">x{item.quantity}</span>}
                    </div>
                    <span className="font-medium">${item.price.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="pt-2 border-t border-border/50">
                <div className="flex justify-between items-center font-semibold text-lg">
                  <span>Total:</span>
                  <span>${analyzedReceipt.total.toFixed(2)}</span>
                </div>
                {analyzedReceipt.tax && (
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Tax:</span>
                    <span>${analyzedReceipt.tax.toFixed(2)}</span>
                  </div>
                )}
              </div>
              <Button 
                className="w-full mt-4"
                onClick={() => {
                  toast({
                    title: "Bill ready to split!",
                    description: "Proceeding to split the bill among participants",
                  });
                  // TODO: Navigate to bill splitting page
                }}
              >
                Continue to Split Bill
              </Button>
            </CardContent>
          </Card>
        )}

          </div>

          {/* Right column - Tips and Results */}
          <div className="space-y-6">
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
      </div>
    </div>
  );
};

export default Camera;