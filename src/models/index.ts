// src/models/Project.ts
// Simple TypeScript interface for a Project document
export interface Project {
  _id?: string;
  title: string;
  description: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// src/models/News.ts
export interface News {
  _id?: string;
  title: string;
  content: string; // HTML or markdown
  imageUrl?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// src/models/Photo.ts
export interface Photo {
  _id?: string;
  title: string;
  description?: string;
  imageUrl: string;
  uploadedAt?: Date;
}
