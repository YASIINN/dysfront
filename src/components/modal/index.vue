<template>
  <div class="modal fade" id="myModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel"
       aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered  modal-lg" role="document">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title" id="exampleModalLabel">{{modalTitle}}</h5>
          <!--      <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>-->
        </div>
        <div class="modal-body">
          <slot/>
        </div>
        <div class="modal-footer">
          <button type="button" v-if="modalCloseBtnVisible" class="btn btn-secondary" data-dismiss="modal"
                  @click="onCloseModal">{{modalCloseBtnText}}
          </button>
          <button type="button" v-if="modalSaveBtnVisible" class="btn btn-primary" @click="onClickSave">
            {{modalSaveBtnText}}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
  export default {
    created () {
      $('#myModal').modal({ backdrop: 'static', keyboard: false })
    },
    methods: {
      onCloseModal () {
        this.$emit('onCloseModal')
      },
      onClickSave () {
        $('#myModal').modal('hide')
        this.$emit('onClick')
      }
    },
    name: 'index',
    props: {
      modalTitle: {
        type: String
      },
      modalCloseBtnText: {
        type: String
      },
      modalSaveBtnText: {
        type: String
      },
      modalCloseBtnVisible: {
        type: Boolean
      },
      modalSaveBtnVisible: {
        type: Boolean
      }
    }
  }
</script>

<style scoped>

</style>
