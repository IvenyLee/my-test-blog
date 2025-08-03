fetch("embedVideos/index.json")
  .then(res => res.json())
  .then(videos => {
    const player = document.getElementById("video-player");
    const defaultVideo = document.getElementById("default-video");
    const list = document.getElementById("video-list");
    const title = document.getElementById("external-title");
    const backBtn = document.getElementById("back-to-index");

    // 初始状态：iframe隐藏，默认视频播放
    player.style.display = "none";
    defaultVideo.style.display = "block";

    videos.forEach((video) => {
      const li = document.createElement("li");
      const a = document.createElement("a");
      a.href = "#";
      a.textContent = video.title + (video.source ? ` (${video.source})` : "");
      a.onclick = (e) => {
        e.preventDefault();

        if (video.external) {
            // 外部链接，打开新标签
            window.open(video.url, "_blank");
            return;
        }
        
        // 切换显示
        player.src = video.url;
        player.style.display = "block";
        defaultVideo.style.display = "none";

        // 更新标题
        title.textContent = `外链视频 - ${video.title}`;
        backBtn.style.display = "inline-block";
      };
      li.appendChild(a);
      list.appendChild(li);
    });
  });

function goBack() {
  const player = document.getElementById("video-player");
  const defaultVideo = document.getElementById("default-video");
  const title = document.getElementById("external-title");
  const backBtn = document.getElementById("back-to-index");

  // 停止 iframe 视频
  player.src = "";
  player.style.display = "none";

  // 恢复本地视频
  defaultVideo.style.display = "block";

  // 恢复标题
  title.textContent = "外链视频";
  backBtn.style.display = "none";
}
