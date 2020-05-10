<template>
  <div class="card">
    <Loading v-if="loading"/>
    <div class="card-body">
      <div class="row">
        <div class="col-lg-12 col-md-12 col-sm-12">
          <div class="form-group">
            <div class="input-group input-group-merge">
                <textarea
                  v-model="comment.content"
                  class="form-control"
                  id="exampleFormControlTextarea1"
                  rows="5"
                  :placeholder="textareaplaceholder"
                ></textarea>
            </div>
          </div>
        </div>
        <div class="col-md-12 col-sm-12 col-lg-12">
          <div class="form-group ">
            <div class="input-group input-group-merge">
              <input
                @change="onChange($event)"
                multiple
                class="form-control"
                ref="file"
                id="commentFile"
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
        <div class="row">
          <div class="col-md-12 col-sm-12 col-lg-12">
            <p
              class="text-center text"
              v-if="comment.fileList.length>0"
            >Dosya Sayısı : {{comment.fileList.length}}</p>
            <p class="text-center text" v-if="comment.filesize!=0">Dosya Boyutu : {{comment.filesize|kbToMB}} </p>
          </div>
          <div class="col-md-12 col-sm-12 col-lg-12">
            <div class="row" v-for="(item,i) in comment.fileList">
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
        <div class="col-md-12 col-sm-12 col-lg-12">
          <v-button className="btn btn-primary float-right"
                    btnName="Yorum Yap"
                    @onClick="commentValidate"
          ></v-button>
        </div>
      </div>
    </div>
  </div>

</template>

<script>
  import {
    Loading,
    VButton,
    appPlugin
  } from '@/Providers/defaultImports'
  import { ADD_MULTIPLE_FILES } from '../../store/modules/file/moduleNames'
  import { CREATE_COMMENT } from '../../store/modules/post/moduleNames'
  import Vue from 'vue'

  export default {
    name: 'index',
    components: {
      Loading,
      VButton
    },
    props: {
      commentablePost: {},
      textareaplaceholder: {},
    },
    data () {
      return {
        loading: false,
        comment: {
          content: '',
          filesize: 0,
          fileList: [],
        }
      }
    },
    methods: {
      commentValidate () {
        if (this.comment.content == '') {
          appPlugin.showalert(this.$t('warning'), 'Lütfen Yorum Yazınız', 'info', this.$t('ok'))
        } else {
          if (this.comment.fileList.length > 0) {
            var fd = new FormData()
            var ins = this.comment.fileList.length
            for (var x = 0; x < ins; x++) {
              fd.append('multipleFiles[]', this.comment.fileList[x])
            }
            this.$store.dispatch(ADD_MULTIPLE_FILES, fd).then((res) => {
              this.$store.dispatch(CREATE_COMMENT, {
                fileList: res.data,
                ccontent: this.comment.content,
                userid: 2,
                postid: this.$route.params.id
              }).then((res) => {
                this.comment = {
                  content: '',
                  filesize: 0,
                  fileList: [],
                }

                Vue.$toast.open({
                  message: 'Gönderi Paylaşıldı',
                  type: 'success',
                  position: 'bottom'
                })
                let fileInput = document.getElementById('commentFile')
                fileInput.value = ''
              }).catch((err) => {
                appPlugin.showalert(this.$t('warning'), 'Yorum Oluşturulamadı', 'error', this.$t('ok'))
                //yorum olusmadı
              })
            }).catch((err) => {
              appPlugin.showalert(this.$t('warning'), 'Dosyalar Eklenirken Hata Gerçekleşti', 'error', this.$t('ok'))
              //dosya eklenmedi
            })
          } else {
            console.log(this.commentablePost)
            //Yorum yApan benim
            this.$store.dispatch(CREATE_COMMENT, {
              fileList: [],
              ccontent: this.comment.content,
              userid: 2,
              postid: this.$route.params.id
            }).then((res) => {
              Vue.$toast.open({
                message: 'Gönderi Paylaşıldı',
                type: 'success',
                position: 'bottom'
              })
              this.comment = {
                content: '',
                filesize: 0,
                fileList: [],
              }
              let fileInput = document.getElementById('commentFile')
              fileInput.value = ''
            }).catch((err) => {
              appPlugin.showalert(this.$t('warning'), 'Yorum Oluşturulamadı', 'error', this.$t('ok'))
              debugger
            })
          }
        }
      },
      removeFile (i) {
        let fileInput = document.getElementById('commentFile')
        debugger
        this.comment.filesize = this.comment.filesize - this.comment.fileList[i].size
        this.comment.fileList.splice(i, 1)
      },
      onChange (e) {
        let fileInput = document.getElementById('commentFile')

        for (let i = 0; i < e.target.files.length; i++) {
          debugger
          if ((this.comment.filesize + e.target.files[i].size) < 20971520) {
            this.comment.filesize += e.target.files[i].size
            this.comment.fileList.push(e.target.files[i])
          } else {
            appPlugin.showalert(this.$t('warning'), '20 MB Fazla Dosya Seçilemtez', 'info', this.$t('ok'))
            break
          }

        }
        fileInput.value = ''

      },
    }
  }
</script>

<style scoped>

</style>
