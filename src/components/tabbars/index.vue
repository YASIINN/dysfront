<template>
  <div v-if="show">
    <div class="nav-wrapper">
      <ul
        class="nav nav-pills nav-fill flex-column flex-md-row"
        id="tabs-icons-text"
        role="tablist"
      >
        <li
          class="nav-item"
          v-for="(item, i) in $slots.default"
          @click="onActiveTab(i, item)"
        >
          <a
            class="nav-link mb-sm-3 mb-md-0"
            @click="setClass(i, item)"
            :class="i == defaultShow ? 'active' : ''"
            :id="i"
            data-toggle="tab"
            :href="'#' + i"
            role="tab"
            :aria-controls="i"
            aria-selected="true"
          >
            <i :class="item.componentOptions.propsData.icon"></i>
            {{ item.componentOptions.propsData.title }}
          </a>
        </li>
      </ul>
    </div>
    <div class="card shadow">
      <div class="card-body">
        <div class="tab-content" id="myTabContent">
          <slot></slot>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "index",
  data() {
    return {
      defaultShow: 0
    };
  },
  props: {
    show: {
      default: true
    },
    activeTab: ""
  },
  methods: {
    onActiveTab(i, item) {
      this.$emit("onActiveTab", item, i);
    },
    setClass(index, item) {
      this.$slots.default.forEach((vnode, i) => {
        if (i != index) {
          vnode.elm.className = "tab-pane fade";
        } else {
          vnode.elm.className = "tab-pane fade show active";
        }
      });
    }
  },
  mounted() {
    if (this.activeTab != undefined && this.activeTab != "") {
      let index = 0;

      this.$slots.default.forEach((vnode, i) => {
        if (
          vnode.componentOptions &&
          vnode.componentOptions.propsData != undefined
        ) {
          if (vnode.componentOptions.propsData.tabKey == this.activeTab) {
            index = i;
          }
        }
      });
      this.defaultShow = index;
      this.$slots.default[this.defaultShow].elm.className =
        "tab-pane fade show active";
    } else {
      this.$slots.default[this.defaultShow].elm.className =
        "tab-pane fade show active";
    }
  }
};
</script>

<style></style>
