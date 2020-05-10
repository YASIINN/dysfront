<template>
  <div
    v-if="show"
    class="tab-pane fade"
    style="padding-top: 10px"
    role="tabpanel"
    aria-labelledby="tabs-icons-text-1-tab"
  >
    <slot></slot>
  </div>
</template>

<script>
export default {
  name: "index",
  props: {
    show:{
      default:true
    },
    tabKey: {
      type: String
    },
    icon: {
    },
    title: {
      type: String
    }
  }
};
</script>

<style scoped>
</style>
