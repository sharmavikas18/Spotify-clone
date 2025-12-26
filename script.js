document.addEventListener('DOMContentLoaded', () => {
    const audio = document.getElementById('chill-audio');

    const masterPlay = document.getElementById('master-play');
    const songTitle = document.getElementById('current-song-title');
    const songArtist = document.getElementById('current-song-artist');
    const songImg = document.getElementById('current-song-img');
    const volumeSlider = document.getElementById('volume-slider');

    let currentSongKey = null;

    const songs = {
        chill: {
            title: "Lose My Mind",
            artist: "Don Toliver ft. Doja Cat",
            src: "Don_Toliver_Ft_Doja_Cat_-_Lose_My_Mind_Offblogmedia.com.mp3",
            img: "https://www.shutterstock.com/shutterstock/photos/2194960155/display_1500/stock-photo-travel-winter-lake-baikal-happy-joy-woman-tourist-lie-on-ice-sunset-top-view-2194960155.jpg"
        },
        rock: {
            title: "Do I Wanna Know?",
            artist: "Arctic Monkeys",
            src: "Do-I-Wanna-Know.mp3",
            img: "https://www.shutterstock.com/shutterstock/photos/2028980156/display_1500/stock-photo-back-view-of-pre-teen-girl-enjoying-breathtaking-view-of-winter-landscape-in-oulanka-national-park-2028980156.jpg"
        }
    };

    function updateAllCardIcons(key, isPlaying) {
        const buttons = document.querySelectorAll(`.play-btn[data-song="${key}"]`);
        buttons.forEach(btn => {
            const icon = btn.querySelector('i');
            if (isPlaying) {
                icon.classList.remove('fa-play');
                icon.classList.add('fa-pause');
            } else {
                icon.classList.remove('fa-pause');
                icon.classList.add('fa-play');
            }
        });
    }

    // Reset ALL icons to play (when switching songs)
    function resetAllIcons() {
        const allIcons = document.querySelectorAll('.play-btn i');
        allIcons.forEach(icon => {
            icon.classList.remove('fa-pause');
            icon.classList.add('fa-play');
        });
    }


    function updateMasterPlay(isPlaying) {
        if (isPlaying) {
            masterPlay.classList.remove('fa-circle-play');
            masterPlay.classList.remove('fa-solid');
            masterPlay.classList.add('fa-regular');
            masterPlay.classList.add('fa-circle-pause');
            masterPlay.classList.add('fa-solid');
        } else {
            masterPlay.classList.remove('fa-circle-pause');
            masterPlay.classList.add('fa-circle-play');
        }
    }

    function playSong(key) {
        const song = songs[key];

        if (currentSongKey === key) {
            if (audio.paused) {
                audio.play();
                updateAllCardIcons(key, true);
                updateMasterPlay(true);
            } else {
                audio.pause();
                updateAllCardIcons(key, false);
                updateMasterPlay(false);
            }
        } else {
            currentSongKey = key;
            audio.src = song.src;
            songTitle.innerText = song.title;
            songArtist.innerText = song.artist;
            songImg.src = song.img;
            songImg.style.opacity = "1";

            resetAllIcons();

            audio.play();
            updateAllCardIcons(key, true);
            updateMasterPlay(true);
        }
    }

   
    const allPlayButtons = document.querySelectorAll('.play-btn');
    allPlayButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const songKey = btn.getAttribute('data-song');
            if (songKey) playSong(songKey);
        });
    });

    masterPlay.addEventListener('click', () => {
        // If master play is clicked but no song was selected yet, default to chill
        if (!currentSongKey) {
            playSong('chill');
            return;
        }

        if (audio.paused) {
            audio.play();
            updateAllCardIcons(currentSongKey, true);
            updateMasterPlay(true);
        } else {
            audio.pause();
            updateAllCardIcons(currentSongKey, false);
            updateMasterPlay(false);
        }
    });


    volumeSlider.addEventListener('input', (e) => {
        audio.volume = e.target.value / 100;
    });

    // Audio Events
    audio.addEventListener('pause', () => {
        updateMasterPlay(false);
        if (currentSongKey) updateAllCardIcons(currentSongKey, false);
    });
    audio.addEventListener('play', () => {
        updateMasterPlay(true);
        if (currentSongKey) updateAllCardIcons(currentSongKey, true);
    });

    const progressBar = document.getElementById('progress-bar');
    const currentTimeSpan = document.getElementById('current-time');
    const totalDurationSpan = document.getElementById('total-duration');

    // Format time mm:ss
    function formatTime(seconds) {
        if (isNaN(seconds)) return "0:00";
        const min = Math.floor(seconds / 60);
        const sec = Math.floor(seconds % 60);
        return `${min}:${sec < 10 ? '0' : ''}${sec}`;
    }

    // Update max duration when metadata loads
    audio.addEventListener('loadedmetadata', () => {
        progressBar.max = audio.duration;
        totalDurationSpan.innerText = formatTime(audio.duration);
    });

    // Update slider as song plays
    audio.addEventListener('timeupdate', () => {
        progressBar.value = audio.currentTime;
        currentTimeSpan.innerText = formatTime(audio.currentTime);
    });

    // Seek when user changes slider
    progressBar.addEventListener('input', () => {
        audio.currentTime = progressBar.value;
    });
});
