import { sql } from "@vercel/postgres";
import {User, Item} from './definitions';

export async function fetchUser() {
    try {

        console.log('Fetching User data...');
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const data = await sql<User>`SELECT * FROM users`;
        
        console.log('Data fetch completed after 3 seconds.', data);

        return data;
    } catch(error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch User data.');
    }
    
}

export async function fetchItem() {
    try {

        console.log('Fetching Item data...');
        await new Promise((resolve) => setTimeout(resolve, 3000));

        const data = await sql<Item>`SELECT * FROM items`;
        
        console.log('Data fetch completed after 3 seconds.');

        return data;
    } catch(error) {
        console.error('Database Error:', error);
        throw new Error('Failed to fetch Item data.');
    }
    
}