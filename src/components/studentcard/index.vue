<template>
  <div class="card card-stats">
    <div class="card-body">
      <div class="row">
        <div class="col">
          <h5 class="card-title text-uppercase text-muted mb-0">Öğrenci Bilgileri</h5>
          <span class="h2 font-weight-bold mb-0">{{fullname.toUpperCase()}}</span>
          <p class="text">Okulu : {{schoolname}}</p>
          <p class="text">Sınıfı:{{classname}} </p>
          <p class="text">Şubesi: {{branchname}} </p>

        </div>
        <div class="col-auto">
          <div class="icon icon-shape bg-gradient-primary text-white rounded-circle shadow">
            <i class="fa fa-user-graduate"></i>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    props:{
      fullname:{},
      schoolname:{},
      classname:{},
      branchname:{}
    },
    name: 'index'
  }
</script>

<style scoped>

</style>
