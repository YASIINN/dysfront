<template>
  <div class="card-body">
    <div :id="collapseID" class="panel-collapse collapse">
      <slot></slot>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    collapseID: {
      type: String
    }
  }
};
</script>
