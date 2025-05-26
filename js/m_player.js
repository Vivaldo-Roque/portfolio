let track_name = document.querySelector('.track-name');
let track_artist = document.querySelector('.track-artist');
let playpause_btn = document.querySelector('.playpause-track');
let seek_slider = document.querySelector('.seek_slider');
let volume_slider = document.querySelector('.volume_slider');
let curr_time = document.querySelector('.current-time');
let total_duration = document.querySelector('.total-duration');
let curr_track = document.createElement('audio');
let volume_value = document.getElementById('volume_value');
let player_container = document.querySelector('.player-container');

let isPlaying = false;
let isHidden = true;
let updateTimer;

const music = {
  name: 'Minha terra',
  artist: 'Ruy Mingas',
  music: 'audio/ruy_mingas-minha_terra.mp3'
};

loadTrack();

function loadTrack() {
  clearInterval(updateTimer);
  reset();

  curr_track.src = music.music;
  curr_track.load();
  setVolume();
  track_name.textContent = music.name;
  track_artist.textContent = music.artist;

  updateTimer = setInterval(setUpdate, 1000);

  curr_track.addEventListener('ended', ended);
}

function ended() {
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
  reset();
}

function reset() {
  clearInterval(updateTimer);
  curr_time.textContent = "00:00";
  total_duration.textContent = "00:00";
  seek_slider.value = 0;
}

function playpauseTrack() {
  isPlaying ? pauseTrack() : playTrack();
}
function playTrack() {
  curr_track.play();
  isPlaying = true;
  playpause_btn.innerHTML = '<i class="fa fa-pause-circle fa-5x"></i>';
}
function pauseTrack() {
  curr_track.pause();
  isPlaying = false;
  playpause_btn.innerHTML = '<i class="fa fa-play-circle fa-5x"></i>';
}
function seekTo() {
  let seekto = curr_track.duration * (seek_slider.value / 100);
  curr_track.currentTime = seekto;
}
function setVolume() {
  curr_track.volume = volume_slider.value / 100;
  volume_value.textContent = volume_slider.value;
}
function setUpdate() {
  let seekPosition = 0;
  if (!isNaN(curr_track.duration)) {
    seekPosition = curr_track.currentTime * (100 / curr_track.duration);
    seek_slider.value = seekPosition;

    let currentMinutes = Math.floor(curr_track.currentTime / 60);
    let currentSeconds = Math.floor(curr_track.currentTime - currentMinutes * 60);
    let durationMinutes = Math.floor(curr_track.duration / 60);
    let durationSeconds = Math.floor(curr_track.duration - durationMinutes * 60);

    if (currentSeconds < 10) { currentSeconds = "0" + currentSeconds; }
    if (durationSeconds < 10) { durationSeconds = "0" + durationSeconds; }
    if (currentMinutes < 10) { currentMinutes = "0" + currentMinutes; }
    if (durationMinutes < 10) { durationMinutes = "0" + durationMinutes; }

    curr_time.textContent = currentMinutes + ":" + currentSeconds;
    total_duration.textContent = durationMinutes + ":" + durationSeconds;
  }
}

function togglePlayer() {
  const container = document.querySelector('.player-container');
  isHidden = !isHidden;

  if (isHidden) {
    container.classList.add('hidden');
  } else {
    container.classList.remove('hidden');
  }
}

player_container.addEventListener('click', function (e) {
    togglePlayer();
});

document.querySelector('.playpause-track').addEventListener('click', function (e) {
  e.stopPropagation();
});

document.querySelector('.seek_slider').addEventListener('click', function (e) {
  e.stopPropagation();
});

document.querySelector('.volume_slider').addEventListener('click', function (e) {
  e.stopPropagation();
});