import { AlertCircle, Clock, ShieldAlert, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"

type StatCardProps = {
  title: string
  value: string
  icon: "users" | "clock" | "shield" | "alert-circle"
  color: "amber" | "blue" | "teal" | "rose"
}

export function StatCard({ title, value, icon, color }: StatCardProps) {
  const getIcon = () => {
    switch (icon) {
      case "users":
        return <Users className="h-5 w-5 text-white" />
      case "clock":
        return <Clock className="h-5 w-5 text-white" />
      case "shield":
        return <ShieldAlert className="h-5 w-5 text-white" />
      case "alert-circle":
        return <AlertCircle className="h-5 w-5 text-white" />
    }
  }

  const getColorClass = () => {
    switch (color) {
      case "amber":
        return "bg-amber-400"
      case "blue":
        return "bg-blue-400"
      case "teal":
        return "bg-teal-400"
      case "rose":
        return "bg-rose-400"
    }
  }

  return (
    <Card>
      <CardContent className="flex items-center justify-between p-6">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-bold">{value}</p>
        </div>
        <div className={`flex h-12 w-12 items-center justify-center rounded-full ${getColorClass()}`}>{getIcon()}</div>
      </CardContent>
    </Card>
  )
}

