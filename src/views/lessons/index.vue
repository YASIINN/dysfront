<template>
  <div>
    <lessoncreate @onCancelUpdate="onCancel($event)" @onSuccesCreate="onReset($event)" @onSuccesUpdate="onReset($event)"
                  :onUpdateSelect="selectedData"></lessoncreate>
    <lessonlist @onSelectData="editedModeData($event)"
                @onRefresh="onRefreshComplate($event)"
                :onreset="resettable"
    ></lessonlist>

  </div>
</template>

<script>
  import lessonlist from './partial/lessonlisttable'
  import lessoncreate from './partial/createlesson'

  export default {
    name: 'index',
    components: {
      lessonlist,
      lessoncreate
    },
    watch: {
      resettable: function (val) {
        this.resettable = val
      },
    },
    data () {
      return {
        selectedData: {},
        resettable: false,
      }
    },
    methods: {
      onCancel ($event) {
        this.selectedData = {}
      },
      onReset ($event) {
        this.resettable = $event
      },
      onRefreshComplate ($event) {
        this.resettable = false
      },
      editedModeData (data) {
        this.selectedData = data
      },

    }
  }
</script>

<style scoped>
</style>
