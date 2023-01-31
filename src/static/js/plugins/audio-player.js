const audioPlayers = document.querySelectorAll(".audio-player");
let activeAudio = null,
    activeItem = null,
    activeButtonIcon = null;

audioPlayers.forEach(function (player) {
    const item = player.closest('.item');
    const audio = player.querySelector('.audio-player__audio');
    const playButton = player.querySelector('.audio-player__play');
    const playButtonIcon = playButton.querySelector('use');
    const playButtonIconUrl = playButtonIcon.getAttribute('xlink:href');
    const timeCurrent = player.querySelector('.audio-player__time-current');
    const timeAll = player.querySelector('.audio-player__time-all');
    const progressBar = player.querySelector('.audio-player__progress');
    const progressBarLine = player.querySelector('.audio-player__progress-line');

    if(audio) {

        // Volume 0.5
        audio.volume = 0.4;

        // Time audio
        audio.addEventListener('loadedmetadata', function () {
            timeAll.textContent = getTimeCodeFromNum(audio.duration);
            timeCurrent.textContent = getTimeCodeFromNum(audio.currentTime);
        });

        // Play pause
        playButton.addEventListener('click', function (e) {

            if(audio.paused) {
                if(activeAudio) {
                    activeAudio.pause();
                    activeButtonIcon.setAttribute('xlink:href', playButtonIconUrl);
                    if(activeItem) {
                        activeItem.classList.remove('show');
                    }
                }
                audio.play();
                activeAudio = audio;
                activeButtonIcon = playButtonIcon;
                playButtonIcon.setAttribute('xlink:href', playButtonIconUrl.replace('play', 'pause'));
                if(item) {
                    activeItem = item;
                    item.classList.add('show');
                }
            } else {
                audio.pause();
                if(item) {
                    item.classList.remove('show');
                }
                activeItem = null;
                activeAudio = null;
                activeButtonIcon = null;
                playButtonIcon.setAttribute('xlink:href', playButtonIconUrl);
            }

            const progressInterval = setInterval(() => {
                let width = audio.currentTime / audio.duration * 100;
                progressBarLine.style.width = width + "%";
                timeCurrent.textContent = getTimeCodeFromNum(audio.currentTime);
                if(width === 100) {
                    playButtonIcon.setAttribute('xlink:href', playButtonIconUrl);
                    clearInterval(progressInterval);
                }
            }, 200);
        });

        // Timeline click
        progressBar.addEventListener("click", function (e) {
            const progressBarLineWidth = window.getComputedStyle(progressBar).width;
            const timeToSeek = e.offsetX / parseInt(progressBarLineWidth) * audio.duration;
            audio.currentTime = timeToSeek;
        }, false);
    }
});

function getTimeCodeFromNum(num) {
    let seconds = parseInt(num);
    let minutes = parseInt(seconds / 60);
    seconds -= minutes * 60;
    const hours = parseInt(minutes / 60);
    minutes -= hours * 60;

    if (hours === 0) return `${minutes}:${String(seconds % 60).padStart(2, 0)}`;

    return `${String(hours).padStart(2, 0)}:${minutes}:${String(
        seconds % 60
    ).padStart(2, 0)}`;
}


