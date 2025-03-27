export interface IUser {
    full_name?: string;
    email: string;
    type: string;
    token: string;
    avatar_url?: string;
    userId: string;
}

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
    type: string;
    email_verified: boolean;
    full_name?: string;
    avatar_url?: string;
    createdAt: string;
    updatedAt: string;
    __v?: number;
}

export interface UsersResponse {
    status: string;
    data: {
        users: User[];
        totalUsers: number;
    };
}