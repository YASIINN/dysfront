<template>
  <a
    style="cursor:pointer !important"
    class="table-action"
    data-toggle="tooltip"
    :data-original-title="title"
    @click="clickHandler"
  >
    <i
      class="fas"
      style="cursor:pointer !important"
      :class="icon"
      :style="{ color: btnColor }"
    ></i>
  </a>
</template>

<script>
export default {
  name: "index",
  props: {
    title: {
      type: String,
      required: true
    },
    icon: {
      type: String,
      required: true
    },
    btnColor: {
      type: String,
      required: false
    }
  },
  methods: {
    clickHandler() {
      this.$emit("onClick");
    }
  }
};
</script>

<style scoped></style>
