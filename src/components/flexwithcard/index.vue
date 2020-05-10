<template>
  <div class="row">
    <div :class="column">
      <div class="card-wrapper">
        <div class="card">
          <div class="card-header">
            <h3 class="mb-0">{{headerTitle}}</h3>
          </div>
          <slot />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: { headerTitle: {}, column: {} }
};
</script>
