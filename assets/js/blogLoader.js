function loadPostList() {
    fetch('./posts/index.json')
        .then(response => response.json())
        .then(posts => {
            // 按标题排序
            posts.sort((a, b) => a.title.localeCompare(b.title, 'zh-Hans-CN', { sensitivity: 'base' }));

            const ul = document.getElementById('post-list');
            ul.innerHTML = '';

            const tagCount = {};
            const allPosts = posts.slice(); // 保存所有文章列表
            let pending = posts.length;

            posts.forEach(post => {
                // 创建文章标题项
                const li = document.createElement("li");
                const a = document.createElement("a");
                a.href = "#";
                a.textContent = post.title;
                a.onclick = (e) => {
                    e.preventDefault();
                    showPost(post.file);
                };
                li.appendChild(a);
                ul.appendChild(li);

                // 加载内容，提取标签
                fetch('posts/' + post.file)
                    .then(res => res.text())
                    .then(text => {
                        const match = text.match(/\[tag:(.*?)\]/);
                        if (match) {
                            const tags = match[1].split(',').map(tag => tag.trim());
                            tags.forEach(tag => {
                                tagCount[tag] = (tagCount[tag] || 0) + 1;
                            });
                        }

                        pending--;
                        if (pending === 0) {
                            renderTagList(tagCount, allPosts); // 所有文章加载完后渲染标签栏
                        }
                    });
            });
        });
}


function renderTagList(tagCount, allPosts) {
    const tagUl = document.getElementById('tag-list');
    tagUl.innerHTML = '';

    // 添加“全部”按钮
    const allLi = document.createElement("li");
    allLi.textContent = "全部";
    allLi.style.cursor = 'pointer';
    allLi.onclick = () => {
        const ul = document.getElementById('post-list');
        ul.innerHTML = '';
        allPosts.forEach(post => {
            const li = document.createElement("li");
            const a = document.createElement("a");
            a.href = "#";
            a.textContent = post.title;
            a.onclick = (e) => {
                e.preventDefault();
                showPost(post.file);
            };
            li.appendChild(a);
            ul.appendChild(li);
        });
    };
    tagUl.appendChild(allLi);

    // 添加具体标签项
    Object.keys(tagCount).sort().forEach(tag => {
        const li = document.createElement("li");
        li.textContent = `${tag} (${tagCount[tag]})`;
        li.style.cursor = 'pointer';
        li.onclick = () => filterPostsByTag(tag);
        tagUl.appendChild(li);
    });
}

function filterPostsByTag(selectedTag) {
    fetch('./posts/index.json')
        .then(response => response.json())
        .then(posts => {
            const ul = document.getElementById('post-list');
            ul.innerHTML = '';

            posts.forEach(post => {
                fetch('posts/' + post.file)
                    .then(res => res.text())
                    .then(text => {
                        const match = text.match(/\[tag:(.*?)\]/);
                        if (match) {
                            const tags = match[1].split(',').map(tag => tag.trim());
                            if (tags.includes(selectedTag)) {
                                const li = document.createElement("li");
                                const a = document.createElement("a");
                                a.href = "#";
                                a.textContent = post.title;
                                a.onclick = (e) => {
                                    e.preventDefault();
                                    showPost(post.file);
                                };
                                li.appendChild(a);
                                ul.appendChild(li);
                            }
                        }
                    });
            });
        });
}


function showPost(file) {
    document.getElementById("blog-list").style.display = "none";
    document.getElementById("blog-post").style.display = "block";
    const container = document.getElementById("post-content");
    container.innerHTML = "加载中...";

    fetch('posts/' + file)
        .then(response => response.text())
        .then(text => {
            text = text
                .replace(/\[image:(.*?) caption:(.*?)\]/g,
                    '<figure><img src="images/$1" style="max-width:100%"><figcaption>$2</figcaption></figure>'
                )
                .replace(/\[video:(.*?) caption:(.*?)\]/g,
                    '<figure><video controls style="max-width:100%"><source src="videos/$1" type="video/mp4"></video><figcaption>$2</figcaption></figure>'
                )
                .replace(/\[youtube:(.*?) caption:(.*?)\]/g,
                    '<figure><iframe width="100%" height="315" src="$1" frameborder="0" allowfullscreen></iframe><figcaption>$2</figcaption></figure>'
                )
                .replace(/\[link:(.*?) title:(.*?)\]/g,
                    '<a href="$1" target="_blank" rel="noopener noreferrer">$2</a>'
                )
                .replace(/\[bold:(.*?)\]/g,
                    '<strong>$1</strong>'
                )
                .replace(/\[quote:(.*?)\]/g,
                    '<blockquote>$1</blockquote>'
                )
                .replace(/\[tag:(.*?)\]/g, (_, tags) => {
                    const tagList = tags.split(',').map(tag =>
                        `<span class="tag">${tag.trim()}</span>`
                    ).join('');
                    return `<div class="tags">${tagList}</div>`;
                })
                .replace(/^# (.*?)$/gm, '<h2>$1</h2>')
                .replace(/\n/g, '<br>');

            container.innerHTML = text;
        });
}


function backToList() {
    document.getElementById("blog-list").style.display = "block";
    document.getElementById("blog-post").style.display = "none";
    document.getElementById("post-content").innerHTML = "";
}