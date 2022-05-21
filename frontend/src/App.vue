<template>
  <TitleBar />
  <router-view />
  <!-- <nav>
    <router-link to="/">Home</router-link> |
    <router-link to="/about">About</router-link>
  </nav> -->
</template>

<script>
import TitleBar from "./components/TitleBar.vue";
export default {
  components: { TitleBar },
};
</script>

<style>
@import url("./reset.css");
@import url(//fonts.googleapis.com/earlyaccess/nanumgothic.css);

.nanumgothic * {
  font-family: "Nanum Gothic", sans-serif;
}

body {
  background-color: #fff7e5;
  font-family: "Nanum Gothic";
}
</style>
