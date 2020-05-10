<template>
  <input class="form-control"
         v-bind:value="value"
         @blur="onBlurInput"
         v-on:input="$emit('input', $event.target.value)"
         :class="className" :placeholder="placeHolder"

         :type="inputType">
</template>

<script>
  export default {
    name: 'index',
    methods:{
      onBlurInput(){
          this.$emit("onBlurInput")
      }
    },
    props:{
      value: {
        type: String
      },
      className:{
        required:false
      },
      inputType:{
        required:false,
        type:String
      },
      placeHolder:{
        type:String,
        required: false
      }
    }
  }
</script>

<style scoped>

</style>
