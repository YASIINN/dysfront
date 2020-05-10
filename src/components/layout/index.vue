<template>
  <div class="row">
    <div :class="column">
      <slot />
    </div>
  </div>
</template>


<script>
export default {
  props: {
    column: {}
  }
};
</script>
