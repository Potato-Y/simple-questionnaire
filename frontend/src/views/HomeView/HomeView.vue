<template>
  <SurveyItems id="survey-items" />
</template>

<script>
// @ is an alias to /src
import SurveyItems from "../../components/SurveyItems/SurveyItems.vue";

export default {
  name: "HomeView",
  components: {
    SurveyItems,
  },
};
</script>

<style>
#survey-items {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
