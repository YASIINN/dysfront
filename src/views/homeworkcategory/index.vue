<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" :headerTitle="'Ödev Türü Ekle'">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-8  col-sm-8 col-lg-8">

              <div class="form-group">
                <div class="input-group input-group-merge">
                  <v-input
                    v-model.trim="homeworkcatData.catname"
                    :placeHolder="'Ödev Türü Giriniz'"
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
                @onClick="onHomeWorkCategoryValidate($event)"
              ></v-button>
            </div>
          </div>
        </div>
      </div>
    </flex-card>

    <flex column="col-md-12  col-sm-12 col-lg-12">
      <div class="card">
        <div class="card-header border-0">
          <h3 class="mb-0">Ödev Türü Listesi</h3>

        </div>
        <div class="table-responsive">
          <v-table
            :detailVisible="false"
            :edit-visible="true"
            :del-visible="true"
            @edClick="editClick($event)"
            @delClick="deleteClick($event)"
            :columns="$store.getters.getHomeWorkCategoryHeader"
            :rows="$store.getters.getHomeWorkCategory"
            :table-title="$store.getters.getHomeWorkCategoryHeader"
          >
          </v-table>
        </div>
      </div>
    </flex>
  </div>
</template>

<script>
  import VTable from '@/components/table'
  import {
    Loading,
    FlexCard,
    Flex,
    VButton,
    VInput,
    Swal,
    appPlugin
  } from '@/Providers/defaultImports'
  import {
    CREATE_HOME_WORK_CATEGORY,
    DELETE_HOME_WORK_CATEGORY,
    FETCH_HOME_WORK_CATEGORY, UPDATE_HOME_WORK_CATEGORY
  } from '../../store/modules/homeworkcategory/moduleNames'
  import { CREATE_POST_TAG, DELETE_POST_TAG, UPDATE_POST_TAG } from '../../store/modules/posttag/moduleNames'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    name: 'index',
    created () {
      this.fetchHomeWorkCategory()
    },
    methods: {
      onCancel () {
        this.dataselected = false
        this.homeworkcatData = {
          id: '',
          catname: ''
        }
      },
      editClick (data) {
        debugger
        this.dataselected = true
        this.homeworkcatData = {
          id: data.item.id,
          catname: data.item.hCatName,
        }
      },
      onUpdate () {
        debugger
        if (this.homeworkcatData.catname.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Ödev Tür Adı Giriniz', 'info', this.$t('ok'))
        } else {
          this.onOpenIndıcator()
          this.$store.dispatch(UPDATE_HOME_WORK_CATEGORY, {
            id: this.homeworkcatData.id,
            hcatname: this.homeworkcatData.catname
          }).then((res) => {
            if (res.status == 204) {
              appPlugin.showalert(this.$t('userinfo'), 'Ödev Tür Adı  Daha Önce Kullanıldı', 'success', this.$t('ok'))
            } else {
              appPlugin.showalert(this.$t('userinfo'), this.$t('updateSuccesMsg'), 'success', this.$t('ok'))
            }
            this.homeworkcatData = {
              id: '',
              catname: ''
            }
            this.onCloseIndıcator()
          }).catch((err) => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('updateErrorMsg'), 'error', this.$t('ok'))
          })
        }
      },
      deleteClick (data) {
        debugger
        Swal.fire({
          title:
            'Ödev Türü Adı :' + data.item.hCatName + ' ' + '\n' + this.$t('sureDelete'),
          confirmButtonText: this.$t('yes'),
          confirmButtonColor: 'red',
          cancelButtonText: this.$t('cancel'),
          icon: 'warning',
          showCancelButton: true
        }).then(res => {
          if (res.value) {
            this.onOpenIndıcator()

            this.$store
              .dispatch(DELETE_HOME_WORK_CATEGORY, {
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
      onHomeWorkCategoryValidate () {
        if (this.homeworkcatData.catname.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Ödev Tür Adı Giriniz', 'info', this.$t('ok'))
        } else {
          this.onOpenIndıcator()
          this.$store.dispatch(CREATE_HOME_WORK_CATEGORY, {
            hcatname: this.homeworkcatData.catname
          }).then((res) => {
            if (res.status == 204) {
              appPlugin.showalert(this.$t('userinfo'), 'Ödev Tür Adı Daha Önce Kullanıldı', 'success', this.$t('ok'))
            } else {
              appPlugin.showalert(this.$t('userinfo'), this.$t('succescreatemessage'), 'success', this.$t('ok'))
            }
            this.homeworkcatData = {
              id: '',
              catname: ''
            }
            this.onCloseIndıcator()
          }).catch((err) => {
            this.onCloseIndıcator()
            appPlugin.showalert(this.$t('warning'), this.$t('errorcreatemessage'), 'error', this.$t('ok'))
          })
        }
      },
      fetchHomeWorkCategory () {
        this.onOpenIndıcator()
        this.$store.dispatch(FETCH_HOME_WORK_CATEGORY).then((res) => {
          this.onCloseIndıcator()
        }).catch((err) => {
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
        })
      }
    },
    data () {
      return {
        dataselected: false,
        homeworkcatData: {
          id: '',
          catname: ''
        },
      }
    },
    components: {
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
