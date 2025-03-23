import { Button } from '@/components/ui/button'
import { Download, Plus } from 'lucide-react'
import React, { useState } from 'react'
import { AddSchoolModal } from '../schools/add-school-modal'


interface School {
  id: number
  name: string
  email: string
  status: "Signed Up" | "Subscribed" | "Invite Sent"
}


const HeaderWithButtonsLinks = () => {

  
  const [schools, setSchools] = useState<School[]>(
      Array.from({ length: 24 }, (_, i) => ({
        id: i + 1,
        name: "School Name",
        email: "schoolemail@domain.com",
        status: i % 4 === 0 ? "Subscribed" : i % 8 === 7 ? "Invite Sent" : "Signed Up",
      })),
    )

  const [isAddModalOpen, setIsAddModalOpen] = useState(false)

 const handleAddSchool = (school: { name: string; email: string; note?: string }) => {
    const newSchool: School = {
      id: schools.length + 1,
      name: school.name,
      email: school.email,
      status: "Invite Sent",
    }

    setSchools([newSchool, ...schools])
  }
  return (
    <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Manage Schools</h1>
        <div className="flex items-center gap-2">
          <Button variant="outline" className="gap-2 bg-white">
            <Download className="h-4 w-4" />
            Export
          </Button>
          <Button
                variant={isAddModalOpen ? "outline" : "default"}
                className="gap-2 " 
                onClick={() => setIsAddModalOpen(true)}>
            <Plus className="h-4 w-4" />
            Add School
          </Button>
        </div>

        <AddSchoolModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onAddSchool={handleAddSchool} />
      </div>
  )
}

export default HeaderWithButtonsLinks