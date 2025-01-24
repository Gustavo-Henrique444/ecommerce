export type User = {
    id:string;
    name:string;
    email:string;
    password:string;
    isAdmin:boolean;
}

export type Item = {
    id:string;
    price:number;
    date:string;
    image_url:string;
    name:string;
    type: string;
    status: boolean;
}
