<template>
  <div class="card panel-group">
    <div class="panel panel-default">
      <div class="panel-heading">
        <h4 class="panel-title">
          <div class="card-header">
            <a
              data-toggle="collapse"
              :href="'#'+collapseHref"
              @click="getPanelStatus"
            >{{collapseTitle}}</a>
          </div>
        </h4>
      </div>
      <slot></slot>
    </div>
  </div>
</template>

<script>
export default {
  methods: {
    getPanelStatus(event) {
      this.$emit("onClick", event.target.getAttribute("aria-expanded"));
      //
    }
  },
  props: {
    collapseTitle: {
      type: String
    },
    collapseHref: {}
  }
};
</script>
