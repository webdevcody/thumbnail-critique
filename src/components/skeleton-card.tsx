import { Card, CardContent, CardFooter, CardHeader } from "./ui/card";

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-32 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      </CardContent>
    </Card>
  );
}
