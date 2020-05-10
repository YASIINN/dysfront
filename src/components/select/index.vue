<template>
  <select class="form-control" data-toggle="select" @blur="onBlur" @change="changeOption" :class="className" :value="value"
          @input="$emit('input', $event.target.value)"
  >
    <option v-for="item in optionData" v-bind:value="item[bindData]">
      {{ item[propName] }}
    </option>
  </select>
</template>

<script>
  export default {
    name: 'index',
    methods: {
      onBlur () {
        this.$emit('onBlur')
      },
      changeOption(){
        this.$emit("changeOption")
      }
    },
    props: {
      value: {
      },
      propName: {
        required:true
      },
      bindData: {
        required:true
      },
      optionData: {
        required: true
      },
      className: {
      },
    }
  }
</script>

<style scoped>

</style>
