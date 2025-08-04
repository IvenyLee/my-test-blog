let allVideos = [];
let currentSource = null;

function renderSourceTags(sources) {
  const tagList = document.getElementById("tag-list");
  if (!tagList) return;

  tagList.innerHTML = "";

  // “全部”按钮
  const allBtn = document.createElement("button");
  allBtn.textContent = "全部";
  allBtn.className = "btn";
  allBtn.onclick = () => {
    currentSource = null;
    renderVideoList(allVideos);
  };
  tagList.appendChild(allBtn);

  // 每个 source 生成一个按钮
  sources.forEach(source => {
    const btn = document.createElement("button");
    btn.textContent = source;
    btn.className = "btn";
    btn.onclick = () => {
      currentSource = source;
      const filtered = allVideos.filter(v => v.source === source);
      renderVideoList(filtered);
    };
    tagList.appendChild(btn);
  });
}

function renderVideoList(videos) {
  const list = document.getElementById("video-list");
  const player = document.getElementById("video-player");
  const defaultVideo = document.getElementById("default-video");
  const title = document.getElementById("external-title");
  const backBtn = document.getElementById("back-to-index");

  list.innerHTML = "";

  videos.forEach(video => {
    const li = document.createElement("li");
    const a = document.createElement("a");
    a.href = "#";
    a.textContent = video.title;
    a.title = video.title; // 鼠标悬停显示完整标题

    // 附加 source 标签（可选）
    if (video.source) {
      const tag = document.createElement("span");
      tag.textContent = ` [${video.source}]`;
      tag.className = "tag";
      a.appendChild(tag);
    }

    a.onclick = (e) => {
      e.preventDefault();

      if (video.external) {
        window.open(video.url, "_blank");
        return;
      }
      
      player.src = ""; // 清空旧的
      player.src = video.url;
      player.style.display = "block";
      defaultVideo.style.display = "none";

      title.innerHTML = `Butter - ${video.title}` +
        (video.source ? ` <span class="tag">${video.source}</span>` : "");
      backBtn.style.display = "inline-block";
    };

    li.appendChild(a);
    list.appendChild(li);
  });
}

function goBack() {
  const player = document.getElementById("video-player");
  const defaultVideo = document.getElementById("default-video");
  const title = document.getElementById("external-title");
  const backBtn = document.getElementById("back-to-index");

  player.src = "";
  player.style.display = "none";
  defaultVideo.style.display = "block";
  title.textContent = "Butter";
  backBtn.style.display = "none";
}

// 主程序入口：加载 JSON
fetch("./embedVideos/butter.json")
  .then(res => res.json())
  .then(videos => {
    allVideos = videos;

    // 收集所有唯一 source 值
    const sourceSet = new Set();
    videos.forEach(v => {
      if (v.source) sourceSet.add(v.source);
    });

    renderSourceTags([...sourceSet]);
    renderVideoList(videos);
  })
  .catch(err => console.error("加载失败:", err));
