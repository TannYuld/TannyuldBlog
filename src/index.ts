import { IDBHandle } from "ridbf";
import { BlogPostSchema, type BlogPost } from "./types";

const allBlogs: BlogPost[] = [];

addEventListener("load", async (_) => {    
    const handle = IDBHandle.open("blogpost", BlogPostSchema);
    await handle.retrieve();
    (await handle.findAll()).forEach((post) => {
        allBlogs.push(post);
    });
    
    allBlogs.forEach((post, idx) => {
        document.body.insertAdjacentHTML('beforeend', blogpostToRawHtml(post, idx));
    });
})

function blogpostToRawHtml(post: BlogPost, idx: number): string {
    let rawHTML =
        `
    <a href="/post.html?id=$5" class="post">
        <span class="post-date">$1</span>
        <p class="post-title">$2</p>
        <p class="post-tags">Tags: $3</p>
        <p class="post-preview">$4...</p>
        <span class="read-more">&raquo; Continue reading</span>
    </a>
    `;
    const formattedDate = new Intl.DateTimeFormat('en-GB', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
    }).format(post.date);
    rawHTML = rawHTML.replace("$1", formattedDate);
    rawHTML = rawHTML.replace("$2", post.title);
    if (post.tags) {
        rawHTML = rawHTML.replace("$3", post.tags.join(", "));
    }else {
        rawHTML = rawHTML.replace(`<p class="post-tags">Tags: $3</p>`, "");
    }
    rawHTML = rawHTML.replace("$4", post.content.slice(0, 146));
    rawHTML = rawHTML.replace("$5", idx.toString());

    return rawHTML;
}