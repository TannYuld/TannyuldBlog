import type { IDBSchema } from "ridbf";

export interface BlogPost {
    title: string,
    date: Date,
    tags?: string[],
    content: string
}

export const BlogPostSchema: IDBSchema<BlogPost> = [
    { title: { unique: false } },
    "date",
    "tags",
    "content",
] as const;