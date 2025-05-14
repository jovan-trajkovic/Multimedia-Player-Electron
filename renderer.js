window.addEventListener("DOMContentLoaded", () => {
  const videos = window.videoAPI.getVideos();
  const playlist = document.getElementById("playlist");
  const videoPlayer = document.getElementById("videoPlayer");
  const videoName = document.getElementById("videoName");

  console.log(videos?? 'empty')

  videos.forEach((video) => {
    const item = document.createElement("div");
    item.className = "playlist-item";

    item.innerHTML = `
      <img src="${video.thumbnail}" alt="${video.name}" class="thumbnail" />
      <div class="video-info">
        <p>${video.name}</p>
        <p>Author: ${video.author}</p>
        <p>Duration: ${video.duration}</p>
        <p>Created: ${video.createdAt}</p>
      </div>
    `;

    item.onclick = () => {
      videoPlayer.src = video.file;
      videoName.textContent = video.name;
      videoPlayer.play();
    };
    playlist.appendChild(item);
  });
});

window.windowAPI.onThemeChanged((theme) => {
  const link = document.getElementById("theme");
  if (link) {
    link.href = theme === "dark" ? "dark.css" : "light.css";
  }
});