class HLSInitializer {
  constructor() {
    this.options = {
      autoStartLoad: false,
      maxBufferLength: 30,
      maxMaxBufferLength: 60,
      enableWorker: true
    };
  }

  initializeAll() {
    const videos = document.querySelectorAll('video[src$=".m3u8"]');
    videos.forEach(video => this.initializeVideo(video));
  }

  initializeVideo(video) {
    const videoSrc = video.getAttribute('src');

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      video.src = videoSrc;
      return;
    }

    if (!Hls.isSupported()) return;

    const hls = new Hls(this.options);
    hls.loadSource(videoSrc);
    hls.attachMedia(video);

    //Слушаем событие play до attachMedia
    video.addEventListener('play', () => {
      hls.startLoad(-1);
    }, { once: true });
  }
}

export default HLSInitializer;