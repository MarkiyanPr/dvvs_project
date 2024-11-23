const postsDiv = document.getElementById("posts");
const postForm = document.getElementById("postForm");

// Fetch and display all posts
async function fetchPosts() {
    const res = await fetch("/posts");
    let posts = await res.json();

    // Перевірка, чи відповіді є масивом
    if (!Array.isArray(posts)) {
        posts = []; // Якщо ні, встановіть порожній масив
    }

    postsDiv.innerHTML = ""; // Clear existing posts
    posts.forEach(post => {
        const postEl = document.createElement("div");
        postEl.className = "post";
        postEl.innerHTML = `
            <h2>${post.title}</h2>
            <p>${post.description}</p>
            <p><strong>Author:</strong> ${post.author}</p>
            <button onclick="editPost('${post._id}', '${post.title}', '${post.description}', '${post.author}')">Edit</button>
            <button onclick="deletePost('${post._id}')">Delete</button>
        `;
        postsDiv.appendChild(postEl);
    });
}


// Add a new post
postForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const id = document.getElementById("postId").value;
    const title = document.getElementById("title").value;
    const author = document.getElementById("author").value;
    const description = document.getElementById("description").value;

    if (id) {
        // Оновлення поста
        const res = await fetch(`/posts/${id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, author }),
        });

        if (res.ok) {
            fetchPosts();
            resetForm();
        }
    } else {
        // Додавання нового поста
        const res = await fetch("/posts", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ title, description, author }),
        });

        if (res.ok) {
            fetchPosts();
            postForm.reset();
        }
    }
});

// Функція для скидання форми
function resetForm() {
    document.getElementById("postId").value = "";
    postForm.reset();
    document.querySelector("#postForm button").textContent = "Add Post";
}


// Delete a post
async function deletePost(id) {
    const res = await fetch(`/posts/${id}`, {
        method: "DELETE",
    });

    if (res.ok) {
        fetchPosts(); // Refresh posts list
    }
}

// Initial fetch
fetchPosts();




function editPost(id, title, description, author) {
    document.getElementById("title").value = title;
    document.getElementById("description").value = description;
    document.getElementById("author").value = author;
    document.getElementById("postId").value = id;

    const submitButton = document.querySelector("#postForm button");
    submitButton.textContent = "Update Post";
}


