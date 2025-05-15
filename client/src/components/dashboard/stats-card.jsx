import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils"

export default function StatsCard({ title, value, description, color, itemIcon }) {
  return (
    <Card className="w-full bg-white shadow-md">
      <CardHeader className={`flex items-center justify-between`}>
        <CardTitle className={cn("text-xl", title === "Overdue Tasks" && "text-red-500")}>{title}</CardTitle>
        {itemIcon}
      </CardHeader>
      <CardContent className="flex flex-col px-6 gap-2">
        <h3 className={`text-${color}-500 text-4xl font-bold`}>{value}</h3>
        <p className={`text-muted-foreground text-xs`}>{description}</p>
      </CardContent>
    </Card>
  );
}