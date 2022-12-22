const video = document.querySelector("video");
const playBtn = document.getElementById("play");
const playBtnIcon = playBtn.querySelector("i");
const muteBtn = document.getElementById("mute");
const muteBtnIcon = muteBtn.querySelector("i");
const volumeRange = document.getElementById("volume");
const currentTime = document.getElementById("currentTime");
const totalTime = document.getElementById("totalTime");
const timeLine = document.getElementById("timeLine");
const timeLineProgress = document.querySelector("progress");
const fullScreenBtn = document.getElementById("fullScreen");
const fulllScreenIcon = fullScreenBtn.querySelector("i");
const videoContainer = document.getElementById("videoContainer");
const videoControls = document.getElementById("videoControls");

let controlsTimeout = null;
let contorlsMovementTimeout = null;
let volumeValue = 0.5;
video.volume = volumeValue;

const fillInput = (range) => {
  let valPercent = (range.value / range.max) * 100;
  range.style.background = `linear-gradient(to right, #ff1300 ${valPercent}%, rgba(255, 255, 255, 0.3) ${valPercent}%)`;
};

const handlePlayClick = (e) => {
  if (video.paused) {
    video.play();
  } else {
    video.pause();
  }
  playBtnIcon.classList = video.paused ? "fas fa-play" : "fas fa-pause";
};

const handleMute = (e) => {
  if (video.muted) {
    video.muted = false;
  } else {
    video.muted = true;
  }
  muteBtnIcon.classList = video.muted
    ? "fas fa-volume-mute"
    : "fas fa-volume-up";
  volumeRange.value = video.muted ? 0 : volumeValue;
  fillInput(volumeRange);
};

const handleVolumeChange = (e) => {
  const {
    target: { value },
  } = e;

  fillInput(volumeRange);
  if (video.muted) {
    video.muted = false;
    muteBtn.innerText = "Mute";
  }
  volumeValue = value;
  video.volume = value;
};

const formatTime = (second) =>
  new Date(second * 1000).toISOString().substr(11, 8);

const handleLoadedMetaData = () => {
  totalTime.innerText = formatTime(Math.floor(video.duration));
  timeLineProgress.max = video.duration;
  timeLine.max = video.duration;
};

const handleTimeUpdate = () => {
  currentTime.innerText = formatTime(Math.floor(video.currentTime));
  timeLineProgress.value = video.currentTime;
  timeLine.value = video.currentTime;
  fillInput(timeLine);
};

const handleTimeLineInput = (e) => {
  video.currentTime = e.target.value;
};

const handleFullScreenBtnClick = () => {
  if (document.fullscreenElement) {
    document.exitFullscreen();
    fulllScreenIcon.classList = "fas fa-expand";
  } else if (document.webkitFullscreenElement) {
    document.webkitExitFullscreen();
    fulllScreenIcon.classList = "fas fa-expand";
  } else if (document.mozRequestFullScreenElement) {
    document.mozExitFullscreen();
    fulllScreenIcon.classList = "fas fa-expand";
  } else {
    if (videoContainer.requestFullscreen) {
      videoContainer.requestFullscreen();
    } else if (videoContainer.mozRequestFullScreen) {
      videoContainer.mozRequestFullScreen();
    } else if (videoContainer.webkitRequestFullscreen) {
      videoContainer.webkitRequestFullscreen();
    }
    fulllScreenIcon.classList = "fas fa-compress";
  }
};
const hideControls = () => videoControls.classList.remove("showing");
const handleMouseMove = () => {
  if (controlsTimeout) {
    clearTimeout(controlsTimeout);
    controlsTimeout = null;
  }
  if (contorlsMovementTimeout) {
    clearTimeout(contorlsMovementTimeout);
    contorlsMovementTimeout = null;
  }
  videoControls.classList.add("showing");
  contorlsMovementTimeout = setTimeout(hideControls, 2000);
};

const handleMouseLeave = () => {
  controlsTimeout = setTimeout(hideControls, 1000);
};

const handleVideoKeypress = (e) => {
  if (e.code === "Space") {
    playBtn.click();
  }
  if (e.code === "KeyM") {
    muteBtn.click();
  }
  if (e.code === "ArrowRight") {
    video.currentTime += 10;
  }
  if (e.code === "ArrowLeft") {
    video.currentTime -= 10;
  }
  if (e.code === "ArrowUp") {
    if (video.volume < 0.99) {
      volumeValue += 0.1;
      video.volume = volumeValue;
      volumeRange.value = volumeValue;
      fillInput(volumeRange);
    }
  }
  if (e.code === "ArrowDown") {
    if (video.volume > 0.01) volumeValue -= 0.1;
    video.volume = volumeValue;
    volumeRange.value = volumeValue;
    fillInput(volumeRange);
  }
  if (e.code === "KeyF") {
    fullScreenBtn.click();
  }
};

const handleVideoClick = () => {
  playBtn.click();
};

const handleEnded = () => {
  const { videoid } = videoContainer.dataset;
  fetch(`/api/videos/${videoid}/view`, {
    method: "POST",
  });
};

playBtn.addEventListener("click", handlePlayClick);
muteBtn.addEventListener("click", handleMute);
volumeRange.addEventListener("input", handleVolumeChange);
video.addEventListener("loadedmetadata", handleLoadedMetaData);
video.addEventListener("timeupdate", handleTimeUpdate);
video.addEventListener("ended", handleEnded);
videoContainer.addEventListener("mousemove", handleMouseMove);
videoContainer.addEventListener("mouseleave", handleMouseLeave);
timeLine.addEventListener("input", handleTimeLineInput);
fullScreenBtn.addEventListener("click", handleFullScreenBtnClick);
document.addEventListener("keydown", handleVideoKeypress);
video.addEventListener("click", handleVideoClick);

fillInput(volumeRange);
fillInput(timeLine);
handleLoadedMetaData();
