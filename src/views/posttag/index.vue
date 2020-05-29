<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" :headerTitle="'Paylaşım Etiketi Ekle'">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-4  col-sm-4 col-lg-4">

              <div class="input-group input-group-merge">
                <div class="form__field">
                  <div class="form__label">
                    <strong>Paylaşım Etiketinin Rengini Seçiniz (Etiket Yazısı Beyaz Renkte Olacaktır)</strong>
                  </div>
                  <div class="form__input">
                    <swatches
                      inline
                      v-model="posttagData.color"
                      :colors="colors"
                      row-length="6"
                      shapes="circles"
                      show-border
                    ></swatches>
                  </div>
                </div>
              </div>
            </div>
            <div class="col-md-4  col-sm-4 col-lg-4">

              <div class="form-group">
                <div class="input-group input-group-merge">
                  <v-input
                    v-model.trim="posttagData.tagname"
                    :placeHolder="'Etiket Adı Giriniz'"
                    :inputType="'text'"
                  ></v-input>
                </div>
              </div>
            </div>
            <div class="col-md-4  col-sm-4 col-lg-4">
              <v-button
                :btnIcon="'fa-edit'"
                :className="'btn-info btn-sm'"
                v-if="dataselected"
                :btnName="$t('update')"
                @onClick="onUpdate($event)"
              ></v-button>
              <v-button
                :btnIcon="'fa-times'"
                :className="'btn-danger btn-sm'"
                v-if="dataselected"
                :btnName="$t('cancel')"
                @onClick="onCancel($event)"
              ></v-button>
              <v-button
                :btnIcon="'fa-plus-circle'"
                :className="'btn-primary'"
                v-if="!dataselected"
                :btnName="$t('add')"
                @onClick="onPosTagValidate($event)"
              ></v-button>
            </div>
          </div>
        </div>
      </div>
    </flex-card>

    <flex column="col-md-12  col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <h3 class="mb-0">Etiket Listesi</h3>

        </div>
        <div class="table-responsive">
          <v-table
            :detailVisible="false"
            :edit-visible="true"
            :del-visible="true"
            @edClick="editClick($event)"
            @delClick="deleteClick($event)"
            :columns="$store.getters.getPostTagHeader"
            :rows="$store.getters.getPostTag"
            :table-title="$store.getters.getPostTagHeader"
          >
          </v-table>
        </div>
      </div>
    </flex>
  </div>
</template>

<script>
  import Swatches from 'vue-swatches'
  import VTable from '@/components/table'
  import 'vue-swatches/dist/vue-swatches.min.css'
  import {
    Loading,
    FlexCard,
    Flex,
    VButton,
    required,
    VInput,
    Swal,
    appPlugin
  } from '@/Providers/defaultImports'
  import { Colors } from '@/Providers/appConstants'
  import {
    CREATE_POST_TAG,
    DELETE_POST_TAG,
    FETCH_ALL_POST_TAG,
    UPDATE_POST_TAG
  } from '@/store/modules/posttag/moduleNames'
  import loadingMixins from '@/mixins/loading'

  export default {
    name: 'index',
    mixins: [loadingMixins],
    created () {
      this.getPostTags()
    },
    methods: {
      onCancel () {
        this.dataselected = false
        this.posttagData = {
          id: '',
          color: '',
          tagname: ''
        }
      },
      onUpdate () {
        debugger
        if (this.posttagData.color == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Etiket Rengi Seçiniz', 'info', this.$t('ok'))
        } else if (this.posttagData.tagname.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Etiket Adı Giriniz', 'info', this.$t('ok'))
        } else {
          this.onOpenIndıcator()
          this.$store.dispatch(UPDATE_POST_TAG, {
            id: this.posttagData.id,
            color: this.posttagData.color,
            tagname: this.posttagData.tagname
          }).then((res) => {
            if (res.status == 204) {
              appPlugin.showalert(this.$t('userinfo'), 'Etiket Adı veya Rengi Daha Önce Kullanıldı', 'success', this.$t('ok'))
            } else {
              appPlugin.showalert(this.$t('userinfo'), this.$t('updateSuccesMsg'), 'success', this.$t('ok'))
            }
            this.posttagData = {
              id: '',
              color: '',
              tagname: ''
            }
            this.onCloseIndıcator()
          }).catch((err) => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('updateErrorMsg'), 'error', this.$t('ok'))
          })
        }
      },
      onPosTagValidate () {
        if (this.posttagData.color == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Etiket Rengi Seçiniz', 'info', this.$t('ok'))
        } else if (this.posttagData.tagname.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Etiket Adı Giriniz', 'info', this.$t('ok'))
        } else {
          this.onOpenIndıcator()
          this.$store.dispatch(CREATE_POST_TAG, {
            color: this.posttagData.color,
            tagname: this.posttagData.tagname
          }).then((res) => {
            if (res.status == 204) {
              appPlugin.showalert(this.$t('userinfo'), 'Etiket Adı veya Rengi Daha Önce Kullanıldı', 'success', this.$t('ok'))
            } else {
              appPlugin.showalert(this.$t('userinfo'), this.$t('succescreatemessage'), 'success', this.$t('ok'))
            }
            this.posttagData = {
              id: '',
              color: '',
              tagname: ''
            }
            this.onCloseIndıcator()
          }).catch((err) => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('errorcreatemessage'), 'error', this.$t('ok'))
          })
        }
      },
      deleteClick (data) {
        debugger
        Swal.fire({
          title:
            'Etiket Adı :' + data.item.tagName + ' ' + '\n' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('cancel'),
          icon: 'warning',
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()

            this.$store
              .dispatch(DELETE_POST_TAG, {
                id: data.item.id,
                index: data.i
              })
              .then(res => {
                if (res.status) {
                  if (res.status === 200) {
                    appPlugin.showalert(
                      this.$t('deleteRecordMsg'),
                      '',
                      'success',
                      this.$t('ok')
                    )
                  }
                } else {
                  appPlugin.showalert(
                    this.$t('deleteRecordErrMsg'),
                    '',
                    'error',
                    this.$t('ok')
                  )
                }

                this.onCloseIndıcator()
              })
          }
        })
      },
      editClick (data) {
        debugger
        this.dataselected = true
        this.posttagData = {
          id: data.item.id,
          color: data.item.color,
          tagname: data.item.tagName
        }
      },
      getPostTags () {
        this.onOpenIndıcator()
        this.$store.dispatch(FETCH_ALL_POST_TAG).then((res) => {
          this.onCloseIndıcator()
          if (res.status == 200) {
          }
        }).catch((err) => {
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
        })

      }
    },
    data () {
      return {
        dataselected: false,
        posttagData: {
          id: '',
          color: '',
          tagname: ''
        },
        colors: Colors
      }
    },
    components: {
      Swatches,
      VTable,
      FlexCard,
      Flex,
      Loading,
      VInput,
      VButton,
    },
  }
</script>

<style scoped>

</style>
