import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "./ui/card";

interface MetricCardProps {
  title: string;
  value: number | undefined;
  previousValue?: number | undefined; // 👈 nuevo
}

const MetricCard = ({ title, value, previousValue }: MetricCardProps) => {
  let percentageChange: number | null = null;
  let isPositive = false;

  if (value !== undefined && previousValue !== undefined && previousValue !== 0) {
    percentageChange = ((value - previousValue) / previousValue) * 100;
    isPositive = percentageChange > 0;
  }

  return (
    <Card className="gap-2 w-[200px]">
      <CardHeader>
        <CardTitle className="font-light">{title}</CardTitle>
      </CardHeader>
      <CardContent className="text-2xl font-bold">
        <p>{value}</p>
      </CardContent>
      <CardFooter>
        {percentageChange !== null ? (
          <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? "+" : ""}
            {percentageChange.toFixed(1)}%
          </span>
        ) : (
          <span className="text-gray-400">N/A</span>
        )}
      </CardFooter>
    </Card>
  );
};

export default MetricCard;
