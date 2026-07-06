import { fetchDataIfIntegrityNotMatch, getBlogs, retrieveData, subscribeBlogPostsChanges, type BlogPost } from "./shared";

let id: number;
const params = new URLSearchParams(window.location.search);
const maybeId = params.get('id');
if (maybeId === null) {
    window.location.replace("index.html");
}else {
    id = Number(maybeId);
    
    subscribeBlogPostsChanges(whenBlogPostsChange);
    retrieveData();
    fetchDataIfIntegrityNotMatch();
}

function whenBlogPostsChange() {
    if (id > getBlogs().length) {
        window.location.replace("index.html");
        return;
    }
    const selectedPost = getBlogs()[id] as BlogPost;
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
    (document.getElementsByTagName("article")[0] as HTMLElement).innerHTML = selectedPost.content;
}