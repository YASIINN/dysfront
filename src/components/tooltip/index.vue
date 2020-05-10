<template>
  <button type="button" @click="onClickBtn" class="btn btn-sm " :class="className"  data-toggle="tooltip" data-placement="top" :title="title">
      {{text}}
  </button>
</template>

<script>
  export default {
    name: 'index',
    methods:{
      onClickBtn(){
        this.$emit("onClick")
      }
      },
    props:{
      className:{

      },
      text:{
        type:String
      },
      title:{
        type:String
      }
    }
  }
</script>

<style scoped>

</style>
