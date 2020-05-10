<template>
  <div class="alert  alert-dismissible fade show" :class="className" role="alert">
    <span class="alert-inner--icon"><i :class="iconName"></i></span>
    <span class="alert-inner--text"><slot></slot>
    </span>
    <button type="button" class="close" @click="onClose"  aria-label="Close">
      <span aria-hidden="true">&times;</span>
    </button>
  </div>
</template>

<script>
  export default {
    name: 'index',
    methods:{
      onClose(){
        this.$emit("onClose")
      }
    },
    props: {
      className: {},
      iconName: {
        type: String
      }
    }
  }
</script>

<style scoped>

</style>
