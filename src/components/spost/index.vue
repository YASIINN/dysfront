<template>
  <div class="card">
    <div class="card-header">
      <div class="row align-items-center">
        <div class="col-8">
          <h3 class="mb-0"><img
            :src="avatarUri"
            class="avatar float-left"/>
            <h4 class="card-title float-left pl-2">{{userName}} ({{userTitle}})</h4></h3>
        </div>
        <div class="col-4 text-right">
          <span class="badge badge-pill badge-secondary">{{postType=='Gönderi'?'':postType}}</span>
          <span class="badge badge-pill text-white" :style="{ backgroundColor: posttagColor }">{{postTag}}</span>
        </div>
      </div>
    </div>
    <div class="card-body">


      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <p class="text text-center text-darker">

              {{postContent}}

            </p>
            <p class="text text-center" v-if="postType=='Sınav Tarihi'">
              Sınav Adı :{{examName==null?'':examName}}
            </p>
            <p class="text text-center" v-if="postType=='Sınav Tarihi'">
              Sınav Tarihi :{{postTDate==null?'':postTDate|formatDate}}
            </p>

            <p class="text text-center" v-if="postType=='Etkinlik'">
              Etkinlik Tarihi : {{postTDate==null?'':postTDate|formatDate}}
            </p>
            <p class="text text-center" v-if="postType=='Etkinlik'">
              Etkinlik Saati : {{eHour==null?'':eHour}}

            </p>
            <p class="text text-center" v-if="postType=='Ödev'">
              Ödevin Verildiği Ders :{{lessonName=='-'?'':lessonName }}
            </p>
            <p class="text text-center" v-if="postType=='Ödev'">
              Ödev Türü :{{postCategory=='-'?'':postCategory}}
            </p>
            <p class="text text-center" v-if="postType=='Ödev'">
              Ödev Tahmini Bitirme Süresi :{{postHour=='-'?'':postHour + ' ' +'DK'}}
            </p>
            <p class="text text-center" v-if="postType=='Ödev'">
              Ödev Teslim Tarihi :{{postTDate==null?'':postTDate|formatDate}}
            </p>

          </div>
        </div>
        <div class="row" v-if="postFiles.length>0">
          <div class="col-12">
            <p v-for="item in postFiles"><a :href="item.uri" target="_blank"><i class="fa fa-download"></i>
              {{item.fileName}}</a></p>
          </div>
        </div>
        <div class="row" v-if="postImg.length>0">
          <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
            <gallery :images="postImg" :index="index" @close="index = null"></gallery>
            <div
              class="imageGallery img-thumbnail"
              v-for="(image, imageIndex) in postImg"
              :key="imageIndex"
              @click="index = imageIndex"
              :style="{ backgroundImage: 'url(' + image + ')', width: '100px', height: '100px' }"
            >
            </div>


          </div>
        </div>
      </div>


      <div class="card-footer">
        <div class="row align-items-center">
          <div class="col-md-8 col-lg-8 col-sm-8">
            <router-link tag="a" :to="'/postlikes/'+postId">
              <i class="fa fa-thumbs-up active" v-if="likeCount!=0">
                {{(userLike==true)&&likeCount>1 ?'Sen ve'+' '+(likeCount-1)+' '+'Diğer Kişi':likeCount}}
              </i>
            </router-link>

          </div>
        </div>
        <hr/>
        <div class="row align-items-center">


          <div class="col-md-8 col-lg-8 col-sm-8">

            <a class="btn btn-sm btn-transparent ">
              <span class="btn-inner--icon">
                <i class="fa fa-thumbs-up" @click="likePost"
                   :class="userLike==true?'text-red':''"></i> </span>
              <span class="btn-inner--icon">
          </span>
            </a>

            <a class="btn btn-sm btn-transparent " v-if="commentVisible" @click="commentClick">
              <span class="btn-inner--icon"><i
                class="fa fa-comment"></i>{{commentCount==0?'':commentCount}} Yanıt</span>
            </a>

            <a class="btn btn-sm btn-transparent" v-if="showViews" @click="routeViews">
              <span class="btn-inner--icon"><i class="fa fa-eye"></i>{{viewCount==0?'':viewCount}}</span>
            </a>

            <a class="btn btn-sm btn-transparent" v-if="showDelete" @click.prevent="onPostDelete">
              <span class="btn-inner--icon"><i class="fa fa-trash"></i></span>
            </a>
          </div>
          <div class="col-sm-4 col-md-4 col-lg-4 text-right">
            <h4 class="text">{{postDate|formatToday}}</h4>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import VueGallery from 'vue-gallery'
  import appPlugin from '../../Providers/appPlugins'
  import Vue from 'vue'

  export default {
    components: {
      gallery: VueGallery
    },
    data () {
      return {
        index: null
      }
    },
    methods: {
      commentClick () {
        this.$emit('onComment')
      },
      routeViews () {
        this.$emit('onViewPost')
        /*postviews*/
      },
      seeLikeUser () {
      },
      likePost () {
        this.$emit('onLike')
      },
      onPostDelete () {
        this.$emit('onDelete')
      }
    },
    props: {
      showViews: {},
      eHour: {},
      postId: {},
      commentVisible: {},
      examName: {},
      postHour: {},
      postTDate: {},
      postCategory: {},
      postType: {},
      showDelete: {},
      postDate: {},
      viewCount: {},
      posttagColor: {},
      postFiles: {},
      postImg: {},
      userLike: {},
      commentCount: {},
      likeCount: {},
      postContent: {},
      avatarUri: {},
      userName: {},
      userTitle: {},
      postTag: {},
      postClass: {},
      lessonName: {}
    },
    name: 'index'
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
