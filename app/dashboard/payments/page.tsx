import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function PaymentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Payments</h1>
        <p className="text-muted-foreground">Manage payment information and transactions</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payments Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the payments management page.</p>
          <p className="mt-4">Notice how the sidebar highlights the Payments menu item when you navigate here.</p>
        </CardContent>
      </Card>
    </div>
  )
}

