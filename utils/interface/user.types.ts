
export interface User {
    _id: string;
    email: string;
    accessToken?: string;
    refreshToken?: string;
    age?: number;
    gender?: string;
    section?: string;
    roll_no?: string;
    student_id?: string;
    type: 'super_admin' | 'admin' | 'school_manager';
    email_verified: boolean;
    full_name?: string;
    avatar_url?: string;
    job_title?: string;
    createdAt: string;
    updatedAt: string;
    school: {
        _id: string;
        school_name: string;
        address: string;
        contact_number: string;
        logo_url?: string;
        qr_url?: string;
        start_time: string;
        end_time: string;
        description?: string;
        createdAt: string;
        updatedAt: string;
    }
}

export interface UsersResponse {
    status: string;
    data: {
        users: User[];
        totalUsers: number;
    };
}