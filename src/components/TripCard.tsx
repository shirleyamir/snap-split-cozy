import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Receipt } from "lucide-react";

interface Trip {
  id: string;
  name: string;
  date: string;
  totalAmount: number;
  billsCount: number;
  participants: string[];
  isActive: boolean;
}

interface TripCardProps {
  trip: Trip;
}

const TripCard = ({ trip }: TripCardProps) => {
  return (
    <Card className="shadow-card border-border/50 cursor-pointer hover:shadow-cozy transition-all duration-200">
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-medium text-foreground">{trip.name}</h3>
              {trip.isActive && (
                <Badge variant="secondary" className="text-xs px-2 py-0.5">
                  Active
                </Badge>
              )}
            </div>
            <div className="flex items-center text-sm text-muted-foreground gap-4">
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {trip.date}
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-foreground">
              Rp {trip.totalAmount.toLocaleString('id-ID', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3 text-muted-foreground">
            <div className="flex items-center gap-1">
              <Receipt className="h-3 w-3" />
              {trip.billsCount} bills
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-3 w-3" />
              {trip.participants.length} people
            </div>
          </div>
          
          <div className="flex -space-x-1">
            {trip.participants.slice(0, 3).map((participant, index) => (
              <div
                key={index}
                className="w-6 h-6 rounded-full bg-primary-soft border-2 border-card flex items-center justify-center text-xs font-medium text-primary"
              >
                {participant.charAt(0)}
              </div>
            ))}
            {trip.participants.length > 3 && (
              <div className="w-6 h-6 rounded-full bg-muted border-2 border-card flex items-center justify-center text-xs font-medium text-muted-foreground">
                +{trip.participants.length - 3}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default TripCard;