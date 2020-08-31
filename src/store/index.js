import Vue from 'vue';
import Vuex from 'vuex';

import { STREAM_URL, METADATA_URL } from './url.type';
import { DEFAULT_TIME, ERROR_TIME } from './time.type';
import { DEFAULT_MSG, NODATA_MSG, ERROR_MSG } from './info.type';

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    audio: new Audio(),
    title: 'Click on CD',
    playing: false
  },
  mutations: {
    setConfig: state => {
      Object.assign(state.audio, {
        src: STREAM_URL,
        preload: 'none',
        type: 'audio/mpeg',
        crossOrigin: 'anonymous'
      });
      state.audio.onended = () => state.audio.load();
      state.audio.onerror = () => (state.title = ERROR_MSG);
      state.audio.onvolumechange = () => {
        state.audio.volume = state.audio.volume.toFixed(1);
      };
    },
    setPlaying: state => {
      state.playing = !state.playing;
    },
    setTitle: (state, title) => {
      state.title = title;
    },
    setVolumeUP: state => {
      if (state.audio.volume !== 1)
        state.audio.volume += 0.1;
    },
    setVolumeDOWN: state => {
      if (state.audio.volume !== 0)
        state.audio.volume -= 0.1;
    }
  },
  actions: {
    togglePlay: ({ state, commit }) => {
      if (state.audio.paused) {
        state.audio.load();
        state.audio.play();
      } else {
        state.audio.pause();
      }
      commit('setPlaying');
    },
    loop: ({ dispatch }) => {
      dispatch('updateData')
        .then(time => time ? setTimeout(() => dispatch('loop'), time) : false);
    },
    updateData: ({ commit }) => {
      return fetch(METADATA_URL)
        .then(r => r.ok ? r.json() : false)
        .then(data => {
          if (data) {
            let artist = data.artist
              .replace(/&Apos;/g, "'")
              .replace(/[/]/g, 'feat.');
            let song = data.song
              .replace(/&Apos;/g, "'");

            if (artist || song) {
              commit('setTitle',
                (artist && !song)
                  ? artist : (!artist && song)
                    ? song : `${artist} - ${song}`
              );

              return (data.playlist[0].duration - ~~(new Date() / 1000 - data.playlist[0].start_ts)) * 1000;
            } else {
              commit('setTitle', DEFAULT_MSG);
              return DEFAULT_TIME;
            }
          } else {
            commit('setTitle', NODATA_MSG);
            return ERROR_TIME;
          }
        });
    }
  }
})
