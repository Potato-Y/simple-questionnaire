<template>
  <div id="title-bar" style="z-index: 1" ref="title_bar">
    <p id="title-text">Simple Questionnaire</p>
  </div>

  <!-- 페이지 내용이 타이틀에 가려지지 않도록 -->
  <div v-bind:style="{ height: titleBarHeight + 'px' }"></div>
</template>

<script>
export default {
  name: "TitleBar",
  data() {
    return {
      titleBarHeight: 0,
    };
  },
  methods: {
    getTitleBarHeight() {
      this.titleBarHeight = this.$refs.title_bar.clientHeight;
    },
  },
  mounted() {
    this.getTitleBarHeight();
  },
};
</script>

<style>
#title-bar {
  position: fixed;
  width: 100%;
  height: 55px;
  background-color: rgba(255, 255, 255, 0.406);
  border-bottom: 1px solid rgba(232, 232, 232, 0.495);
  backdrop-filter: blur(30px);
}

#title-text {
  position: relative;
  top: 50%;
  text-align: center;
  transform: translateY(-60%);
  font-family: "Nanum Gothic";
  font-size: 25px;
  font-weight: bolder;
}
</style>