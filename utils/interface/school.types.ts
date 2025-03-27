export interface School {
    _id: string  // MongoDB id (required)
    id?: string | number // Legacy id (optional)
    school_name: string
    address?: string
    contact_number?: string
    description?: string
    start_time?: string
    end_time?: string
    logo_url?: string
    qr_url?: string
    createdAt?: Date | string // For sorting purposes
    updatedAt?: string
}