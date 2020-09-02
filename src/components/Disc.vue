<template>
  <div
    id="disc"
    :style="{ 'animation-play-state': playing ? 'running' : 'paused' }"
    @click="togglePlay"
    @click.once="loop"
  ></div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  name: 'disc',
  computed: mapState(['playing']),
  methods: mapActions(['togglePlay', 'loop'])
}
</script>

<style lang="scss" scoped>
#disc {
  @keyframes rotate {
    to { transform: rotate(360deg); }
  }

  width: 70vmin;
  height: 70vmin;
  cursor: pointer;
  border-radius: 50%;
  margin-bottom: 3vmin;
  background: url(../assets/disc.svg) no-repeat center;
  -webkit-tap-highlight-color: transparent;
  animation: rotate 5s linear infinite;
}
</style>
