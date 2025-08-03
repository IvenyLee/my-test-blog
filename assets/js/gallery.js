let imageData = [];
const imageBasePath = "images/";
let currentIndex = 0;
let currentTagList = [];

fetch("./images/index.json")
    .then(res => res.json())
    .then(data => {
        imageData = data;
        renderAlbums(data);
    });

function renderAlbums(data) {
    showAllMedia(data);
    const albumMap = {};

    data.forEach(item => {
        item.tags.forEach(tag => {
            if (!albumMap[tag]) albumMap[tag] = [];
            albumMap[tag].push(item);
        });
    });

    const tagContainer = document.getElementById("tag-list");
    tagContainer.innerHTML = "";

    for (const tag in albumMap) {
        const btn = document.createElement("button");
        btn.className = "tag";
        btn.textContent = tag;
        btn.onclick = () => {
            showThumbnails(tag, albumMap[tag]);
        };
        tagContainer.appendChild(btn);
    }

}

function showThumbnails(tag, mediaList) {
    currentTagList = mediaList; // 保存当前列表
    document.getElementById("gallery-title").textContent = `相册集 - ${tag}`; // 更新标题为tag
    document.getElementById("back-button").style.display = "block"; // 显示返回按钮
    const container = document.getElementById("thumbnail-list");
    container.style.display = "flex";

    container.innerHTML = ""; // 清空旧的内容

    mediaList.forEach(media => {
        const div = document.createElement("div");
        div.className = "thumb-item";

        let element;
        if (media.type === "video") {
            element = document.createElement("video");
            element.src = imageBasePath + media.file;
            element.controls = false;
            element.width = 200;
            element.onclick = () => openModal(media);
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
// ✅ openModal 更新为：
function openModal(media) {
    currentIndex = currentTagList.findIndex(m => m.file === media.file); // 记录索引
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
        videoEl.controls = true;
        videoEl.play();
    } else {
        videoEl.pause();
        videoEl.style.display = "none";
        imgEl.style.display = "block";
        imgEl.src = imageBasePath + media.file;
    }
}

// ✅ 补上 closeModal：
function closeModal() {
    const modal = document.getElementById("img-modal");
    const videoEl = document.getElementById("modal-video");
    videoEl.pause();
    modal.style.display = "none";
}


// 添加左右切换函数
function prevMedia(e) {
    e.stopPropagation(); // 阻止冒泡关闭 modal
    if (currentTagList.length === 0) return;

    currentIndex = (currentIndex - 1 + currentTagList.length) % currentTagList.length;
    openModal(currentTagList[currentIndex]);
}

function nextMedia(e) {
    e.stopPropagation(); // 阻止冒泡关闭 modal
    if (currentTagList.length === 0) return;

    currentIndex = (currentIndex + 1) % currentTagList.length;
    openModal(currentTagList[currentIndex]);
}

function goBack() {
    showAllMedia(imageData);
}


function showAllMedia(mediaList) {
    currentTagList = mediaList;
    document.getElementById("gallery-title").textContent = "相册集 - 所有内容";
    document.getElementById("back-button").style.display = "none"; // 首页不显示返回按钮
    const container = document.getElementById("thumbnail-list");
    container.style.display = "flex";
    container.innerHTML = ""; // 清空旧内容

    mediaList.forEach(media => {
        const div = document.createElement("div");
        div.className = "thumb-item";

        let element;
        if (media.type === "video") {
            element = document.createElement("video");
            element.src = imageBasePath + media.file;
            element.controls = false;
            element.width = 200;
            element.onclick = () => openModal(media);
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


