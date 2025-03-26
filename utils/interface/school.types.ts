export interface School {
    id: number // MongoDB will use _id, but we'll keep id for frontend
    school_name: string
    address?: string
    contact_number?: string
    description?: string
    start_time?: string
    end_time?: string
    logo_url?: string
    createdAt?: Date // For sorting purposes
}