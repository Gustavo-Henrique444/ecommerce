import bcrypt from 'bcrypt';
import { db } from '@vercel/postgres';
import {users, items} from '../lib/placeholder-data';

const client = await db.connect();

async function seedUsers() {
    await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;
    await client.sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        isAdmin BOOLEAN NOT NULL
      );
    `;

    const insertedUsers = await Promise.all(
        users.map(async (user) => {
          const hashedPassword = await bcrypt.hash(user.password, 10);
          return client.sql`
            INSERT INTO users (id, name, email, password, isAdmin)
            VALUES (${user.id}, ${user.name}, ${user.email}, ${hashedPassword}, ${user.isAdmin})
            ON CONFLICT (id) DO NOTHING;
          `;
        })
    );

    return insertedUsers;

}

async function seedItems() {
  await client.sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp"`;

  await client.sql`
    CREATE TABLE IF NOT EXISTS item (
      id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
      price NUMERIC NOT NULL,
      date TEXT NOT NULL,
      image_url TEXT NOT NULL,
      name VARCHAR(255) NOT NULL,
      type TEXT NOT NULL, 
      status BOOLEAN NOT NULL
    );
  `;

  const insertedItems = await Promise.all(
      items.map(async (item) => {
        return client.sql`
          INSERT INTO item (id, price, date, image_url, name, type, status)
          VALUES (${item.id}, ${item.price}, ${item.date}, ${item.image_url}, ${item.name}, ${item.type}, ${item.status})
          ON CONFLICT (id) DO NOTHING;
        `;
      })
    );

  return insertedItems;
}

export async function GET() {
      try {
        await client.sql`BEGIN`;
        await seedUsers();
        await seedItems();
        await client.sql`COMMIT`;
   
        return new Response(JSON.stringify({ message: 'Database seeded successfully' }), { status: 200 });
      } catch (error) {
        await client.sql`ROLLBACK`;
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
      } finally {
        await client.end(); // Ensure proper cleanup
      }
  }
 