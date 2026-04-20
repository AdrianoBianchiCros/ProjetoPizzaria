export interface User{
    id:string,
    name:string,
    email:string,
    role: "ADMIN" | "STAF"
    createdAt:string,
    updateAt:string
}

export interface AuthResponse{
    id:string,
    name:string,
    email:string,
    role: "ADMIN" | "STAF"
   token:string
}