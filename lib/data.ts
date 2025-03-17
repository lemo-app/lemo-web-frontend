export interface Student {
  id: string
  name: string
  studentId: string
  gradeSection: string
  email: string
  parentsContact: string
  status: string
  avatar: string
}

export interface AttendanceRecord {
  id: string
  name: string
  gradeSection: string
  date: string
  checkInTime: string
  checkOutTime: string
  status: string
  avatar: string
}

export interface AttendanceSummary {
  id: string
  name: string
  gradeSection: string
  lateArrivals: number
  earlyLeaves: number
  totalIncidents: number
  lastIncident: string
  avatar: string
}

export const students: Student[] = [
  {
    id: "1",
    name: "Lisa Greg",
    studentId: "12345",
    gradeSection: "10/A",
    email: "lisagreg@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "2",
    name: "Mohammed Karim",
    studentId: "12345",
    gradeSection: "10/A",
    email: "moh_karim@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "3",
    name: "John Bushnell",
    studentId: "12345",
    gradeSection: "10/A",
    email: "johnb@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "4",
    name: "Josh Adam",
    studentId: "12345",
    gradeSection: "10/A",
    email: "josh_adam@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "5",
    name: "Linda Blair",
    studentId: "12345",
    gradeSection: "10/A",
    email: "linda_blair@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "6",
    name: "Laura Pitcher",
    studentId: "12345",
    gradeSection: "10/A",
    email: "laurap@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "7",
    name: "Sin Tae",
    studentId: "12345",
    gradeSection: "10/A",
    email: "sintae@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "8",
    name: "David Holland",
    studentId: "12345",
    gradeSection: "10/A",
    email: "davidholland@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "9",
    name: "Bryan Adam",
    studentId: "12345",
    gradeSection: "10/A",
    email: "bryanadm@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "10",
    name: "Tracy Williams",
    studentId: "12345",
    gradeSection: "10/A",
    email: "tracyw@email.com",
    parentsContact: "050 414 8778",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "11",
    name: "Michael Johnson",
    studentId: "12346",
    gradeSection: "10/A",
    email: "michaelj@email.com",
    parentsContact: "050 414 8779",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12",
    name: "Sarah Thompson",
    studentId: "12347",
    gradeSection: "10/A",
    email: "saraht@email.com",
    parentsContact: "050 414 8780",
    status: "Active",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  // Add more students to reach 100 total
  // This is just a sample, you would add more entries to reach 100
]

export const attendanceRecords: AttendanceRecord[] = [
  {
    id: "12345",
    name: "Jay Hargudson",
    gradeSection: "10/A",
    date: "12 Dec 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Tardy",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Mohammed Karim",
    gradeSection: "10/A",
    date: "10 Dec 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Absent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "John Bushnell",
    gradeSection: "10/A",
    date: "05 Dec 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Present",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Josh Adam",
    gradeSection: "10/A",
    date: "29 Oct 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Absent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Linda Blair",
    gradeSection: "10/A",
    date: "15 Oct 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Present",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Laura Prichet",
    gradeSection: "10/A",
    date: "30 Sep 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Early Leave",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Sin Tae",
    gradeSection: "10/A",
    date: "01 Sep 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Absent",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "David Holland",
    gradeSection: "10/A",
    date: "24 Aug 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Present",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Bryan Barket",
    gradeSection: "10/A",
    date: "02 Aug 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Present",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Tracy Williams",
    gradeSection: "10/A",
    date: "19 Jun 2023",
    checkInTime: "08:10 AM",
    checkOutTime: "02:30 PM",
    status: "Present",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  // Add more attendance records to reach 100 total
  // This is just a sample, you would add more entries to reach 100
]

export const attendanceSummary: AttendanceSummary[] = [
  {
    id: "12345",
    name: "Jay Hargudson",
    gradeSection: "10/A",
    lateArrivals: 5,
    earlyLeaves: 3,
    totalIncidents: 8,
    lastIncident: "12 Dec 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Mohammed Karim",
    gradeSection: "10/A",
    lateArrivals: 2,
    earlyLeaves: 1,
    totalIncidents: 3,
    lastIncident: "10 Dec 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "John Bushnell",
    gradeSection: "10/A",
    lateArrivals: 0,
    earlyLeaves: 0,
    totalIncidents: 0,
    lastIncident: "-",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Josh Adam",
    gradeSection: "10/A",
    lateArrivals: 3,
    earlyLeaves: 2,
    totalIncidents: 5,
    lastIncident: "29 Oct 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Linda Blair",
    gradeSection: "10/A",
    lateArrivals: 1,
    earlyLeaves: 0,
    totalIncidents: 1,
    lastIncident: "15 Oct 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Laura Prichet",
    gradeSection: "10/A",
    lateArrivals: 0,
    earlyLeaves: 4,
    totalIncidents: 4,
    lastIncident: "30 Sep 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Sin Tae",
    gradeSection: "10/A",
    lateArrivals: 7,
    earlyLeaves: 2,
    totalIncidents: 9,
    lastIncident: "01 Sep 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "David Holland",
    gradeSection: "10/A",
    lateArrivals: 0,
    earlyLeaves: 0,
    totalIncidents: 0,
    lastIncident: "-",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Bryan Barket",
    gradeSection: "10/A",
    lateArrivals: 1,
    earlyLeaves: 1,
    totalIncidents: 2,
    lastIncident: "02 Aug 2023",
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: "12345",
    name: "Tracy Williams",
    gradeSection: "10/A",
    lateArrivals: 0,
    earlyLeaves: 0,
    totalIncidents: 0,
    lastIncident: "-",
    avatar: "/placeholder.svg?height=40&width=40",
  },
]

