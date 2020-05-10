<template>
  <div class="form-group">
    <div class="input-group input-group-merge" :class="className">
      <slot></slot>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    className: {}
  }
</script>

<style scoped>

</style>
