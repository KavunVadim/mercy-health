export interface Project {
  _id?: string;
  title: string;
  description: string;
  link?: string;
  imageUrl?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface News {
  _id?: string;
  title: string;
  content: string;
  imageUrl?: string;
  publishedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface Photo {
  _id?: string;
  caption?: string;
  url: string;
  uploadedAt?: Date;
  createdAt?: Date;
  updatedAt?: Date;
}
