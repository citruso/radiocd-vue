const STREAM_URL = 'https://emgregion.hostingradio.ru:8064/moscow.europaplus.mp3';
const METADATA_URL = 'https://my-radio.europaplus.ru/air/1.air.js';
const DEFAULT_MSG = 'Больше хитов! Больше музыки!';
const NODATA_MSG = 'Ошибка чтения метаданных';
const ERROR_MSG = 'Ошибка воспроизведения';

class Radio extends Audio {
    constructor(streamUrl, metadataUrl, args) {
        super();
        this.src = streamUrl;
        this.mdSrc = metadataUrl;
        this.async = true;
        this.preload = 'none';
        this.type = 'audio/mpeg';
        this.crossOrigin = 'anonymous';
        this.textNode = document.querySelector('#bar p');
        
        for (let item in args) {
            this[item] = args[item];
        }

        this.timeDefault = 5000;
        this.timeError = 30000;
        this.timeSong;

        this.onended = () => this.load();
        this.onerror = () => this.addText(this.ERROR_MSG);
        this.onvolumechange = () => (this.volume = this.volume.toFixed(1));
    }
    addText(text) {
        this.textNode.innerHTML = text;
    }
    copy() {
        let range = document.createRange();
        range.selectNode(this.textNode);
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
    }
    playback() {
        if (this.paused) {
            this.load();
            this.play();
        } else {
            this.pause();
        }
    }
    volumeKnob(event) {
        switch(event.target.id) {
            case 'up': {
                if (this.volume !== 1) this.volume += 0.1;
                break;
            }
            case 'down': {
                if (this.volume !== 0) this.volume -= 0.1;
                break;
            }
        }
    }
    async start() {
        while (true) {
            this.timeSong = await this.update();
            if (!this.timeSong) break;
            await new Promise(ok => setTimeout(ok, this.timeSong));
        }
    }
    update() {
        return fetch(this.mdSrc)
        .then(r => r.ok ? r.json() : false)
        .then(data => {
            if (data) {
                let artist = data.artist
                    .replace(/&Apos;/g, "'")
                    .replace(/[/]/g, 'feat.');
                let song = data.song
                    .replace(/&Apos;/g, "'");

                if (artist || song) {
                    this.addText((artist && !song) ? artist : (!artist && song) ? song : `${artist} - ${song}`);
                    return (data.playlist[0].duration - ~~(new Date()/1000 - data.playlist[0].start_ts)) * 1000;
                } else {
                    this.addText(this.DEFAULT_MSG);
                    return this.timeDefault;
                }
            } else {
                this.addText(this.NODATA_MSG);
                return this.timeError;
            }
        });
    }
}

const radio = new Radio(STREAM_URL, METADATA_URL, {
    DEFAULT_MSG,
    NODATA_MSG,
    ERROR_MSG
});

window.onload = function() {
    let cd = document.querySelector('#disc');
    cd.addEventListener('click', () => radio.start(), {'once': true});
    cd.removeAttribute('style');
};
