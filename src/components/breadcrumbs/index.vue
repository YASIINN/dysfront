<template>
  <nav aria-label="breadcrumb" class="d-none d-md-inline-block ml-md-4">
    <ol class="breadcrumb breadcrumb-links breadcrumb-dark">
      <li class="breadcrumb-item">
        <a href="#">
          <i class="fas fa-home"></i>
        </a>
      </li>
      <li class="breadcrumb-item">
        <router-link tag="a" to="/">AnaSayfa</router-link>
      </li>
      <li
        class="breadcrumb-item"
        :class="{'active':i==crumbs.length-1?'active':''}"
        v-for="(item,i) in crumbs"
      >
        <router-link tag="a" :to="item.to">{{item.text}}</router-link>
      </li>
    </ol>
  </nav>
</template>

<script>
export default {
  computed: {
    crumbs: function() {
      return this.$route.meta.breadCrumbs;
    }
  },
  methods: {
    handleRoute(item) {}
  },
  created() {},
  name: "index"
};
</script>

<style scoped>
</style>
