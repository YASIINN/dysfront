<template>
  <div>
    <pagenav></pagenav>
    <div class="main-content" id="panel">
      <pageheader></pageheader>
      <pagesubheader></pagesubheader>
      <div class="container-fluid mt--6">
        <div>
          <router-view></router-view>
        </div>
        <pagefooter></pagefooter>
      </div>
    </div>
  </div>
</template>

<script>
import Pagenav from "@/components/shared/pagenav";
import Pageheader from "@/components/shared/pageheader";
import Pagesubheader from "@/components/shared/pagesubheader";
import Pagefooter from "@/components/shared/pagefooter";
export default {
  name: "mainLayout",
  components: { Pagefooter, Pagesubheader, Pageheader, Pagenav }
};
</script>

<style scoped>
</style>
