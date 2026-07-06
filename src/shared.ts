import { CacheType, RIDBHandle, type RIDBSchema } from "@tannyuld/ridbf";

const BLOGPOST_KEY: string = "blogposts";

const allBlogs: BlogPost[] = [];
const blogChangeListeners: (() => void)[] = [];

export interface BlogPost {
    title: string,
    date: Date,
    tags?: string[],
    content: string
}

export const BlogPostSchema: RIDBSchema<BlogPost> = [
    { title: { unique: false } },
    "date",
    "tags",
    "content",
] as const;

export function retrieveData() {
    const retrievedData: string | null = localStorage.getItem(BLOGPOST_KEY);
    if (retrievedData === null) {
        return;
    }

    const result: BlogPost[] = JSON.parse(retrievedData as string);
    result.map(post => {
        if (typeof post.date !== typeof Date) {
            post.date = new Date(post.date);
        }
        return post;
    });
    setBlogs(result);
}

export async function fetchDataIfIntegrityNotMatch() {
    const handle = RIDBHandle.open("blogpost", BlogPostSchema, { dataCache: CacheType.NoCache, integrityCache: CacheType.NoCache });
    await handle.fetch();
    setBlogs(await handle.findAll());
}

export function setBlogs(blogs: BlogPost[]) {
    blogs.sort((left, right) => {
        return left.date.getTime() - right.date.getTime();
    });

    const newJSON = JSON.stringify(blogs);
    const cachedJSON = localStorage.getItem(BLOGPOST_KEY);
    if (newJSON === cachedJSON && allBlogs.length > 0) {
        return;
    }


    allBlogs.splice(0, allBlogs.length);
    blogs.forEach(blog => allBlogs.push(blog));
    blogChangeListeners.forEach(subscriber => subscriber());

    localStorage.setItem(BLOGPOST_KEY, JSON.stringify(allBlogs));
}

export function getBlogs(): BlogPost[] {
    return allBlogs;
}

export function subscribeBlogPostsChanges(proces: () => void) {
    blogChangeListeners.push(proces);
}