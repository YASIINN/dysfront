<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" :headerTitle="'Paylaşımlarım'">
      <div class="card-body">
        <div>
          <div class="row">
            <div class="col-md-12  col-sm-12 col-lg-12">
              <ATabs fill class="flex-column flex-xs-row" :value="filterTab[0].ptName" v-if="filterTab.length>0">
                <br/>
                <ATabPane
                  @getId="getId(tabItem,i)"
                  v-for="(tabItem, i) in filterTab"
                  :key="i"
                  :title="tabItem.ptName"
                >
                </ATabPane>
              </ATabs>
            </div>
          </div>
        </div>
      </div>
    </flex-card>

    <flex column="col-lg-12 col-sm-12 col-md-12 mt-5">
      <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 order-xl-1"
           v-for="(item,i) in $store.getters.getUserPost">
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
      <p class="text text-center" v-if="$store.getters.getUserPost.length!=0"> Toplam Paylaşım :
        {{$store.getters.getUserPost.length}}
      </p>
      <p class="text text-center" v-if="$store.getters.getUserPost.length==0">
        Henüz Paylaşımınız Yok
        <router-link tag="a" to="/social">Buraya</router-link>
        Tıklayarak Paylaşım Oluşturabilirsiniz.
      </p>
    </flex>
    <div class="row">
      <div class="col">
        {{nextPageUrl}}
        <button type="button" class="btn btn-secondary btn-lg btn-block" @click="loadMore" v-if="nextPageUrl!=''">Daha
          Fazla Yükle
        </button>
      </div>
    </div>
  </div>
</template>

<script>
  import {
    Loading,
    FlexCard,
    Flex,
    VButton,
    VInput,
    appPlugin
  } from '@/Providers/defaultImports'
  import moment from 'moment'
  import { Datetime } from 'vue-datetime'
  import { FETCH_ALL_POST_TYPE } from '../../store/modules/posttype/moduleNames'
  import {
    DELETE_POST,
    FETCH_NEXT_POST,
    FETCH_NEXT_USERS_POST,
    FETCH_USER_POST,
    LIKE_POST, SET_POST_DETAIL_PASS_DATA
  } from '../../store/modules/post/moduleNames'
  import defaultImage from '@/assets/img/defaultavatar.png'
  import spost from '@/components/spost/index'
  import _ from 'underscore'
  import Vue from 'vue'

  export default {
    name: 'userpost',
    components: {
      FlexCard,
      Flex,
      Loading,
      VInput,
      VButton,
      spost,
      Datetime
    },
    created () {
      this.fetchPostType()

    },
    methods: {
      postDelete (item, i) {
        debugger
        this.$store.dispatch(DELETE_POST, { id: item.id, index: i, deletedType: 'mypost' }).then((res) => {
          if (res.status && res.status == 200) {
            debugger
            if(this.$store.getters.getUserPost.length<1){
              this.loadMore("deleted")
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
          likedPostType: 'mypost',
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
      loadMore (type) {
        debugger
        this.loading = true
debugger
        if (type && type == 'deleted') {
          let lastpageUrl = ''
          let pageUrl = ''
          let nextUri = +this.nextPageUrl.split('=')[1] - 1
          let lastUuri = +this.lastPageUrl.split('=')[1] - 1
          if (nextUri == 0) {
            debugger
            nextUri = 1
          }
          if (lastUuri == 0) {
            lastUuri = 1
          }
          pageUrl = this.nextPageUrl.split('=')[0] + '=' + nextUri
          debugger
          lastpageUrl = this.lastPageUrl.split('=')[0] + '=' + lastUuri
          this.$store.dispatch(FETCH_NEXT_USERS_POST, {
            url: pageUrl, query: {
              filterType: this.currentTabItem.id
            }
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
            this.$store.dispatch(FETCH_NEXT_USERS_POST, {
              url: this.nextPageUrl, query: {
                filterType: this.currentTabItem.id
              }
            }).then((res) => {
              debugger

              if (res.data.next_page_url != null) {
                this.nextPageUrl = res.data.next_page_url
              }
              this.loading = false
            }).catch((err) => {
              this.loading = false
              appPlugin.showalert(this.$t('warning'),
                this.$t('fetchError'), 'error',
                this.$t('ok'))
            })
            this.nextPageUrl = ''
            this.loading = false
          } else {
            debugger
            this.$store.dispatch(FETCH_NEXT_USERS_POST, {
              url: this.nextPageUrl, query: {
                filterType: this.currentTabItem.id
              }
            }).then((res) => {
              debugger
              if (res.data.next_page_url != null) {
                this.nextPageUrl = res.data.next_page_url
              }
              this.loading = false
            }).catch((err) => {
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
        debugger
        switch (tabItem.ptName) {
          case 'Tümü':
            this.fetchUserPost()
            return
          case 'Gönderi':

            this.fetchUserPost()

            return
          case 'Ödev':
            this.fetchUserPost()

            return
          case 'Sınav Tarihi':
            this.fetchUserPost()

            return
          case 'Etkinlik':
            this.fetchUserPost()

            return
          case 'Yemek Listesi':
            this.fetchUserPost()
            return
        }
        debugger

      },
      fetchUserPost () {
        debugger
        this.loading = true
        this.$store.dispatch(FETCH_USER_POST, {
          filterType: this.currentTabItem.id
        }).then((res) => {
          if (res.data.data.length > 0) {
            if (res.data.next_page_url != null) {
              this.nextPageUrl = res.data.next_page_url
            }
            this.lastPageUrl = res.data.last_page_url
          } else {
            this.nextPageUrl = ''
          }

          this.loading = false
          debugger
        }).catch((err) => {
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
          this.loading = false
        })
      },
      fetchPostType () {
        debugger
        this.loading = true
        this.$store.dispatch(FETCH_ALL_POST_TYPE).then((res) => {
          this.loading = false
          if (res) {
            debugger
            this.currentTabItem = {
              id: 0,
              ptName: 'Tümü'
            }
            res.unshift({
              id: 0,
              ptName: 'Tümü'
            })
            this.filterTab = res
            this.fetchUserPost()
          }
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
        })
      }
    },
    data () {
      return {
        defaultPreview: defaultImage,
        lastPageUrl: '',
        nextPageUrl: '',
        filterTab: [],
        currentTab: 1,
        currentTabItem: '',
        loading: false
      }
    }
  }
</script>

<style scoped>

</style>
