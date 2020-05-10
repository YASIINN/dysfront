<template>
  <flex-card column="col-md-12 col-sm-12 col-lg-12" :headerTitle="$t('createlesson')">
    <div class="card-body">
      <div>
        <div class="row">
          <div class="col-md-4 col-sm-4 col-lg-4">
            <div class="form-group">
              <div
                class="input-group input-group-merge"
                :class="{'has-danger':$v.lessonData.code.$error}"
              >
                <v-input
                  @onBlurInput="$v.lessonData.code.$touch"
                  v-model.trim="$v.lessonData.code.$model"
                  :className="{'is-invalid':$v.lessonData.code.$error}"
                  :placeHolder="$t('enterlessoncode')"
                  :inputType="'text'"
                ></v-input>
                <div class="invalid-feedback">
                  <small v-if="!$v.lessonData.code.required">{{$t('pleaseenterlessoncode')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8 col-sm-8 col-lg-8">
            <div class="form-group">
              <div
                class="input-group input-group-merge"
                :class="{'has-danger':$v.lessonData.name.$error}"
              >
                <v-input
                  @onBlurInput="$v.lessonData.name.$touch"
                  v-model.trim="$v.lessonData.name.$model"
                  :className="{'is-invalid':$v.lessonData.name.$error}"
                  :placeHolder="$t('enterlessonname')"
                  :inputType="'text'"
                ></v-input>
                <div class="invalid-feedback">
                  <small v-if="!$v.lessonData.name.required">{{$t('pleaseenterlessonname')}}</small>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="custom-control custom-radio mb-3">
              <input
                name="custom-radio-1"
                class="custom-control-input"
                v-model="lessonData.type"
                value="1"
                id="customRadio6"
                type="radio"
              />
              <label class="custom-control-label" for="customRadio6">{{$t('optionallesson')}}</label>
            </div>
          </div>
          <div class="col-md-6 col-sm-6 col-lg-6">
            <div class="custom-control custom-radio mb-3">
              <input
                name="custom-radio-1"
                class="custom-control-input"
                @change="onChangeLessonType"
                v-model="lessonData.type"
                value="0"
                id="customRadio5"
                type="radio"
              />
              <label class="custom-control-label" for="customRadio5">{{$t('normallesson')}}</label>
            </div>
          </div>
        </div>
        <label
          v-if="lessonData.type==1 && lessonData.name.trim()!=''"
        >{{lessonData.name}} ' {{$t('lessonsofthelesson')}}</label>

        <v-button
          :btnIcon="'fa-plus'"
          :className="'btn-primary btn-sm ml-5'"
          v-if="lessonData.type==1 && lessonData.name.trim()!=''"
          :btnName="$t('addsublesson')"
          @onClick="onAddSubLesson($event)"
        ></v-button>

        <div
          class="row"
          v-for="(v, index) in $v.subLessons.$each.$iter"
          v-if="lessonData.type==1 && lessonData.name.trim()!=''"
        >
          <div class="col-md-3 col-sm-3 col-lg-3">
            <div class="form-group" :class="{'has-danger': v.code.$error}">
              <div class="input-group input-group-merge">
                <v-input
                  @onBlurInput="v.code.$touch"
                  v-model.trim="v.code.$model"
                  :className="{'is-invalid':v.code.$error}"
                  :placeHolder="$t('enterlessoncode')"
                  :inputType="'text'"
                ></v-input>
                <div class="invalid-feedback">
                  <small v-if="!v.code.required">{{$t('pleaseenterlessoncode')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-8 col-sm-8 col-lg-8">
            <div class="form-group">
              <div class="input-group input-group-merge" :class="{'has-danger': v.name.$error}">
                <v-input
                  @onBlurInput="v.name.$touch"
                  v-model.trim="v.name.$model"
                  :className="{'is-invalid':v.name.$error}"
                  :placeHolder="$t('enterlessonname')"
                  :inputType="'text'"
                ></v-input>
                <div class="invalid-feedback">
                  <small v-if="!v.name.required">{{$t('pleaseenterlessonname')}}</small>
                </div>
              </div>
            </div>
          </div>
          <div class="col-md-2 col-sm-2 col-lg-2 pb-4">
            <v-button
              :btnIcon="'fa-check'"
              :className="'btn-success btn-sm mb-2'"
              v-if="editedMode && !v.$model.id"
              :btnName="$t('add')"
              :disabled="$v.lessonData.$invalid==false && !$v.subLessons.$invalid==false"
              @onClick="addSubLesson(index)"
            ></v-button>
            <v-button
              :btnIcon="'fa-edit'"
              :className="'btn-warning btn-sm '"
              v-if="editedMode && v.$model.id"
              :btnName="$t('update')"
              @onClick="onEditSubLesson(index)"
            ></v-button>

            <v-button
              :btnIcon="'fa-times'"
              :className="'btn-danger btn-sm '"
              v-if="editedMode"
              :btnName="$t('delete')"
              @onClick="removeSubLessons(index)"
            ></v-button>

            <v-button
              :btnIcon="'fa-times'"
              :className="'btn-danger btn-sm '"
              v-if="!editedMode"
              :btnName="$t('delete')"
              @onClick="onRemoveSubLesson(index)"
            ></v-button>
          </div>
        </div>

        <div v-if="lessonData.type==0">
          <v-button
            :btnIcon="'fa-edit'"
            :className="'btn-info float-right'"
            v-if="dataselected"
            :disabled="$v.lessonData.$invalid"
            :btnName="$t('update')"
            @onClick="onUpdate($event)"
          ></v-button>
        </div>
        <div v-else>
          <v-button
            :btnIcon="'fa-edit'"
            :className="'btn-info float-right'"
            v-if="dataselected"
            :btnName="$t('update')"
            :disabled="$v.lessonData.$invalid==false && !$v.subLessons.$invalid==false"
            @onClick="onUpdate($event)"
          ></v-button>
        </div>

        <v-button
          :btnIcon="'fa-times'"
          :className="'btn-danger float-right'"
          v-if="dataselected"
          :btnName="$t('cancel')"
          @onClick="onCancel($event)"
        ></v-button>

        <div v-if="lessonData.type==0">
          <v-button
            :btnIcon="'fa-plus-circle'"
            :className="'btn-primary float-right '"
            v-if="!dataselected"
            :btnName="$t('add')"
            :disabled="$v.lessonData.$invalid"
            @onClick="onCreateHandler($event)"
          ></v-button>
          <!--
          -->
        </div>
        <div v-else>
          <v-button
            :btnIcon="'fa-plus-circle'"
            :className="'btn-primary float-right '"
            v-if="!dataselected"
            :btnName="$t('add')"
            :disabled="$v.lessonData.$invalid==false && !$v.subLessons.$invalid==false"
            @onClick="onCreateHandler($event)"
          ></v-button>
          <!--
          -->
        </div>
      </div>
    </div>
  </flex-card>
</template>

<script>
  import {
    SearchBox,
    Loading,
    FlexCard,
    Flex,
    Vue,
    VSelect,
    VInputContainer,
    VButton,
    required,
    VInput,
    VTooltipButton,
    Vuetable,
    Swal,
    VuetablePaginationBootstrap,
    VuetablePaginationInfo,
    appPlugin
  } from '@/Providers/defaultImports'

  export default {
    components: {
      VInputContainer,
      VSelect,
      SearchBox,
      Loading,
      VButton,
      VInput,
      VTooltipButton,
      Vuetable,
      VuetablePaginationBootstrap,
      VuetablePaginationInfo,
      Flex,
      FlexCard
    },
    watch: {
      onUpdateSelect: function (data) {
        if (data.id != undefined) {
          this.select(data)

        } else {

          // this.onResetData();
        }
      }
    },
    props: {
      onUpdateSelect: {}
    },
    validations: {
      subLessons: {
        required,
        $each: {
          code: {
            required
          },
          name: {
            required
          }
        }
      },
      lessonData: {
        name: {
          required
        },
        code: {
          required
        }
      }
    },
    name: 'createlesson',
    data () {
      return {
        editedMode: false,
        lessonTxt: 'Normal Ders',
        subLessons: [
          {
            code: '',
            name: ''
          }
        ],
        fields: [],
        loading: false,
        dataselected: false,
        lessonData: {
          name: '',
          code: '',
          type: 0
        },
        selectedData: {}
      }
    },
    methods: {
      select (data) {
        this.editedMode = true
        this.dataselected = true
        this.lessonData = {
          name: data.lName,
          code: data.lCode,
          type: data.type == 'Normal' ? 0 : 1,
          id: data.id,
          pid: data.parent_id
        }
        if (data.subData) {
          this.subLessons = []
          data.subData.forEach(subData => {
            this.subLessons.push({
              parent_id: subData.parent_id,
              type: subData.type,
              code: subData.lCode,
              name: subData.lName,
              id: subData.id
            })
          })
        }
      },
      onUpdate () {
        let data
        let valid = false
        this.loading = true
        if (this.lessonData.type === 0) {
          if (this.$v.lessonData.code.$invalid) {
            valid = false
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleaseenterlessoncode'),
              'warning',
              this.$t('ok')
            )
          } else if (this.$v.lessonData.name.$invalid) {
            valid = false
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleaseenterlessonname'),
              'warning',
              this.$t('ok')
            )
          } else {
            valid = true
            data = {
              name: this.lessonData.name,
              code: this.lessonData.code,
              type: this.lessonData.type,
              id: this.lessonData.id,
              pid: this.lessonData.pid,
              urlparse: appPlugin.urlParse(
                'lName=' +
                this.lessonData.name +
                '& lCode=' +
                this.lessonData.code +
                '& parent_id=' +
                this.lessonData.type
              )
            }
          }
        } else {
          if (this.$v.lessonData.code.$invalid) {
            valid = false
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleaseenterlessoncode'),
              'warning',
              this.$t('ok')
            )
          } else if (this.$v.lessonData.name.$invalid) {
            valid = false
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleaseenterlessonname'),
              'warning',
              this.$t('ok')
            )
          } else if (this.$v.subLessons.$invalid) {
            valid = false
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleasefillinthesubcourses'),
              'warning',
              this.$t('ok')
            )
          } else {
            valid = true
            data = {
              name: this.lessonData.name,
              code: this.lessonData.code,
              type: this.lessonData.type,
              id: this.lessonData.id,
              pid: this.lessonData.pid,
              subData: this.subLessons,
              urlparse: appPlugin.urlParse(
                'lName=' +
                this.lessonData.name +
                '& lCode=' +
                this.lessonData.code +
                '& parent_id=' +
                this.lessonData.type
              )
            }
          }
        }
        if (valid == true) {
          this.$store.dispatch('updateLessons', data).then(res => {
            if (res.status) {
              if (res.status === 200) {
                this.$emit('onSuccesUpdate', true)
                appPlugin.showalert(
                  this.$t('updateSuccesMsg'),
                  '',
                  'success',
                  this.$t('ok')
                )
              } else if (res.status === 204) {
                appPlugin.showalert(
                  this.$t('warning'),
                  this.$t('lessoncodewarning'),
                  'warning',
                  this.$t('ok')
                )
              }
            } else {
              appPlugin.showalert(
                this.$t('updateErrorMsg'),
                '',
                'error',
                this.$t('ok')
              )
            }
            this.onResetData()
            this.loading = false
          })
        }
      },
      onResetData () {
        this.$emit('onCancelUpdate', {})
        this.dataselected = false
        this.selectedData = {}
        this.subLessons = [
          {
            code: '',
            name: ''
          }
        ]
        this.editedMode = false
        this.lessonData = {
          name: '',
          code: '',
          type: 0
        }
      },

      onCancel () {
        this.dataselected = !this.dataselected
        this.onResetData()
      },
      onCreateHandler () {
        if (this.lessonData.type === 0) {
          if (this.$v.lessonData.code.$invalid) {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleaseenterlessoncode'),
              'warning',
              this.$t('ok')
            )
          } else if (this.$v.lessonData.name.$invalid) {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleaseenterlessonname'),
              'warning',
              this.$t('ok')
            )
          } else {
            this.loading = true
            let data = {
              created: this.lessonData,
              urlparse: appPlugin.urlParse(
                'lName=' +
                this.lessonData.name +
                '& lCode=' +
                this.lessonData.code +
                '& parent_id=' +
                this.lessonData.type
              ),
              orqparse: appPlugin.urlParse('lCode=' + this.lessonData.code)
            }
            this.$store.dispatch('createLessons', data).then(res => {
              if (res.status) {
                if (res.status === 200) {
                  this.$emit('onSuccesCreate', true)
                  appPlugin.showalert(
                    this.$t('succescreatemessage'),
                    '',
                    'success',
                    this.$t('ok')
                  )
                  this.onResetData()
                } else if (res.status === 204) {
                  appPlugin.showalert(
                    this.$t('warning'),
                    this.$t('lessoncodewarning'),
                    'warning',
                    this.$t('ok')
                  )
                }
              } else {
                appPlugin.showalert(
                  this.$t('errorcreatemessage'),
                  '',
                  'error',
                  this.$t('ok')
                )
              }
              this.loading = false
            })
          }
        } else {
          if (this.$v.lessonData.code.$invalid) {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleaseenterlessoncode'),
              'warning',
              this.$t('ok')
            )
          } else if (this.$v.lessonData.name.$invalid) {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleaseenterlessonname'),
              'warning',
              this.$t('ok')
            )
          } else if (this.$v.subLessons.$invalid) {
            appPlugin.showalert(
              this.$t('warning'),
              this.$t('pleasefillinthesubcourses'),
              'warning',
              this.$t('ok')
            )
          } else {
            this.loading = true
            let data = {
              created: this.lessonData,
              subData: this.subLessons,
              orqparse: appPlugin.urlParse('lCode=' + this.lessonData.code),
              urlparse: appPlugin.urlParse(
                'lName=' +
                this.lessonData.name +
                '& lCode=' +
                this.lessonData.code +
                '& parent_id=' +
                this.lessonData.type
              )
            }
            this.$store.dispatch('createLessons', data).then(res => {
              if (res.status) {
                if (res.status === 200) {
                  this.$emit('onSuccesCreate', true)
                  appPlugin.showalert(
                    this.$t('succescreatemessage'),
                    '',
                    'success',
                    this.$t('ok')
                  )
                  this.onResetData()
                } else if (res.status === 204) {
                  appPlugin.showalert(
                    this.$t('lessoncodewarning'),
                    '',
                    'warning',
                    this.$t('ok')
                  )
                }
              } else {
                appPlugin.showalert(
                  this.$t('errorcreatemessage'),
                  '',
                  'error',
                  this.$t('ok')
                )
              }
              this.loading = false
            })
          }
        }
      },
      addSubLesson (index) {
        if (this.$v.lessonData.$invalid) {
          appPlugin.showalert(
            'Uyarı',
            'Dersler İle İlgili Bilgileri Doldurun',
            'error',
            'Tamam'
          )
        } else if (this.$v.subLessons.$invalid) {
          appPlugin.showalert(
            'Uyarı',
            'Alt Dersler İle İlgili Bilgileri Doldurun',
            'error',
            'Tamam'
          )
        } else {
          this.$store
            .dispatch('addSubLesson', {
              name: this.subLessons[index].name,
              code: this.subLessons[index].code,
              parent_id: this.lessonData.id,
              type: 1
            })
            .then(res => {
              if (res.status) {
                if (res.status == 200) {
                  Vue.set(this.subLessons[index], 'name', res.data.lName)
                  Vue.set(this.subLessons[index], 'code', res.data.lCode)
                  Vue.set(
                    this.subLessons[index],
                    'parent_id',
                    res.data.parent_id
                  )
                  Vue.set(this.subLessons[index], 'id', res.data.id)
                  Vue.set(this.subLessons[index], 'type', res.data.type)
                  this.$emit('onSuccesCreate', true)
                  appPlugin.showalert(
                    this.$t('succescreatemessage'),
                    '',
                    'success',
                    this.$t('ok')
                  )
                } else if (res.status == 204) {
                  appPlugin.showalert(
                    this.$t('warning'),
                    this.$t('lessoncodewarning'),
                    'warning',
                    this.$t('ok')
                  )
                }
              } else {
                appPlugin.showalert(
                  this.$t('errorcreatemessage'),
                  '',
                  'error',
                  this.$t('ok')
                )
              }
            })
        }
      },
      onEditSubLesson (index) {
        let _this = this
        if (this.$v.lessonData.$invalid) {
          appPlugin.showalert(
            'Uyarı',
            'Dersler İle İlgili Bilgileri Doldurun',
            'error',
            'Tamam'
          )
        } else if (this.$v.subLessons.$invalid) {
          appPlugin.showalert(
            'Uyarı',
            'Alt Dersler İle İlgili Bilgileri Doldurun',
            'error',
            'Tamam'
          )
        } else {
          this.$store
            .dispatch('updateSubLesson', {
              id: this.subLessons[index].id,
              data: this.subLessons[index]
            })
            .then(res => {
              if (res.status) {
                if (res.status == 200) {
                  Vue.set(this.subLessons[index], 'name', res.data.lName)
                  Vue.set(this.subLessons[index], 'code', res.data.lCode)
                  this.$emit('onSuccesUpdate', true)
                  appPlugin.showalert(
                    this.$t('updateSuccesMsg'),
                    '',
                    'success',
                    this.$t('ok')
                  )
                } else if (res.status == 204) {
                  appPlugin.showalert(
                    this.$t('warning'),
                    this.$t('lessoncodewarning'),
                    'info',
                    this.$t('ok')
                  )
                }
              } else {
                appPlugin.showalert(
                  this.$t('updateErrorMsg'),
                  '',
                  'error',
                  this.$t('ok')
                )
              }
            })
            .catch(err => {
              appPlugin.showalert(
                this.$t('updateErrorMsg'),
                '',
                'error',
                this.$t('ok')
              )
            })
        }

        /* axios
               .put(
                 '/updateSubLesson/' + this.subLessons[index].id,
                 this.subLessons[index]
               )
               .then(res => {
                 //
               })
               .catch(err => {

               })*/
        // dataupdate
      },
      removeSubLessons (index) {
        if (this.subLessons[index].id == undefined) {
          this.onRemoveSubLesson(index)
        } else {
          if (this.subLessons.length > 1) {
            Swal.fire({
              title:
                'Ders Adı :' +
                ' ' +
                this.subLessons[index].name +
                '\n ' +
                this.$t('sureDelete'),
              confirmButtonText: this.$t('yes'),
              icon: 'info',
              confirmButtonColor: 'red',
              cancelButtonText: this.$t('no'),
              showCancelButton: true
            }).then(res => {
              if (res.value) {
                this.loading = true
                this.$store
                  .dispatch('deleteSubLessons', { id: this.subLessons[index].id })
                  .then(res => {
                    if (res.status) {
                      if (res.status == 200) {
                        this.$emit('onSuccesCreate', true)
                        this.subLessons.splice(index, 1)
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
                    this.loading = false
                  })
              }
            })
          } else {
            appPlugin.showalert(
              this.$t('sublessonrequired'),
              '',
              'error',
              this.$t('ok')
            )
          }
        }
      },
      onChangeLessonType () {
        if (this.editedMode == false) {
          this.subLessons = [
            {
              code: '',
              name: ''
            }
          ]
        }
      },
      onAddSubLesson () {
        this.subLessons.push({
          code: '',
          name: ''
        })
      },
      onRemoveSubLesson (i) {
        if (this.subLessons.length > 1) {
          this.subLessons.splice(i, 1)
        }
      }
    }
  }
</script>

<style scoped>
</style>
