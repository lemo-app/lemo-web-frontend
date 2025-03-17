import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function StudentsPage() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Manage Students</h1>
        <p className="text-muted-foreground">View and manage student information</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Students Page</CardTitle>
        </CardHeader>
        <CardContent>
          <p>This is a placeholder for the students management page.</p>
          <p className="mt-4">
            Notice how the sidebar highlights the Manage Students menu item when you navigate here.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

