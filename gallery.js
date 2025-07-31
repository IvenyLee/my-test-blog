let imageData = [];
const imageBasePath = "images/";

fetch("images/index.json")
    .then(res => res.json())
    .then(data => {
        imageData = data;
        renderAlbums(data);
    });

function renderAlbums(data) {
    const albumMap = {};

    data.forEach(item => {
        item.tags.forEach(tag => {
            if (!albumMap[tag]) albumMap[tag] = [];
            albumMap[tag].push(item);
        });
    });

    const albumContainer = document.getElementById("album-list");
    albumContainer.innerHTML = "";

    for (const tag in albumMap) {
        const btn = document.createElement("button");
        btn.textContent = tag + ` (${albumMap[tag].length})`;
        btn.onclick = () => showThumbnails(tag, albumMap[tag]);
        albumContainer.appendChild(btn);
    }
}

function showThumbnails(tag, mediaList) {
    const container = document.getElementById("thumbnail-list");
    container.style.display = "flex";
    container.innerHTML = `<h2>${tag}</h2>`;

    mediaList.forEach(media => {
        const div = document.createElement("div");
        div.className = "thumb-item";

        let element;
        if (media.type === "video") {
            element = document.createElement("video");
            element.src = imageBasePath + media.file;
            element.controls = true;
            element.width = 200;
        } else {
            element = document.createElement("img");
            element.src = imageBasePath + media.file;
            element.alt = media.title;
            element.onclick = () => openModal(media);
        }

        const caption = document.createElement("p");
        caption.textContent = media.title;

        div.appendChild(element);
        div.appendChild(caption);
        container.appendChild(div);
    });
}


// ✅ 修改这里，匹配 HTML 里的 id
function openModal(media) {
    const modal = document.getElementById("img-modal");
    const imgEl = document.getElementById("modal-img");
    const videoEl = document.getElementById("modal-video");
    const caption = document.getElementById("modal-caption");

    modal.style.display = "block";
    caption.textContent = media.title;

    if (media.type === "video") {
        imgEl.style.display = "none";
        videoEl.style.display = "block";
        videoEl.src = imageBasePath + media.file;
        videoEl.play();
    } else {
        videoEl.pause();
        videoEl.style.display = "none";
        imgEl.style.display = "block";
        imgEl.src = imageBasePath + media.file;
    }
}


function closeModal() {
    const modal = document.getElementById("img-modal");
    const videoEl = document.getElementById("modal-video");
    videoEl.pause(); // 关闭时停止视频
    modal.style.display = "none";
}

