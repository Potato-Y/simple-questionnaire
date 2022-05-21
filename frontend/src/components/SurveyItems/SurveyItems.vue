<template>
  <div class="contents-box">
    <div id="comment">
      이벤트 내용들이 이 곳에 추가됩니다. 이 곳을 편집하여 내용을 추가해 주세요.
    </div>

    <div class="input-box">
      <it-input
        v-model="inputName"
        label-top="이름"
        placeholder="이름을 입력하세요."
        style="font-family: Nanum Gothic"
      >
      </it-input>
    </div>

    <div class="input-box">
      <it-input
        v-model="inputNumber"
        label-top="전화번호"
        placeholder="전화번호를 입력하세요."
        style="font-family: Nanum Gothic"
      ></it-input>
    </div>

    <div class="input-box">
      <it-checkbox type="primary" v-model="privacyConsent"
        >개인정보 수집 및 처리 동의</it-checkbox
      >
      <button
        id="privacy-policy-modal-open-button"
        @click="privacyPolicyModal = true"
      >
        개인정보 처리방침
      </button>
      <div id="privacy-policy-modal">
        <it-modal id="privacy-policy-modals" v-model="privacyPolicyModal">
          <p id="privacy-policy-modal-title">개인정보 처리방침</p>
          <div id="privacy-policy-modal-contents">
            <PrivacyPolicyContents />
          </div>
          <it-button
            id="privacy-policy-modal-close-button"
            @click="privacyPolicyModal = false"
          >
            닫기
          </it-button>
        </it-modal>
      </div>
    </div>

    <it-button id="send-button" type="primary">완료</it-button>
  </div>
</template>

<script>
import PrivacyPolicyContents from "./PrivacyPolicyContents.vue";

export default {
  name: "SurveyItems",
  components: {
    PrivacyPolicyContents,
  },
  data() {
    return {
      inputName: "",
      inputNumber: "",
      privacyConsent: false,
      privacyPolicyModal: false,
    };
  },
};
</script>

<style>
@import url("./SurveyItems.css");
</style>