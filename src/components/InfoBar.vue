<template>
  <div id="bar" @click="copy">
    <p ref="textNode"> {{ this.title }} </p>
  </div>
</template>

<script>
import { mapState } from 'vuex';

export default {
  name: 'info-bar',
  computed: mapState(['title']),
  methods: {
    copy() {
      if (navigator.clipboard) {
        navigator.clipboard.writeText(this.title);
      } else {
        let range = document.createRange();
        range.selectNode(this.$refs.textNode);
        window.getSelection().addRange(range);
        document.execCommand('copy');
        window.getSelection().removeAllRanges();
      }
    }
  }
}
</script>

<style lang="scss" scoped>
#bar {
  display: flex;
  width: calc(70vmin - 7vmin);
  height: 6vmin;
  background-color: #222;
  vertical-align: top;
  cursor: pointer;
  overflow: hidden;
  border-radius: 1vmin;

  &:active { outline: 0.65vmin dashed #222; }
  &:hover { p { animation: none; } }

  p {
    @keyframes blink {
      0% { opacity: 1; }
      50% { opacity: 0; }
      100% { opacity: 1; }
    }

    font-size: 2.5vmin;
    margin: auto;
    color: #eaeaea;
    text-align: center;
    text-overflow: ellipsis;
    font-family: 'Ubuntu';
    white-space: nowrap;
    overflow: hidden;
    padding: 0 1vw 0 1vw;
    letter-spacing: 0.3vmin;
    -webkit-text-stroke: thin;
    user-select: initial;
    text-rendering: geometricPrecision;
    animation: blink 2s ease infinite;
  }
}
</style>