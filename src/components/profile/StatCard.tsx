import { Card, CardContent } from "../ui/card";

const StatCard = ({
    icon,
    title,
    value
}: {
    icon: React.ReactNode,
    title: string,
    value: number
}) => (
    <Card>
        <CardContent className="p-6">
            <div className="flex items-center gap-4">
                {icon}
                <div>
                    <p className="text-sm text-muted-foreground">{title}</p>
                    <p className="text-2xl font-bold">{value}</p>
                </div>
            </div>
        </CardContent>
    </Card>
);
export default StatCard;