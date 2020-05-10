<template>
  <div>
    <div class="row">
      <Loading v-if="loading"/>
      <div class="col-md-3 col-lg-3 col-sm-3">
        <div class="card">
          <div class="card-header">
            Gruplar
          </div>
          <div class="card-body">
            <div class="list-group">
              <button type="button" class="list-group-item list-group-item-action active">
                <i class="fa fa-home "></i>
                Cras justo odio
              </button>
              <button type="button" class="list-group-item list-group-item-action"><i class="fa fa-layer-group"></i>
                Dapibus ac facilisis in
              </button>
              <button type="button" class="list-group-item list-group-item-action">Morbi leo risus</button>
              <button type="button" class="list-group-item list-group-item-action">Porta ac consectetur ac</button>
            </div>
          </div>

        </div>
      </div>

      <div class="col-lg-9 col-sm-9 col-md-9">
        <div class="card">
          <ACard v-if="$store.getters.getPostType.length>0">
            <ATabs fill class="flex-column flex-xs-row" :value="$store.getters.getPostType[0].ptName">
              <br/>
              <ATabPane
                @getId="getId(tabItem,i)"
                v-for="(tabItem, i) in $store.getters.getPostType"
                :key="i"
                :title="tabItem.ptName"
              >
                <post :inputplaceholder="inputplaceholder"
                      :inputvisible="inputvisible"
                      :dateplaceholder="dateplaceholder"
                      :datevisible="datevisible"
                      :textareaplaceholder="textareaplaceholder"
                      :textareavisible="textareavisible"
                      :timeplaceholder="timeplaceholder"
                      :timevisible="timevisible"
                      :selectedCatPlaceholder="selectedCatPlaceholder"
                      :selectedCatVisible="selectedCatVisible"
                      :clearModel="clearModel"
                      :postType="tabItem"
                      :paginateTo="paginateTo"
                      :lessons="lessonlist"
                      :lesson-visible="lessonvisible"
                      @onCreated="onCreatePost"
                />
              </ATabPane>
            </ATabs>
          </ACard>
        </div>
      </div>
    </div>
    Next: {{nextPageUrl}}<br/>
    Last: {{lastPageUrl}}

    <flex column="col-md-12 col-sm-12 col-lg-12">
      <div class="text-center">
        <button class="btn btn-outline-secondary" @click="getPosts"><i class="fa fa-redo"></i> İçeriği Yenile</button>
      </div>
    </flex>

    <flex column="col-lg-12 col-sm-12 col-md-12 mt-5">
      <div class="card">
        <div class="card-title mt-3">
          <h3 class="text-center text">Filtreleme Seçenekleri</h3>
        </div>
        <div class="card-body">
          <div class="row">
            <div class="col-md-3 col-lg-3 col-sm-3">
              <label>Paylaşım Türü</label>
              <v-select
                v-model.trim="queryfilter.ptype"
                :propName="'ptName'"
                :bindData="'id'"
                :optionData="filterTab"
              ></v-select>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-3">
              <label>Paylaşım Yapan Kullanıcı</label>
              <multiselect
                v-model="selectedUsers"
                id="ajaxSelect"
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
            <div class="col-md-3 col-lg-3 col-sm-3">
              <label>Tarih</label>
              <datetime
                v-model="queryfilter.psdate"
                input-class="form-control"
                :week-start="7"
                :phrases="{ok: 'Seç', cancel: 'Vazgeç'}"
              ></datetime>
            </div>
            <div class="col-md-3 col-lg-3 col-sm-3">
              <label>Öncelik Düzeyi</label>
              <v-select
                v-model.trim="queryfilter.tag"
                :propName="'tagName'"
                :bindData="'id'"
                :optionData="$store.getters.getPostTagP"
              ></v-select>
            </div>
          </div>
          <flex column="col-md-12 col-sm-12 col-lg-12 mt-5">
            <div class="text-center">
              <button class="btn btn-lg  btn-transparent" @click="removeFilter"><i class="fa fa-times"></i> Filtreyi
                Temizle
              </button>
            </div>
            <div class="text-center">
              <button class="btn btn-lg  btn-transparent" @click="getPosts"><i class="fa fa-filter"></i> Filtrele
              </button>
            </div>
          </flex>
        </div>
      </div>

    </flex>
    <flex column="col-lg-12 col-sm-12 col-md-12 mt-5" v-if="$store.getters.getPost.length<1">
      <div class="card">
        <div class="card-body">
          <h3 class="text-center text">Henüz Bir Gönderi Paylaşılmadı</h3>
        </div>
      </div>
    </flex>
    <flex column="col-lg-12 col-sm-12 col-md-12 mt-5" v-if="$store.getters.getPost.length>0">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 order-xl-1" v-for="(item,i) in $store.getters.getPost">
        <spost
          :lessonName="item.lesson.lName"
          :postId="item.id"
          :userName="item.user.uFullName"
          :userTitle="item.user.title.tName"
          :avatarUri="item.user.file.id==1?defaultPreview:item.user.file.path"
          :postTag="item.posttag.tagName"
          :postContent="item.content"
          :postFiles="item.dFiles"
          :postImg="item.iFiles"
          :userLike="item.userLike"
          :likeCount="item.likes.length"
          :commentCount="item.comments.length"
          :posttagColor="item.posttag.color"
          :viewCount="item.views.length"
          :postDate="item.created_at"
          :showDelete="item.showDelete"
          :postType="item.posttype.ptName"
          :postTDate="item.delivery_date"
          :postCategory="item.category.hwtName"
          :postHour="item.estimated_time"
          :eHour="item.hour"
          :examName="item.exam_name"
          :commentVisible="item.iscomment==1?true:false"
          @onDelete="postDelete(item,i)"
          @onLike="onLike(item,i)"
          :showViews="item.showviews"
          @onViewPost="showView(item)"
          @onComment="commentPost(item,i)"
        />

      </div>
      <p class="text text-center" v-if="$store.getters.getPost.length!=0"> Toplam Paylaşım :
        {{$store.getters.getPost.length}}
      </p>
    </flex>
    <div class="row">
      <div class="col">
        {{nextPageUrl}}
        <button type="button" class="btn btn-secondary btn-lg btn-block" @click="loadMore('default')"
                v-if="nextPageUrl!=''">Daha
          Fazla Yükle
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import VueGallery from 'vue-gallery'
  import {
    Loading,
    VSelect,
    FlexCard,
    Flex,
    VButton,
    VTabs,
    VTabContent,
    Multiselect,
    appPlugin
  } from '@/Providers/defaultImports'
  import moment from 'moment'
  import { Datetime } from 'vue-datetime'
  import { FETCH_ALL_USERSSEARCH } from '@/store/modules/users/moduleNames'
  import { FETCH_ALL_POST_TYPE } from '../../store/modules/posttype/moduleNames'
  import { FETCH_ALL_HOMEWORK_TYPE } from '../../store/modules/homeworktype/moduleNames'
  import { FETCH_ALL_POST_TAG } from '../../store/modules/posttag/moduleNames'
  import {
    FETCH_POST,
    FETCH_NEXT_POST,
    DELETE_POST,
    LIKE_POST,
    SET_POST_DETAIL_PASS_DATA
  } from '../../store/modules/post/moduleNames'
  import Post from './partial/post'
  import spost from '@/components/spost/index'
  import defaultImage from '@/assets/img/defaultavatar.png'
  import Vue from 'vue'
  import _ from 'underscore'
  import { FETCH_PNOTIFICATION } from '../../store/modules/pnotification/moduleNames'
  import { FETCH_USER_WITH_LESSON } from '../../store/modules/users/moduleNames'

  var startdate = new Date().toISOString()
  var enddate = new Date().toISOString()
  export default {
    name: 'index',

    created () {
      this.getPosts()
      this.fetchPostType()
      this.fetchPostTag()
      this.fetchUserLesson()
    },
    mounted () {
    },
    methods: {
      fetchUserLesson () {
        this.$store.dispatch(FETCH_USER_WITH_LESSON, { userid: 2 }).then((res) => {
          console.log('ders', res.data[0].lessons)
          if(res.data[0].lessons.length>0){
            res.data[0].lessons.unshift({
              id:0,
              lName:"Seçiniz"
            })
           this.lessonlist=res.data[0].lessons
          }

        }).catch((err) => {
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
        })
      },
      removeFilter () {
        this.selectedUsers = []
        this.queryfilter = {
          tag: 0,
          ptype: 0,
          puser: '',
          psdate: startdate,
        }
        this.getPosts()
      },
      fetchUsers (data) {
        if (data == '') {
          this.isLoading = false
        } else {
          this.isLoading = true
          let query = appPlugin.urlParse('uİsActive=1' + '& uFullName%' + data + '& id-' + 2)
          this.$store.dispatch(FETCH_ALL_USERSSEARCH, {
            urlparse: query,
          }).then((res) => {
            if (res.status === 200) {
              debugger

              this.users = res.data
            }
            this.isLoading = false
          }).catch((err) => {
            appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
            this.isLoading = false
          })
        }
      },
      onCreatePost (e) {
        this.getPosts()
      },
      commentPost (item, i) {
        if (item) {
          item.comments = item.comments.reverse()
          debugger
          item.comments.forEach((comment) => {
            comment.iFiles = []
            comment.dFiles = []
            if (comment.files.length > 0) {
              comment.files.forEach((file) => {
                if (file.viewtype == 'img') {
                  comment.iFiles.push(file.path)
                } else {
                  comment.dFiles.push({
                    fileName: file.viewname,
                    uri: file.path
                  })
                }
              })
            }
            //Benimse Yorum
            if (comment.user_id == 2) {
              comment.commentDelete = true
            } else {
              comment.commentDelete = false
            }
            if (comment.likes.length > 0) {
              debugger
              let userLike = _.where(
                comment.likes,
                {
                  id: 2
                }
              )
              debugger
              if (userLike.length < 1) {
                comment.userLike = false
              } else {
                comment.userLike = true
              }
            } else {
              comment.userLike = false
            }
          })
          this.$store.commit(SET_POST_DETAIL_PASS_DATA, [item])
          this.$router.push('/postdetail/' + item.id)
        }
      },
      showView (item) {
        this.$router.push('/postviews/' + item.id)
      },
      onLike (item, i) {
        debugger
        this.$store.dispatch(LIKE_POST, {
          likedPostType: 'allpost',
          userid: 2,
          postid: item.id,
          liketype: item.userLike == true ? 0 : 1
        }).then((res) => {
          debugger
        }).catch((err) => {
          appPlugin.showalert(this.$t('warning'), 'Gönderi Beğenme İşlemi Başarısız Oldu', 'error', this.$t('ok'))

          debugger
        })
      },
      postDelete (item, i) {
        debugger
        this.$store.dispatch(DELETE_POST, { id: item.id, index: i, deletedType: 'allpost' }).then((res) => {
          debugger
          if (res.status && res.status == 200) {
            if (this.$store.getters.getPost.length == 0) {
              this.loadMore('deleted')
            }
            Vue.$toast.open({
              message: 'Gönderi Silindi',
              type: 'success',
              position: 'bottom'
            })
          }
        }).catch((err) => {
          appPlugin.showalert(this.$t('warning'), this.$t('deleteRecordErrMsg'), 'error', this.$t('ok'))
        })
      },
      getPosts () {
        debugger
        this.loading = true
        let query = []
        let userIds = []
        debugger
        if (this.selectedUsers.length > 0) {
          console.log(this.selectedUsers)
          this.selectedUsers.forEach((item) => {
            userIds.push(item.id)
          })
          query = appPlugin.urlParse('created_at >' + moment(this.queryfilter.psdate).format('YYYY-MM-DD')
            + (this.queryfilter.tag == 0 ? '' : '& tag_id=' + this.queryfilter.tag) + (this.queryfilter.ptype == 0 ? '' : '& post_type_id=' + this.queryfilter.ptype))
        } else {
          debugger
          //OWNER TODO
          query = appPlugin.urlParse('created_at >' + moment(this.queryfilter.psdate).format('YYYY-MM-DD')
            + (this.queryfilter.tag == 0 ? '' : '& tag_id=' + this.queryfilter.tag) + (this.queryfilter.ptype == 0 ? '' : '& post_type_id=' + this.queryfilter.ptype))

        }
        this.$store.dispatch(FETCH_POST, { urlparse: query, users: userIds }).then((res) => {
          debugger
          debugger
          debugger
          this.paginateTo = res.data.per_page
          //TODO urllere bak
          if (res.data.next_page_url != null) {
            this.nextPageUrl = res.data.next_page_url
          }
          this.lastPageUrl = res.data.last_page_url
          this.loading = false

        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'),
            this.$t('fetchError'), 'error',
            this.$t('ok'))
        })
      },
      loadMore (type) {
        debugger
        this.loading = true
        debugger
        let lastpageUrl = ''
        let pageUrl = ''
        let query = []
        let userIds = []
        debugger
        if (this.selectedUsers.length > 0) {
          console.log(this.selectedUsers)
          this.selectedUsers.forEach((item) => {
            userIds.push(item.id)
          })
          query = appPlugin.urlParse('created_at >' + moment(this.queryfilter.psdate).format('YYYY-MM-DD')
            + (this.queryfilter.tag == 0 ? '' : '& tag_id=' + this.queryfilter.tag) + (this.queryfilter.ptype == 0 ? '' : '& post_type_id=' + this.queryfilter.ptype))
        } else {
          debugger
          //OWNER TODO
          query = appPlugin.urlParse('created_at >' + moment(this.queryfilter.psdate).format('YYYY-MM-DD')
            + (this.queryfilter.tag == 0 ? '' : '& tag_id=' + this.queryfilter.tag) + (this.queryfilter.ptype == 0 ? '' : '& post_type_id=' + this.queryfilter.ptype))
        }
        if (type && type == 'deleted') {
          let nextUri = +this.nextPageUrl.split('=')[1] - 1
          let lastUuri = +this.lastPageUrl.split('=')[1] - 1
          if (nextUri == 0) {
            nextUri = 1
          }
          if (lastUuri == 0) {
            lastUuri = 1
          }
          //{ userid: 2 }
          pageUrl = this.nextPageUrl.split('=')[0] + '=' + nextUri
          lastpageUrl = this.lastPageUrl.split('=')[0] + '=' + lastUuri
          debugger
          this.$store.dispatch(FETCH_NEXT_POST, {
            url: pageUrl, userid: 2,
            urlparse: query, users: userIds
          }).then((res) => {
            debugger
            debugger
            this.lastPageUrl = res.data.last_page_url
            console.log('silindikten sonraki servis', res)
            if (res.data.next_page_url != null) {
              debugger
              this.nextPageUrl = res.data.next_page_url
            } else {
              this.nextPageUrl = ''
            }
            debugger
            this.loading = false
          }).catch((err) => {
            debugger
            this.loading = false
            appPlugin.showalert(this.$t('warning'),
              this.$t('fetchError'), 'error',
              this.$t('ok'))
          })
          this.loading = false
        } else {
          if (this.nextPageUrl == this.lastPageUrl) {
            debugger
            this.$store.dispatch(FETCH_NEXT_POST, {
              url: this.nextPageUrl, userid: 2,
              urlparse: query, users: userIds
            }).then((res) => {
              debugger
              if (res.data.next_page_url != null) {
                debugger
                this.lastPageUrl = res.data.last_page_url
                this.nextPageUrl = res.data.next_page_url
              }
              this.loading = false
            }).catch((err) => {
              debugger
              this.loading = false
              appPlugin.showalert(this.$t('warning'),
                this.$t('fetchError'), 'error',
                this.$t('ok'))
            })
            this.nextPageUrl = ''
            this.loading = false
          } else {
            debugger
            this.$store.dispatch(FETCH_NEXT_POST, {
              url: this.nextPageUrl, userid: 2,
              urlparse: query, users: userIds
            }).then((res) => {
              debugger
              if (res.data.next_page_url != null) {
                debugger
                this.nextPageUrl = res.data.next_page_url
              }
              this.loading = false
            }).catch((err) => {
              debugger
              this.loading = false
              appPlugin.showalert(this.$t('warning'),
                this.$t('fetchError'), 'error',
                this.$t('ok'))
            })
            this.loading = false
          }
        }
      },
      getId (tabItem, i) {
        this.currentTab = i
        this.currentTabItem = tabItem
        switch (tabItem.ptName) {
          case 'Gönderi':
            this.inputplaceholder = ''
            this.inputvisible = false
            this.datevisible = false
            this.timevisible = false
            this.dateplaceholder = ''
            this.timeplaceholder = ''
            this.selectedCatPlaceholder = ''
            this.selectedCatVisible = false
            this.clearModel = true
            this.clearModel = false
            this.lessonvisible=false
            return
          case 'Ödev':
            this.fetchHomeWork()
            this.selectedCatVisible = true
            this.timevisible = false
            this.timeplaceholder = ''
            this.inputplaceholder = 'Tahmini Süre(Dakika)'
            this.inputvisible = true
            this.datevisible = true
            this.dateplaceholder = 'Teslim Tarihi'
            this.selectedCatPlaceholder = 'Ödev Türü Seçiniz'
            this.clearModel = true
            this.clearModel = false
            this.lessonvisible=true

            return
          case 'Sınav Tarihi':
            this.selectedCatVisible = false
            this.dateplaceholder = 'Sınav Tarihi'
            this.datevisible = true
            this.inputvisible = true
            this.inputplaceholder = 'Sınav Adı'
            this.selectedCatPlaceholder = ''
            this.timevisible = false
            this.timeplaceholder = ''
            this.clearModel = true
            this.clearModel = false
            this.lessonvisible=false

            return
          case 'Etkinlik':
            this.selectedCatVisible = false
            this.dateplaceholder = 'Etkinlik Tarihi'
            this.datevisible = true
            this.inputvisible = false
            this.inputplaceholder = ''
            this.selectedCatPlaceholder = ''
            this.timevisible = true
            this.lessonvisible=false

            this.timeplaceholder = 'Saat Seçiniz'
            return
          case 'Yemek Listesi':
            this.selectedCatVisible = false
            this.inputplaceholder = ''
            this.inputvisible = false
            this.datevisible = false
            this.timevisible = false
            this.lessonvisible=false
            this.selectedCatPlaceholder = ''
            this.dateplaceholder = ''
            this.timeplaceholder = ''
            return
        }
        debugger

      },
      fetchHomeWork () {
        this.$store.dispatch(FETCH_ALL_HOMEWORK_TYPE).then((res) => {
        }).catch((err) => {
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
        })
      },
      fetchPostTag () {
        this.loading = true
        this.$store.dispatch(FETCH_ALL_POST_TAG).then((res) => {
          this.loading = false
          if (res.status == 200) {
          }
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
        })
      },

      fetchPostType () {
        this.loading = true
        this.$store.dispatch(FETCH_ALL_POST_TYPE).then((res) => {
          this.loading = false
          if (res) {
            console.log('res', res)
            this.currentTabItem = res[0]
            this.filterTab = JSON.parse(JSON.stringify(res))
            this.filterTab.unshift({
              id: 0,
              ptName: 'Tümü'
            })
          }

        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
        })
      }
    },
    data () {
      return {
        queryfilter: {
          tag: 0,
          ptype: 0,
          puser: '',
          psdate: startdate,
        },
        lessonvisible: false,
        users: [],
        isLoading: false,
        selectedUsers: [],
        filterTab: [],
        defaultPreview: defaultImage,
        lastPageUrl: '',
        nextPageUrl: '',
        inputvisible: false,
        inputplaceholder: '',
        textareavisible: true,
        textareaplaceholder: 'Yazmaya Başla..',
        datevisible: false,
        timevisible: false,
        selectedCatPlaceholder: '',
        timeplaceholder: '',
        dateplaceholder: '',
        loading: false,
        currentTab: 1,
        currentTabItem: '',
        selectedCatVisible: false,
        clearModel: false,
        paginateTo: 0,
        lessonlist:[]
      }
    },
    components: {
      Multiselect,
      Datetime,
      gallery: VueGallery,
      Post,
      Loading,
      Flex,
      FlexCard,
      VTabs,
      VTabContent,
      spost,
      VSelect
    }
  }
</script>

<style scoped>
  .imageGallery {
    float: left;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    border: 1px solid #ebebeb;
    margin: 5px;

  }
</style>
