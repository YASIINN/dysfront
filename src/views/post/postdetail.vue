<template>
  <div>
    <Loading v-if="loading"></Loading>

    <flex-card column="col-md-12  col-sm-12 col-lg-12" headerTitle="Gönderiyi Detay"
               v-if="$store.getters.getPostDetailPassedData.length>0">
      <div class="card-body">
        <div>
          <flex column="col-lg-12 col-sm-12 col-md-12 mt-5">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 order-xl-1"
                 v-for="(item,i) in $store.getters.getPostDetailPassedData">
              <spost
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
              <commentcreate :commentablePost="$store.getters.getPostDetailPassedData"
                             textareaplaceholder="Yorumunuzu Giriniz..."/>
            </div>
          </flex>
          <flex column="col-lg-12 col-sm-12 col-md-12 mt-5"
                v-if="$store.getters.getPostDetailPassedData[0].comments.length>0">
            <button class="btn btn-transparent   btn-block" @click="getComment">
              <i class="fa fa-redo"/>
              Yenile
            </button>
          </flex>
          <flex column="col-lg-12 col-sm-12 col-md-12 mt-5">
            <div class="col-xl-12 col-lg-12 col-md-12 col-sm-12 order-xl-1"
                 v-for="(item,i) in $store.getters.getPostDetailPassedData[0].comments">
              <scomment
                :commentFiles="item.dFiles"
                :commentImg="item.iFiles"
                @onLikeComment="onLikeComment(item,i)"
                :commentLikeCount="item.likes.length"
                @onDeleteComment="onDelete(item,i)"
                :commentLike="item.userLike"
                :commentDelete="item.commentDelete"
                :userName="item.user.uFullName"
                :avatarUri="item.user.file.id==1?defaultPreview:item.user.file.path"
                :comment="item.content"
                :commentDate="item.created_at"
              />

              <!--   {{$store.getters.getPostDetailPassedData[0].comments}}-->
            </div>
          </flex>
        </div>
      </div>
    </flex-card>
  </div>
</template>

<script>
  import {
    Loading,
    FlexCard,
    Flex,
    Swal,
    appPlugin
  } from '@/Providers/defaultImports'
  import spost from '@/components/spost/index'
  import scomment from '@/components/spostcomment/index'
  import commentcreate from '@/components/commentcreate/index'
  import {
    FETCH_POST_DETAIL,
    DELETE_POST,
    LIKE_POST,
    LIKE_COMMENT,
    DELETE_COMMENT, FETCH_POST_COMMENT
  } from '../../store/modules/post/moduleNames'
  import defaultImage from '@/assets/img/defaultavatar.png'
  import Vue from 'vue'
  import loadingMixins from '@/mixins/loading'

  export default {
    mixins: [loadingMixins],
    components: {
      FlexCard,
      Flex,
      Loading,
      spost,
      scomment,
      commentcreate
    },
    created () {
      if (isNaN(this.$route.params.id)) {
        this.$router.push('/social')
      } else {
        if (this.$store.getters.getPostDetailPassedData.length < 1) {
          //servis
          this.$store.dispatch(FETCH_POST_DETAIL, { id: this.$route.params.id }).then((res) => {
            if (res.data.length < 1) {
              this.$router.push('/social')
            }
            this.onCloseIndıcator()
          }).catch((err) => {
            this.onCloseIndıcator()
          })
        }
      }
    },
    methods: {
      getComment () {
        this.onOpenIndıcator()
        this.$store.dispatch(FETCH_POST_COMMENT, { postid: this.$route.params.id }).then((res) => {
          this.onCloseIndıcator()
        }).catch((err) => {
          this.onCloseIndıcator()
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
        })
      },
      onDelete (item, i) {
        //
        this.$store.dispatch(DELETE_COMMENT, {
          id: item.id,
          index: i
        }).then((res) => {
          debugger
          if (res.status && res.status == 200) {
            Vue.$toast.open({
              message: 'Yorum Silindi',
              type: 'success',
              position: 'bottom'
            })
          }
        }).catch((err) => {
          appPlugin.showalert(this.$t('warning'), this.$t('deleteRecordErrMsg'), 'error', this.$t('ok'))
        })
      },
      showView (item) {
        this.$router.push('/postviews/' + item.id)
      },
      onLikeComment (item, i) {
        debugger
        this.$store.dispatch(LIKE_COMMENT, {
          likedCommentType: 'detailpost',
          userid: 2,
          commentid: item.id,
          liketype: item.userLike == true ? 0 : 1
        }).then((res) => {
          debugger
        }).catch((err) => {
          debugger
          appPlugin.showalert(this.$t('warning'), 'Yorum Beğenme İşlemi Başarısız Oldu', 'error', this.$t('ok'))
        })
      },
      onLike (item, i) {
        debugger
        this.$store.dispatch(LIKE_POST, {
          likedPostType: 'detailpost',
          userid: 2,
          postid: item.id,
          liketype: item.userLike == true ? 0 : 1
        }).then((res) => {
          debugger
        }).catch((err) => {
          debugger
          appPlugin.showalert(this.$t('warning'), 'Gönderi Beğenme İşlemi Başarısız Oldu', 'error', this.$t('ok'))
        })
      },
      postDelete (item, i) {
        debugger
        this.$store.dispatch(DELETE_POST, { id: item.id, index: i, deletedType: 'postdetail' }).then((res) => {
          debugger
          this.$router.push('/social')
          if (res.status && res.status == 200) {
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
    },
    data () {
      return {
        defaultPreview: defaultImage,
      }
    },
    name: 'postdetail'
  }
</script>

<style scoped>

</style>
