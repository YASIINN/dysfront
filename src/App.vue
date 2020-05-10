<template>
  <div>
    <component :is="layout">
      <slot></slot>
    </component>
    <WishScreen/>
    <button type="button" data-backdrop="static" data-keyboard="false" class="btn btn-sm btn-white wish"
            data-toggle="modal" data-target="#myModal"
            data-placement="top" title="Şikayet ve Önerileriniz İçin..">
      <i class="fa fa-info-circle">
      </i>
      Yardım
    </button>

  </div>
</template>


<script>
  import MainLayout from './layouts/main'
  import LoginLayout from './layouts/login'
  import PostLayout from './layouts/post'
  import WishScreen from '@/views/wishes/create'

  export default {
    components: {
      WishScreen
    },
    computed: {
      layout () {
        if (this.$route.meta.layout) {
          if (this.$route.meta.layout == 'login') {
            return LoginLayout
          } else if (this.$route.meta.layout == 'post') {
            return PostLayout
          }
        } else {
          return MainLayout
        }
        // return  || "main";
      }
    }
  }
</script>


<style>
  .wish {
    cursor: pointer !important;
    position: fixed;
    bottom: 0px;
    right: 0px;
    z-index: 99999999;

  }

  input {
    border: 1px solid silver;
    border-radius: 4px;
    background: white;
    padding: 5px 10px;
  }

  .dirty {
    border-color: #5a5;
    background: #efe;
  }

  .dirty:focus {
    outline-color: #8e8;
  }

  .error {
    border-color: red;
    background: #fdd;
  }

  .error:focus {
    outline-color: #f99;
  }
</style>


