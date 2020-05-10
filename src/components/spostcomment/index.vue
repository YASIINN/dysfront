<template>
  <div class="card">
    <div class="card-header">
      <div class="row align-items-center">
        <div class="col-8">
          <h3 class="mb-0"><img
            :src="avatarUri"
            class="avatar float-left"/>
            <h4 class="card-title float-left pl-2">{{userName}} </h4></h3>
        </div>
        <div class="col-4 text-right">

          <a class="btn btn-sm btn-transparent ">
              <span class="btn-inner--icon">
                <i class="fa fa-thumbs-up" @click="likeComment"
                   :class="commentLike==true?'text-red':''"></i> {{commentLikeCount==0?'':commentLikeCount}}</span>
          </a>
          <a class="btn btn-sm btn-transparent " v-if="commentDelete" @click="deleteComment">
              <span class="btn-inner--icon">
                <i class="fa fa-trash"
                ></i> </span>
          </a>
          <!-- <span class="badge badge-pill text-white" :style="{ backgroundColor: posttagColor }">{{postTag}}</span>-->
        </div>
      </div>
    </div>
    <div class="card-body">


      <div class="pl-lg-4">
        <div class="row">
          <div class="col-lg-12 col-md-12 col-sm-12">
            <p class="text text-center text-darker">
              {{comment}}
            </p>
          </div>
        </div>
      <div class="row" v-if="commentFiles.length>0">
          <div class="col-12">
            <p v-for="item in commentFiles"><a :href="item.uri" target="_blank"><i class="fa fa-download"></i>
              {{item.fileName}}</a></p>
          </div>
        </div>
        <div class="row" v-if="commentImg.length>0">
          <div class="col-lg-12 col-md-12 col-xs-12 col-sm-12 ">
          <!--  <gallery :images="commentImg" :index="index" @close="index = null"></gallery>-->
            <a :href="image"  target="_blank"    v-for="(image, imageIndex) in commentImg">
            <div
              class="imageGallery img-thumbnail"

              :key="imageIndex"
              @click="index = imageIndex"
              :style="{ backgroundImage: 'url(' + image + ')', width: '100px', height: '100px' }"
            >

            </div>
            </a>

          </div>
        </div>
      </div>


      <div class="card-footer">
        <!--      <div class="row align-items-center">
                <div class="col-md-8 col-lg-8 col-sm-8">
                  <router-link tag="a" :to="'/postlikes/'+postId">
                    <i class="fa fa-thumbs-up active" v-if="likeCount!=0">
                      {{(userLike==true)&&likeCount>1 ?'Sen ve'+' '+(likeCount-1)+' '+'Diğer Kişi':likeCount}}
                    </i>
                  </router-link>

                </div>
              </div>-->
        <hr/>
        <div class="row align-items-center">


          <div class="col-md-8 col-lg-8 col-sm-8">
            Test
            <!--         <a class="btn btn-sm btn-secondary ">
                       <span class="btn-inner&#45;&#45;icon">
                         <i class="fa fa-thumbs-up" @click="likePost"
                            :class="userLike==true?'text-red':''"></i> </span>
                     </a>

                     <a class="btn btn-sm btn-secondary " v-if="commentVisible" @click="commentClick">
                       <span class="btn-inner&#45;&#45;icon"><i class="fa fa-comment"></i>{{commentCount==0?'':commentCount}}</span>
                     </a>

                     <a class="btn btn-sm btn-secondary" v-if="showViews" @click="routeViews">
                       <span class="btn-inner&#45;&#45;icon"><i class="fa fa-eye"></i>{{viewCount==0?'':viewCount}}</span>
                     </a>

                     <a class="btn btn-sm btn-secondary" v-if="showDelete" @click.prevent="onPostDelete">
                       <span class="btn-inner&#45;&#45;icon"><i class="fa fa-trash"></i></span>
                     </a>-->
          </div>
          <div class="col-sm-4 col-md-4 col-lg-4 text-right">
            <h4 class="text">{{commentDate|formatToday}}</h4>
          </div>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
  import VueGallery from 'vue-gallery'
  export default {
    components:{
      gallery: VueGallery
    },
    methods: {
      likeComment () {
        this.$emit('onLikeComment')

      },
      deleteComment () {
        this.$emit('onDeleteComment')
      }
    },
    data(){
      return{
        index:null
      }
    },
    props: {
      commentLikeCount: {},
      commentLike: {},
      commentDelete: {},
      commentImg: {},
      commentFiles: {},
      comment: {},
      avatarUri: {},
      userName: {},
      commentDate: {}
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
