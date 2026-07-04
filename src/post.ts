import { IDBHandle, type IDBSchema } from "ridbf";
import { BlogPostSchema, type BlogPost } from "./types";

addEventListener("load", async (_) => {
    const handle = IDBHandle.open("blogpost", BlogPostSchema);
    await handle.retrieve();
    const blogPosts = await handle.findAll();

    const params = new URLSearchParams(window.location.search);
    const id = params.get('id');
    if (id === null) {
        window.location.replace("index.html");
        return;
    }
    const selectedPost = blogPosts[Number(id)] as BlogPost;
    (document.getElementById("post-title") as HTMLElement).textContent = selectedPost.title;
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(selectedPost.date);
    (document.getElementById("post-date") as HTMLElement).textContent = formattedDate;
    if (selectedPost.tags) {
        (document.getElementById("post-tags") as HTMLElement).textContent = selectedPost.tags.join(", ");
    }
    (document.getElementsByTagName("article")[0] as HTMLElement ).innerHTML = selectedPost.content;
})