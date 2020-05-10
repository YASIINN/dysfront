<template>
  <div
    v-show="active"
    :id="id || title"
    :class="{ active: active }"
    :aria-expanded="active"
    class="tab-pane"
  >
    <slot/>
  </div>
</template>
<script>
export default {
  name: 'ATabPane',
  props: {
    title: {
      type: String,
      default: ''
    },
    id: {
      type: [Number, String],
      default: null
    }
  },
  inject: ['addTab', 'removeTab'],
  data () {
    return {
      active: false
    }
  },
  watch: {
    active(v){
      if(v) {

      this.$emit("getId", this.id)
      }

    }
  },
  mounted () {
    this.addTab(this)
  },
  destroyed () {
    if (this.$el && this.$el.parentNode) {
      this.$el.parentNode.removeChild(this.$el)
    }
    this.removeTab(this)
  }
}
</script>
<style></style>
