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
  getters: {
    getTimeLeft: state => (start_ts, duration) => {
      return (duration - ~~(new Date() / 1000 - start_ts)) * 1000; // "~~" - cut off float (parseInt)
    },
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
    loop: async ({ dispatch }) => {
      const timeLeft = await dispatch('updateData');
      setTimeout(() => dispatch('loop'), timeLeft);
    },
    getRadioMeta: () => {
      return fetch(METADATA_URL)
        .then(response => response.ok ? response.json() : false);
    },
    updateData: async ({ getters, dispatch, commit }) => {
      const data = await dispatch('getRadioMeta');
      const [artist, song] = [data?.artist, data?.song];
      const timeLeft = getters.getTimeLeft(
        data?.playlist[0]?.start_ts,
        data?.playlist[0]?.duration
      )

      if (!data) {
        commit('setTitle', NODATA_MSG);
        return ERROR_TIME;
      }

      if (!artist && !song || timeLeft < 0) {
        commit('setTitle', DEFAULT_MSG);
        return DEFAULT_TIME;
      }

      commit('setTitle', `${artist} — ${song}`);

      return timeLeft;
    }
  }
})
