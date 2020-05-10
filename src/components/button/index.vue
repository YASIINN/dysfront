<template>
  <button
    class="btn btn-icon"
    :style="btnStyle"
    :class="className"
    type="button"
    @click="onCreateHandler"
  >
    <span class="btn-inner--icon"><i class="fa  " :class="btnIcon"></i></span>
    <span class="btn-inner--text">{{ btnName }}</span>
  </button>
</template>

<script>
export default {
  name: "index",
  props: {
    className: {
      type: String
    },
    btnName: {
      type: String,
      required: false
    },
    btnIcon: {
      type: String
    },
    btnStyle: {
      type: String
    }
  },
  methods: {
    onCreateHandler() {
      this.$emit("onClick");
    }
  }
};
</script>

<style scoped></style>
