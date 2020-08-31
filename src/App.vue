<template>
  <div id="app">
    <div id="player">
      <Disc />
      <InfoBar />
      <VolumeKnob />
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

import Disc from './components/Disc';
import InfoBar from './components/InfoBar';
import VolumeKnob from './components/VolumeKnob';

export default {
  name: 'App',
  components: {
    Disc,
    InfoBar,
    VolumeKnob
  },
  methods: mapMutations(['setConfig']),
  created() {
    this.setConfig();
  }
}
</script>

<style lang="scss">
*, *:before, *:after {
  margin: 0;
  padding: 0;
}
#app {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  overflow-y: hidden;
  user-select: none;
  background: -webkit-linear-gradient(bottom, #dddceb 0%, #e6c07a 75%);
  background: linear-gradient(to top, #dddceb 0%, #e6c07a 75%);
}
#player {
  position: absolute;
  display: flex;
  flex-wrap: wrap;
  width: min-content;
  padding: 3vmin;
  background-color: #af8740; /*#987536*/
  border: 0.5vmin solid rgba(0, 0, 0, 0.2);
  -webkit-border-radius: 2vmin;
  border-radius: 2vmin;
  -webkit-box-shadow: 1.5vmin 1vmin rgba(0, 0, 0, 0.2);
  box-shadow: 1.5vmin 1vmin rgba(0, 0, 0, 0.2);
}
</style>
