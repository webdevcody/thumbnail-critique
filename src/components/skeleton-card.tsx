import { Card, CardContent, CardHeader } from "./ui/card";

export function SkeletonCard() {
  return (
    <Card>
      <CardHeader>
        <div className="h-32 md:h-40 lg:h-52 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
        <div className="h-8 bg-gray-200 rounded dark:bg-gray-700 mb-2.5"></div>
      </CardContent>
    </Card>
  );
}
