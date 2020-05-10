<template>
  <div class="col-md-12">
    <div class="form-group">
      <div class="input-group input-group-merge">
        <input class="form-control" @input="onSearch" v-model="searchTxt" :placeholder="placeHolderTxt" type="text">
        <div class="input-group-append">
          <span class="input-group-text"><i class="fas fa-search"></i></span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        searchTxt: ''
      }
    },
    props: ['placeHolderTxt'],
    methods: {
      onSearch () {
        this.$emit('search', this.searchTxt)
      }
    }
  }
</script>

<style scoped>

</style>
