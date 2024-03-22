document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('createForm');
    const titleInput = document.getElementById('title');
    const contentInput = document.getElementById('content');
    const postList = document.getElementById('postList');

    
    const fetchPosts = async () => {
        const response = await fetch('http://localhost:3000/posts');
        const posts = await response.json();

        postList.innerHTML = posts.map(post => `
        <li>
          <strong>${post.title}</strong>
          <p>${post.content}</p>
          <button onclick="editPost('${post.id}')">Редактировать</button>
          <button onclick="deletePost('${post.id}')">Удалить</button>
        </li>
      `).join('');
    };

    
    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                title: titleInput.value,
                content: contentInput.value,
            }),
        });

        if (response.ok) {
            titleInput.value = '';
            contentInput.value = '';
            fetchPosts();
        }
    });

    
    window.deletePost = async (postId) => {
        const response = await fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE',
        });

        if (response.ok) {
            fetchPosts();
        }
    };

    
    window.editPost = async (postId) => {
        const response = await fetch(`http://localhost:3000/posts/${postId}`);
        const post = await response.json();

        
        titleInput.value = post.title;
        contentInput.value = post.content;

        
        form.onsubmit = async (e) => {
            e.preventDefault();

            const updateResponse = await fetch(`http://localhost:3000/posts/${postId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    title: titleInput.value,
                    content: contentInput.value,
                }),
            });

            if (updateResponse.ok) {
                titleInput.value = '';
                contentInput.value = '';
                form.onsubmit = null; 
                fetchPosts();
            }
        };
    };

   
    fetchPosts();
});