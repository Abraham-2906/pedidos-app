// src/services/postsService.ts

export interface User {
  id: number;
  name: string;
  username: string;
  email: string;
}

export interface Post {
  id?: number;
  title: string;
  body: string;
  userId: number;
}

const BASE_URL = 'https://jsonplaceholder.typicode.com';

export const postsService = {
  async getAll(): Promise<Post[]> {
    const res = await fetch(`${BASE_URL}/posts`);
    if (!res.ok) throw new Error('Error al cargar los posts');
    return res.json();
  },

  async getUsers(): Promise<User[]> {
    const res = await fetch(`${BASE_URL}/users`);
    if (!res.ok) throw new Error('Error al cargar usuarios');
    return res.json();
  },

  async create(post: { title: string; body: string; userId: number }): Promise<Post> {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json; charset=UTF-8',
      },
      body: JSON.stringify(post),
    });

    if (!res.ok) throw new Error('Error al guardar el post');
    return res.json();
  },
};