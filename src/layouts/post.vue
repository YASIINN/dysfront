<template>
  <div>
    <postnav></postnav>
    <div class="main-content" id="panel">
      <postheader></postheader>
      <postsubheader></postsubheader>
      <div class="container-fluid mt--6">
        <div>
          <router-view></router-view>
        </div>
        <br/><br/>
        <postfooter></postfooter>
      </div>
    </div>
  </div>
</template>

<script>
  import Postheader from '../components/shared/postheader'
  import Postsubheader from '../components/shared/postsubheader'
  import Pagefooter from '../components/shared/pagefooter'
  import Postnav from '../components/shared/postnav'
  import Postfooter from '../components/shared/postfooter'

  export default {
    name: 'post',
    components: { Postfooter, Postnav, Pagefooter, Postsubheader, Postheader }
  }
</script>

<style scoped>

</style>
