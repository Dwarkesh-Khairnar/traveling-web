document.addEventListener("DOMContentLoaded", () => {
if (window.location.pathname === '/gallery') {
    fetch('/gallery')
        .then(response => response.json())
        .then(data => {
            const gallery = document.getElementById('gallery');
            data.forEach(place => {
                const placeCard = `
                    <div class="col-md-4">
                        <div class="card mb-4">
                            <img src="${place.image_url}" class="card-img-top" alt="${place.name}">
                            <div class="card-body">
                                <h5 class="card-title">${place.name}</h5>
                                <p class="card-text">${place.description}</p>
                            </div>
                        </div>
                    </div>
                `;
                gallery.innerHTML += placeCard;
            });
        })
        .catch(error => console.error('Error fetching gallery data:', error));
}
  if (window.location.pathname === "/blog") {
    fetch("/blog")
      .then((response) => {
        console.log('response:',response);
        if(!response.ok){
            throw new error('Network response was not ok');
        }
        return response.json()})
      .then((posts) => {
        const blogPosts = document.getElementById("blog-posts");
        blogPosts.innerHTML = ""; // Clear previous content
        posts.forEach((post) => {
          const blogPost = `
                    <div class="card mb-3">
                    <div class="card-body">
                    <h5 class="card-title">${post.title}</h5>
                    <p class="card-text">${post.content}</p>
                    <small class="text-muted">Posted on ${new Date(
                      post.created_at
                    ).toLocaleString()}</small>
                    </div>
                    </div>
                    `;
          blogPosts.innerHTML += blogPost;
        });
      })
      .catch((error) => console.error("Error fetching blog posts:", error));
    }
});

// Blog Page: Fetch and display blog posts, and handle new blog post submission
// if (window.location.pathname === '/blog') {
//     fetch('/blog')
//         .then(response => response.json())
//         .then(posts => {
//             const blogPosts = document.getElementById('blog-posts');
//             posts.forEach(post => {
//                 const blogPost = `
//                     <div class="card mb-3">
//                         <div class="card-body">
//                             <h5 class="card-title">${post.title}</h5>
//                             <p class="card-text">${post.content}</p>
//                             <small class="text-muted">Posted on ${new Date(post.created_at).toLocaleString()}</small>
//                         </div>
//                     </div>

//              `       ;
//                 blogPosts.innerHTML += blogPost;
//             });
//         })
//         .catch(error => console.error('Error fetching blog posts:', error));

  //         // Handle new blog post submission
  // //         const form = document.getElementById('blog-form');
  // //         form.addEventListener('submit', (e) => {
  // //             e.preventDefault();
  // //             const title = document.getElementById('title').value;
  // //             const content = document.getElementById('content').value;

  // //             fetch('/blog', {
  // //                 method: 'POST',
  // //                 headers: {
  // //                     'Content-Type': 'application/json',
  // //                 },
  // //                 body: JSON.stringify({ title, content }),
  // //             })
  // //             .then(response => {
  // //                 if (response.ok) {
  // //                     window.location.reload();
  // //                 }
  // //             })
  // //             .catch(error => console.error('Error adding new blog post:', error));
  // //         });

  // // app.post('/blog', function(req, res){
  // //     console.log(req.body);
  // //     var title=req.body.title;
  // //     var content=req.body.content;
  // //     // var { title, content } = req.body;
  // //     db.query('INSERT INTO blog (title, content) VALUES (?, ?)',[title, content],(err) => {
  // //         if (err) throw err;
  // //         res.redirect('/blog');
  // //     });
  // // });
