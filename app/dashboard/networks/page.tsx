import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function NetworksPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Networks</h1>
        <p className="text-muted-foreground">Configure and monitor network settings</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Networks Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the networks management page.</p>
          <p className="mt-4">
            Notice how the sidebar highlights the Manage Networks menu item when you navigate here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

