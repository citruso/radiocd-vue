<template>
  <div id="knob">
    <div id="up" @click="setVolumeUP"></div>
    <div id="down" @click="setVolumeDOWN"></div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';

export default {
  name: 'volume-knob',
  methods: mapMutations([
    'setVolumeUP',
    'setVolumeDOWN'
  ])
}
</script>

<style lang="scss" scoped>
#knob {
  width: 6vmin;
  display: flex;
  background-color: #222;
  margin-left: 1vmin;
  cursor: pointer;
  border-radius: 1vmin;
  -webkit-tap-highlight-color: transparent;

  #up, #down {
    position: absolute;
    width: 6vmin;
    height: 3vmin;
    background: url(../assets/st.svg) no-repeat center;
    background-size: contain;

    &:active { transform: scale(0.9); }
  }
  #down {
    align-self: flex-end;
    transform: rotate(180deg);

    &:active { transform: scale(0.9) rotate(180deg); }
  }
}
</style>