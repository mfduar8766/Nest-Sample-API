<template>
  <ion-page>
    <ion-content>
      AUTH
    </ion-content>
    <ion-button @click="goToTabs" >Go to Tabs</ion-button>
  </ion-page>
</template>

<script lang="ts" setup>
import { useRouter } from "vue-router";

const router = useRouter();

const goToTabs = () => {
  router.push({ path: '/tabs/' });
};

</script>

<style scoped>
</style>