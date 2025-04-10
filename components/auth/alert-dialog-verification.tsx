import { AlertCircle } from "lucide-react"
import { AlertDialog } from "@/components/ui/alert-dialog"

export function AlertDialogDemo() {
  return (
    <AlertDialog>
      <div className="flex items-center gap-2 p-4 border rounded-lg my-4 bg-background w-full" 
        style={{ backgroundColor: "rgba(255, 243, 324, 1)" }}
      >
        <AlertCircle className="size-6 text-warning" />
        <span className="text-sm font-medium">Please Verify Your Email</span>
      </div>
    </AlertDialog>
  )
}
