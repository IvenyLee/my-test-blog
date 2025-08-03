let games = [];

function loadGameList() {
  const listContainer = document.getElementById("game-list");
  listContainer.innerHTML = "";

  games.forEach((game, index) => {
    const button = document.createElement("button");
    button.textContent = game.name;
    button.className = "btn";
    button.onclick = () => loadGame(index);
    listContainer.appendChild(button);
  });
}

function loadGame(index) {
  const game = games[index];

  // 如果是外链，可以跳转到新窗口
  if (game.external) {
    window.open(game.src, "_blank");
    return;
  }

  const modal = document.getElementById("game-modal");
  const title = document.getElementById("game-modal-title");
  const iframe = document.getElementById("game-iframe");
  const container = document.getElementById("game-container");

  title.textContent = game.name;
  iframe.src = game.src;

  // 默认尺寸
  const gameWidth = game.width || 800;
  const gameHeight = game.height || 600;

  // 最大容器尺寸（窗口留出一点边距）
  const maxWidth = window.innerWidth * 0.95;
  const maxHeight = window.innerHeight * 0.85;

  // 缩放比例
  const scale = Math.min(maxWidth / gameWidth, maxHeight / gameHeight);

  // 设置 container 尺寸和缩放
  container.style.width = `${gameWidth}px`;
  container.style.height = `${gameHeight}px`;
  container.style.transform = `scale(${scale})`;
  container.style.transformOrigin = "top left"; // 避免缩放后偏移
  container.style.margin = "0 auto";

  modal.style.display = "block";
}

function closeGameModal() {
  const modal = document.getElementById("game-modal");
  const iframe = document.getElementById("game-iframe");

  iframe.src = ""; // 防止游戏继续运行
  modal.style.display = "none";
}

function fetchGames() {
  fetch("./assets/game/games.json")
    .then(response => response.json())
    .then(data => {
      games = data;
      loadGameList();
    })
    .catch(error => {
      console.error("游戏列表加载失败:", error);
    });
}

window.onload = fetchGames;
