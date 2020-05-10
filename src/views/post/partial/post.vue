<template>
  <div>
    <Loading v-if="loading"/>
    <div class="card-body">
      <div class="row">
        <div class="col-md-12 col-lg-12 col-sm-12">
          <div class="form-group" v-if="textareavisible">
            <div class="input-group input-group-merge">
                <textarea
                  v-model="post.content"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  :placeholder="textareaplaceholder"
                ></textarea>
            </div>
          </div>

          <div class="form-group">
            <label>Öncelik</label>
            <div class="input-group input-group-merge">
              <v-select
                v-model.trim="post.tag"
                :propName="'tagName'"
                :bindData="'id'"
                :optionData="$store.getters.getPostTagP"
              ></v-select>

            </div>
          </div>
          <div class="form-group" v-if="lessonVisible">
            <label>Ödevin Verileceği Ders</label>
            <div class="input-group input-group-merge">
              <v-select
                v-model.trim="post.lessonid"
                :propName="'lName'"
                :bindData="'id'"
                :optionData="lessons"
              ></v-select>

            </div>
          </div>
          <div class="form-group" v-if="datevisible">
            <label>{{dateplaceholder}}</label>
            <div class="input-group input-group-alternative">
              <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="fa fa-calendar-day"></i>
                  </span>
              </div>
              <datetime
                v-model="post.postDate"
                input-class="form-control"
                :week-start="7"
                :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
              ></datetime>
            </div>
          </div>
          <div class="form-group" v-if="timevisible">
            <div class="input-group input-group-merge">
              <vue-timepicker
                v-model="post.postTime"
                @change="changeHandler"
                hour-label="Saat"
                minute-label="Dakika"
                :placeholder="timeplaceholder"
                format="HH:mm"
                :minute-interval="5"
              ></vue-timepicker>
            </div>
          </div>
          <div class="form-group" v-if="inputvisible">
            <label>{{inputplaceholder}}</label>
            <div class="input-group input-group-merge">
              <v-input
                v-model="post.inputText"
                :inputType="'text'"
                :placeholder="inputplaceholder"
              ></v-input>
            </div>
          </div>
          <div class="form-group" v-if="selectedCatVisible">

            <label>{{selectedCatPlaceholder}}</label>
            <div class="input-group input-group-merge">
              <v-select
                v-model.trim="post.selectedCat"
                :propName="'hwtName'"
                :bindData="'id'"
                :optionData="$store.getters.getHomeWorkTypeSelect"
              ></v-select>

            </div>
          </div>

          <div class="form-group">
            <div class="row">
              <div class="col-sm-3 col-md-3 col-lg-3">
                <div class="dropdown">
                  <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownMenuButton"
                          data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {{sharedType.name}}
                  </button>
                  <div class="dropdown-menu" aria-labelledby="dropdownMenuButton">
                    <a class="dropdown-item" @click.prevent="changeType(item)" v-for="item in sharedTypeList">{{item.name}}</a>

                  </div>
                </div>
              </div>
              <div class="col-md-9 col-sm-9 col-lg-9">
                <div class="form-group" v-if="sharedType.id==1">
                  <multiselect
                    v-model="selectedUsers"
                    id="ajax"
                    label="uFullName"
                    track-by="uFullName"
                    placeholder="Kişileri Ara"
                    open-direction="bottom"
                    :options="users"
                    :multiple="true"
                    :searchable="true"
                    :loading="isLoading"
                    :internal-search="true"
                    :clear-on-select="false"
                    :close-on-select="true"
                    :options-limit="300"
                    :max-height="600"
                    :show-no-results="true"
                    :hide-selected="true"
                    @search-change="fetchUsers">
                    <span slot="noResult">Aradığınız Kayıt Bulunamadı</span>
                  </multiselect>
                </div>
              </div>
            </div>

          </div>
          <div class="form-group">
            <div class="row">
              <div class="col-md-3 col-sm-3 col-lg-3">
                <div class="custom-control custom-checkbox mb-3">
                  <input class="custom-control-input" id="customCheck2" type="checkbox" v-model="post.iscommentable">
                  <label class="custom-control-label" for="customCheck2">Yorum Yapılabilir</label>
                </div>
              </div>
              <div class="col-md-9 col-sm-9 col-lg-9">
                <div class="form-group ">
                  <div class="input-group input-group-merge">
                    <input
                      @change="onChange($event)"
                      multiple
                      class="form-control"
                      ref="file"
                      id="postFile"
                      style="display: none;"
                      type="file"
                    />
                    <a
                      @click="$refs.file.click()"
                      aria-pressed="true"
                      class="btn btn-sm btn-secondary float-center"
                      role="button"
                    > <i class="fa fa-paperclip"></i> Dosya Seç (Max 20 MB) </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="form-group">
            <div class="row">
              <div class="col-md-3 col-sm-3 col-lg-3">
                <p
                  class="text-center text"
                  v-if="post.fileList.length>0"
                >Dosya Sayısı : {{post.fileList.length}}</p>
                <p class="text-center text" v-if="post.filesize!=0">Dosya Boyutu : {{post.filesize|kbToMB}} </p>
              </div>
              <div class="col-md-9 col-sm-9 col-lg-9">
                <div class="row" v-for="(item,i) in post.fileList">
                  <div class="col-md-10 col-sm-10 col-lg-10">
                    <i class="fa fa-file"></i>
                    <small>{{item.name}}</small>
                  </div>
                  <div class="col-md-2 col-sm-2 col-lg-2 mt-2">
                    <v-button
                      btnName="Sil"
                      class="btn btn-sm btn-danger"
                      :btnIcon="'fa-times'"
                      @onClick="removeFile(i)"
                    ></v-button>
                  </div>
                </div>
              </div>
            </div>

          </div>
          <div class="form-group">
            <div class="row">
              <div class="col-12">
                <v-button className="btn btn-primary float-right" btnName="Paylaş" btnIcon="fa fa-share"
                          @onClick="validatePostModel"></v-button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import { Datetime } from 'vue-datetime'
  import VueTimepicker from 'vue2-timepicker'
  import Vue from 'vue'
  import moment from 'moment'
  import 'vue2-timepicker/dist/VueTimepicker.css'

  import {
    Loading,
    Multiselect,
    VButton,
    VInput,
    VSelect,
    appPlugin
  } from '@/Providers/defaultImports'
  import { FETCH_ALL_USERSSEARCH } from '@/store/modules/users/moduleNames'
  import { CREATE_POST, DELETE_POST } from '../../../store/modules/post/moduleNames'
  import { ADD_MULTIPLE_FILES } from '../../../store/modules/file/moduleNames'
  import { FETCH_ALL_USER_AND_STUDENT, FETCH_USER_WITH_LESSON } from '../../../store/modules/users/moduleNames'

  export default {
    components: { Datetime, VueTimepicker, VInput, VButton, VSelect, Multiselect, Loading },
    name: 'post',
    props: {
      lessons: [],
      lessonVisible: {},
      paginateTo: {},
      posttype: {},
      textareavisible: {},
      textareaplaceholder: {},
      inputvisible: {},
      inputplaceholder: {},
      datevisible: {},
      dateplaceholder: {},
      timevisible: {},
      timeplaceholder: {},
      selectvisible: {},
      selectplaceholder: {},
      selectedCatPlaceholder: {},
      selectedCatVisible: {},
      clearModel: {},
      postType: {}
    },
    watch: {},

    methods: {
      validatePostModel () {
        debugger
        switch (this.postType.ptName) {
          case 'Gönderi':
            this.onValidatePost()
            return
          case 'Ödev':
            this.onValidateHomeWork()
            return
          case 'Sınav Tarihi':
            this.onValidateExamDate()
            return
          case 'Etkinlik':
            this.onValidateActivity()
            return
          case 'Yemek Listesi':
            this.onValidateFoodList()
            return
        }
      },
      onValidateFoodList () {
        if (this.post.content.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Birşeyler Yazın', 'info', this.$t('ok'))
        } else if (this.post.tag == 0) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşımın Öncelik Türünü   Seçiniz', 'info', this.$t('ok'))
        } else if (!this.sharedType.id) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Türü  Seçiniz', 'info', this.$t('ok'))
        } else if (this.sharedType) {
          if (this.sharedType.id == 1) {
            if (this.selectedUsers.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Kişileri  Seçiniz', 'info', this.$t('ok'))
            } else {
              debugger
              let postData = {
                lessonid: 1,
                pcontent: this.post.content,
                userid: 2,
                sharetype: this.sharedType.id,
                categoryid: 1,
                posttype: this.postType.id,
                posttypename: this.postType.ptName,
                sharedtype: this.sharedType.id,
                iscomment: this.post.iscommentable,
                isstatus: true,
                tag: this.post.tag,
                ename: '',
              }
              let studentArray = []
              let userArray = []
              this.selectedUsers.forEach((item) => {
                if (item.s_fullname == undefined) {
                  userArray.push(item)
                } else {
                  studentArray.push(item)
                }
              })
              if (this.post.fileList.length > 0) {
                var fd = new FormData()
                var ins = this.post.fileList.length
                for (var x = 0; x < ins; x++) {
                  fd.append('multipleFiles[]', this.post.fileList[x])
                }
                this.$store.dispatch(ADD_MULTIPLE_FILES, fd).then((res) => {
                  debugger
                  this.$store.dispatch(CREATE_POST, {
                    postdata: postData,
                    fileList: res.data,
                    users: userArray,
                    students: studentArray
                  }).then((res) => {
                    debugger
                    Vue.$toast.open({
                      message: 'Gönderi Paylaşıldı',
                      type: 'success',
                      position: 'bottom'
                    })
                    this.loading = false
                    this.post = {
                      tag: 0,
                      filesize: 0,
                      fileList: [],
                      content: '',
                      inputText: '',
                      postDate: '',
                      postTime: '',
                      lessonid:0,
                      selectedCat: 0,
                      iscommentable: true,
                    }
                    this.users = []
                    this.selectedGroups = []
                    this.selectedUsers = []
                    this.sharedType = {
                      name: 'Paylaşım Türü Seçiniz'
                    }
                    fileInput.value = ''
                    this.$emit('onCreated')
                  }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                  })
                  let fileInput = document.getElementById('postFile')
                }).catch((err) => {
                  debugger
                  this.loading = false
                })

              } else {
                debugger

                this.$store.dispatch(CREATE_POST, {
                  postdata: postData,
                  fileList: [],
                  users: userArray,
                  students: studentArray
                }).then((res) => {
                  if (res.status && res.status == 200) {
                    debugger
                    console.log('gönderi oldu')
                    Vue.$toast.open({
                      message: 'Gönderi Paylaşıldı',
                      type: 'success',
                      position: 'bottom'
                    })
                    this.loading = false
                    this.post = {
                      tag: 0,
                      filesize: 0,
                      fileList: [],
                      content: '',
                      inputText: '',
                      postDate: '',
                      postTime: '',
                      lessonid:0,
                      selectedCat: 0,
                      iscommentable: true,
                    }
                    this.users = []
                    this.selectedGroups = []
                    this.selectedUsers = []
                    this.sharedType = {
                      name: 'Paylaşım Türü Seçiniz'
                    }
                    fileInput.value = ''
                    this.$emit('onCreated')
                  }
                }).catch((err) => {
                  this.loading = false
                  appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                })
                let fileInput = document.getElementById('postFile')
              }
              //kayıt
            }
          } else if (this.sharedType.id == 0) {
            if (this.selectedGroups.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Grupları  Seçiniz', 'info', this.$t('ok'))

            } else {
              //kayıt
            }
          }
        }
      },
      onValidateActivity () {
        debugger
        if (this.post.content.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Birşeyler Yazın', 'info', this.$t('ok'))
        } else if (this.post.tag == 0) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşımın Öncelik Türünü   Seçiniz', 'info', this.$t('ok'))
        } else if (this.post.postDate == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Etkinlik Tarihi    Seçiniz', 'info', this.$t('ok'))
        } else if (
          this.post.postTime.split(':')[0] == 'HH' ||
          this.post.postTime.split(':')[1] == 'mm'
        ) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Etkinlik Saati Seçiniz', 'info', this.$t('ok'))
        } else if (!this.sharedType.id) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Türü  Seçiniz', 'info', this.$t('ok'))
        } else if (this.sharedType.id) {
          if (this.sharedType.id == 1) {
            if (this.selectedUsers.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Kişileri  Seçiniz', 'info', this.$t('ok'))
            } else {
              let postData = {
                lessonid: 1,
                pcontent: this.post.content,
                postdate: moment(this.post.postDate).format('YYYY-MM-DD'),
                userid: 2,
                sharetype: this.sharedType.id,
                categoryid: 1,
                posttype: this.postType.id,
                posttypename: this.postType.ptName,
                sharedtype: this.sharedType.id,
                iscomment: this.post.iscommentable,
                isstatus: true,
                tag: this.post.tag,
                ename: '',
                etime: '',
                hour: this.post.postTime
              }
              let studentArray = []
              let userArray = []
              this.selectedUsers.forEach((item) => {
                if (item.s_fullname == undefined) {
                  userArray.push(item)
                } else {
                  studentArray.push(item)
                }
              })
              if (this.post.fileList.length > 0) {
                var fd = new FormData()
                var ins = this.post.fileList.length
                for (var x = 0; x < ins; x++) {
                  fd.append('multipleFiles[]', this.post.fileList[x])
                }
                this.$store.dispatch(ADD_MULTIPLE_FILES, fd).then((res) => {
                  debugger
                  this.$store.dispatch(CREATE_POST, {
                    postdata: postData,
                    fileList: res.data,
                    users: userArray,
                    students: studentArray
                  }).then((res) => {
                    if (res.status && res.status == 200) {

                      Vue.$toast.open({
                        message: 'Gönderi Paylaşıldı',
                        type: 'success',
                        position: 'bottom'
                      })
                      this.loading = false
                      this.post = {
                        lessonid:0,
                        tag: 0,
                        filesize: 0,
                        fileList: [],
                        content: '',
                        inputText: '',
                        postDate: '',
                        postTime: '',
                        selectedCat: 0,
                        iscommentable: true,
                      }
                      this.users = []
                      this.selectedGroups = []
                      this.selectedUsers = []
                      this.sharedType = {
                        name: 'Paylaşım Türü Seçiniz'
                      }
                      fileInput.value = ''
                      this.$emit('onCreated')
                    }

                  }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                  })
                  let fileInput = document.getElementById('postFile')
                }).catch((err) => {
                  debugger
                  this.loading = false
                })
              } else {
                this.$store.dispatch(CREATE_POST, {
                  postdata: postData,
                  fileList: [],
                  users: userArray,
                  students: studentArray
                }).then((res) => {
                  Vue.$toast.open({
                    message: 'Gönderi Paylaşıldı',
                    type: 'success',
                    position: 'bottom'
                  })
                  this.loading = false
                  this.post = {
                    lessonid:0,
                    tag: 0,
                    filesize: 0,
                    fileList: [],
                    content: '',
                    inputText: '',
                    postDate: '',
                    postTime: '',
                    selectedCat: 0,
                    iscommentable: true,
                  }
                  this.users = []
                  this.selectedGroups = []
                  this.selectedUsers = []
                  this.sharedType = {
                    name: 'Paylaşım Türü Seçiniz'
                  }
                  fileInput.value = ''
                  this.$emit('onCreated')
                }).catch((err) => {
                  this.loading = false
                  appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                })
                let fileInput = document.getElementById('postFile')
              }
              //kayıt
            }
          } else if (this.sharedType.id == 0) {
            if (this.selectedGroups.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Grupları  Seçiniz', 'info', this.$t('ok'))

            } else {
              //kayıt
            }
          }
        }
      },
      onValidateExamDate () {
        if (this.post.content.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Birşeyler Yazın', 'info', this.$t('ok'))
        } else if (this.post.tag == 0) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşımın Öncelik Türünü   Seçiniz', 'info', this.$t('ok'))
        } else if (this.post.postDate == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Sınav Tarihi    Seçiniz', 'info', this.$t('ok'))
        } else if (this.post.inputText.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Sınav Adı  Giriniz', 'info', this.$t('ok'))
        } else if (!this.sharedType.id) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Türü  Seçiniz', 'info', this.$t('ok'))
        } else if (this.sharedType.id) {
          if (this.sharedType.id == 1) {
            if (this.selectedUsers.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Kişileri  Seçiniz', 'info', this.$t('ok'))
            } else {
              let postData = {
                lessonid: 1,
                pcontent: this.post.content,
                postdate: moment(this.post.postDate).format('YYYY-MM-DD'),
                userid: 2,
                sharetype: this.sharedType.id,
                categoryid: 1,
                posttype: this.postType.id,
                posttypename: this.postType.ptName,
                sharedtype: this.sharedType.id,
                iscomment: this.post.iscommentable,
                isstatus: true,
                tag: this.post.tag,
                ename: this.post.inputText,
                etime: ''
              }
              let studentArray = []
              let userArray = []
              this.selectedUsers.forEach((item) => {
                if (item.s_fullname == undefined) {
                  userArray.push(item)
                } else {
                  studentArray.push(item)
                }
              })
              if (this.post.fileList.length > 0) {
                var fd = new FormData()
                var ins = this.post.fileList.length
                for (var x = 0; x < ins; x++) {
                  fd.append('multipleFiles[]', this.post.fileList[x])
                }
                this.$store.dispatch(ADD_MULTIPLE_FILES, fd).then((res) => {
                  debugger
                  this.$store.dispatch(CREATE_POST, {
                    postdata: postData,
                    fileList: res.data,
                    users: userArray,
                    students: studentArray
                  }).then((res) => {
                    if (res.status && res.status == 200) {
                      Vue.$toast.open({
                        message: 'Gönderi Paylaşıldı',
                        type: 'success',
                        position: 'bottom'
                      })
                      this.loading = false
                      this.post = {
                        lessonid:0,
                        tag: 0,
                        filesize: 0,
                        fileList: [],
                        content: '',
                        inputText: '',
                        postDate: '',
                        postTime: '',
                        selectedCat: 0,
                        iscommentable: true,
                      }
                      this.users = []
                      this.selectedGroups = []
                      this.selectedUsers = []
                      this.sharedType = {
                        name: 'Paylaşım Türü Seçiniz'
                      }
                      fileInput.value = ''
                      this.$emit('onCreated')
                    }

                  }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                  })
                  let fileInput = document.getElementById('postFile')
                }).catch((err) => {
                  debugger
                  this.loading = false
                })
              } else {
                this.$store.dispatch(CREATE_POST, {
                  postdata: postData,
                  fileList: [],
                  users: userArray,
                  students: studentArray
                }).then((res) => {
                  Vue.$toast.open({
                    message: 'Gönderi Paylaşıldı',
                    type: 'success',
                    position: 'bottom'
                  })
                  this.loading = false
                  this.post = {
                    lessonid:0,
                    tag: 0,
                    filesize: 0,
                    fileList: [],
                    content: '',
                    inputText: '',
                    postDate: '',
                    postTime: '',
                    selectedCat: 0,
                    iscommentable: true,
                  }
                  this.users = []
                  this.selectedGroups = []
                  this.selectedUsers = []
                  this.sharedType = {
                    name: 'Paylaşım Türü Seçiniz'
                  }
                  fileInput.value = ''
                  this.$emit('onCreated')
                }).catch((err) => {
                  this.loading = false
                  appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                })
                let fileInput = document.getElementById('postFile')
              }
              //kayıt
            }
          } else if (this.sharedType.id == 0) {
            if (this.selectedGroups.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Grupları  Seçiniz', 'info', this.$t('ok'))

            } else {
              //kayıt
            }
          }
        }
      },
      onValidateHomeWork () {
        if (this.post.content.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Birşeyler Yazın', 'info', this.$t('ok'))
        } else if (this.post.tag == 0) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşımın Öncelik Türünü   Seçiniz', 'info', this.$t('ok'))
        } else if (this.post.lessonid == 0) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Ödevin Verileceği Dersi   Seçiniz', 'info', this.$t('ok'))
        } else if (this.post.postDate == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Ödev Teslim Tarihi    Seçiniz', 'info', this.$t('ok'))
        } else if (this.post.inputText.trim() == '' || isNaN(this.post.inputText)) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Ödev Tahmini Süresini Sayısal Olarak Giriniz', 'info', this.$t('ok'))
        } else if (this.selectedCat == 0) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Ödev Türünü Seçiniz', 'info', this.$t('ok'))
        } else if (!this.sharedType.id) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Türü  Seçiniz', 'info', this.$t('ok'))
        } else if (this.sharedType.id) {
          if (this.sharedType.id == 1) {
            if (this.selectedUsers.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Kişileri  Seçiniz', 'info', this.$t('ok'))
            } else {
              //ders seç
              let postData = {
                lessonid: this.post.lessonid,
                pcontent: this.post.content,
                postdate: moment(this.post.postDate).format('YYYY-MM-DD'),
                userid: 2,
                sharetype: this.sharedType.id,
                categoryid: this.post.selectedCat,
                posttype: this.postType.id,
                posttypename: this.postType.ptName,
                sharedtype: this.sharedType.id,
                iscomment: this.post.iscommentable,
                isstatus: true,
                tag: this.post.tag,
                ename: '',
                etime: this.post.inputText
              }
              let studentArray = []
              let userArray = []
              this.selectedUsers.forEach((item) => {
                if (item.s_fullname == undefined) {
                  userArray.push(item)
                } else {
                  studentArray.push(item)
                }
              })
              if (this.post.fileList.length > 0) {
                var fd = new FormData()
                var ins = this.post.fileList.length
                for (var x = 0; x < ins; x++) {
                  fd.append('multipleFiles[]', this.post.fileList[x])
                }
                this.$store.dispatch(ADD_MULTIPLE_FILES, fd).then((res) => {
                  debugger
                  this.$store.dispatch(CREATE_POST, {
                    postdata: postData,
                    fileList: res.data,
                    users: userArray,
                    students: studentArray
                  }).then((res) => {
                    debugger
                    Vue.$toast.open({
                      message: 'Gönderi Paylaşıldı',
                      type: 'success',
                      position: 'bottom'
                    })
                    this.loading = false
                    this.post = {
                      lessonid:0,
                      tag: 0,
                      filesize: 0,
                      fileList: [],
                      content: '',
                      inputText: '',
                      postDate: '',
                      postTime: '',
                      selectedCat: 0,
                      iscommentable: true,
                    }
                    this.users = []
                    this.selectedGroups = []
                    this.selectedUsers = []
                    this.sharedType = {
                      name: 'Paylaşım Türü Seçiniz'
                    }
                    fileInput.value = ''
                    this.$emit('onCreated')
                  }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                  })
                  let fileInput = document.getElementById('postFile')
                }).catch((err) => {
                  debugger
                  this.loading = false
                })
              } else {
                this.$store.dispatch(CREATE_POST, {
                  postdata: postData,
                  fileList: [],
                  users: userArray,
                  students: studentArray
                }).then((res) => {
                  Vue.$toast.open({
                    message: 'Gönderi Paylaşıldı',
                    type: 'success',
                    position: 'bottom'
                  })
                  this.loading = false
                  this.post = {
                    lessonid:0,
                    tag: 0,
                    filesize: 0,
                    fileList: [],
                    content: '',
                    inputText: '',
                    postDate: '',
                    postTime: '',
                    selectedCat: 0,
                    iscommentable: true,
                  }
                  this.users = []
                  this.selectedGroups = []
                  this.selectedUsers = []
                  this.sharedType = {
                    name: 'Paylaşım Türü Seçiniz'
                  }
                  fileInput.value = ''
                  this.$emit('onCreated')
                }).catch((err) => {
                  this.loading = false
                  appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                })
                let fileInput = document.getElementById('postFile')
              }
              //kayıt
            }
          } else if (this.sharedType.id == 0) {
            if (this.selectedGroups.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Grupları  Seçiniz', 'info', this.$t('ok'))

            } else {
              //kayıt
            }
          }
        }
      },
      onValidatePost () {
        if (this.post.content.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Birşeyler Yazın', 'info', this.$t('ok'))
        } else if (this.post.tag == 0) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşımın Öncelik Türünü   Seçiniz', 'info', this.$t('ok'))
        } else if (!this.sharedType.id) {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Türü  Seçiniz', 'info', this.$t('ok'))
        } else if (this.sharedType) {
          if (this.sharedType.id == 1) {
            if (this.selectedUsers.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Kişileri  Seçiniz', 'info', this.$t('ok'))
            } else {
              let postData = {
                lessonid: 1,
                pcontent: this.post.content,
                userid: 2,
                sharetype: this.sharedType.id,
                categoryid: 1,
                posttype: this.postType.id,
                posttypename: this.postType.ptName,
                sharedtype: this.sharedType.id,
                iscomment: this.post.iscommentable,
                isstatus: true,
                tag: this.post.tag,
                ename: '',
              }
              let studentArray = []
              let userArray = []
              this.selectedUsers.forEach((item) => {
                if (item.s_fullname == undefined) {
                  userArray.push(item)
                } else {
                  studentArray.push(item)
                }
              })
              debugger

              if (this.post.fileList.length > 0) {
                var fd = new FormData()
                var ins = this.post.fileList.length
                for (var x = 0; x < ins; x++) {
                  fd.append('multipleFiles[]', this.post.fileList[x])
                }
                this.$store.dispatch(ADD_MULTIPLE_FILES, fd).then((res) => {
                  debugger
                  this.$store.dispatch(CREATE_POST, {
                    postdata: postData,
                    fileList: res.data,
                    users: userArray,
                    students: studentArray
                  }).then((res) => {
                    debugger
                    Vue.$toast.open({
                      message: 'Gönderi Paylaşıldı',
                      type: 'success',
                      position: 'bottom'
                    })
                    this.loading = false
                    this.post = {
                      lessonid:0,
                      tag: 0,
                      filesize: 0,
                      fileList: [],
                      content: '',
                      inputText: '',
                      postDate: '',
                      postTime: '',
                      selectedCat: 0,
                      iscommentable: true,
                    }
                    this.users = []
                    this.selectedGroups = []
                    this.selectedUsers = []
                    this.sharedType = {
                      name: 'Paylaşım Türü Seçiniz'
                    }
                    fileInput.value = ''
                    this.$emit('onCreated')
                  }).catch((err) => {
                    this.loading = false
                    appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                  })
                  let fileInput = document.getElementById('postFile')
                }).catch((err) => {
                  debugger
                  this.loading = false
                })

              } else {
                this.$store.dispatch(CREATE_POST, {
                  postdata: postData,
                  fileList: [],
                  users: userArray,
                  students: studentArray
                }).then((res) => {
                  Vue.$toast.open({
                    message: 'Gönderi Paylaşıldı',
                    type: 'success',
                    position: 'bottom'
                  })
                  this.loading = false
                  this.post = {
                    lessonid:0,
                    tag: 0,
                    filesize: 0,
                    fileList: [],
                    content: '',
                    inputText: '',
                    postDate: '',
                    postTime: '',
                    selectedCat: 0,
                    iscommentable: true,
                  }
                  this.users = []
                  this.selectedGroups = []
                  this.selectedUsers = []
                  this.sharedType = {
                    name: 'Paylaşım Türü Seçiniz'
                  }
                  fileInput.value = ''
                  this.$emit('onCreated')
                }).catch((err) => {
                  this.loading = false
                  appPlugin.showalert(this.$t('warning'), 'Gönderi Paylaşılırken Hata', 'error', this.$t('ok'))
                })
                let fileInput = document.getElementById('postFile')
              }

              //kayıt
            }
          } else if (this.sharedType.id == 0) {
            if (this.selectedGroups.length < 0) {
              appPlugin.showalert(this.$t('warning'), 'Lütfen Paylaşım Yapılacak Grupları  Seçiniz', 'info', this.$t('ok'))

            } else {
              //kayıt
            }
          }
        }
      },
      onChange (e) {
        let fileInput = document.getElementById('postFile')

        for (let i = 0; i < e.target.files.length; i++) {
          debugger
          if ((this.post.filesize + e.target.files[i].size) < 20971520) {
            this.post.filesize += e.target.files[i].size
            this.post.fileList.push(e.target.files[i])
          } else {
            appPlugin.showalert(this.$t('warning'), '20 MB Fazla Dosya Seçilemez', 'info', this.$t('ok'))
            break
          }

        }
        fileInput.value = ''

      },
      removeFile (i) {
        let fileInput = document.getElementById('postFile')
        debugger
        this.post.filesize = this.post.filesize - this.post.fileList[i].size
        this.post.fileList.splice(i, 1)
      },
      fetchUsers (data) {
        if (data == '') {
          this.isLoading = false
          this.students = []
        } else {
          this.isLoading = true
          let query = appPlugin.urlParse('uİsActive=1' + '& uFullName%' + data + '& id-' + 2)
          let squery = appPlugin.urlParse('is_active=1' + '& s_fullname%' + data)

          console.log('q', query)
          /*getAllStudentAndUsers*/
          this.$store.dispatch(FETCH_ALL_USER_AND_STUDENT, {
            urlparse: query,
            surlparse: squery
          }).then((res) => {
            debugger
            if (res.status === 200) {
              if (res.data[0].student.length > 0) {
                res.data[0].student.forEach((item) => {
                  item.uFullName = item.s_fullname
                })
              }
              let userArray = []
              userArray = userArray.concat(res.data[0].student, res.data[0].user)
              this.users = userArray
            }
            this.isLoading = false
          }).catch((err) => {
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro', 'eror', this.$t('ok')))
            this.isLoading = false
          })
        }
      },
      changeHandler (data) {
      },
      changeType (item) {
        this.sharedType = item
      }
    }
    ,
    data () {
      return {
        post: {
          lessonid: 0,
          tag: 0,
          filesize: 0,
          fileList: [],
          content: '',
          inputText: '',
          postDate: '',
          postTime: '',
          selectedCat: 0,
          iscommentable: true
        },
        loading: false,
        isLoading: false,
        users: [],
        selectedGroups: [],
        selectedUsers: [],
        sharedType: { name: 'Paylaşım Türü Seçiniz' },
        sharedTypeList: [
          {
            id: 0,
            name: 'Gruplarda Paylaş'
          },
          {
            id: 1,
            name: 'Kişilerle Paylaş'
          }
        ]
      }
    }
  }
</script>

<style scoped>
  textarea {
    resize: none;
  }
</style>
