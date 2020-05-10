<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" headerTitle="Gönderiyi Beğenenler">
      <div class="card-body">
        <div>
          <div class="row" v-for="item in $store.getters.getPostLikeUser">
            <div class="col-md-12  col-sm-12 col-lg-12">
              <div class="card">
                <div class="card-header">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <h3 class="mb-0"><img
                        :src="item.file.id==1?defaultPreview:item.file.path"
                        class="avatar rounded-circle float-left"/>
                        <h4 class="card-title float-left pl-2 mt-3">{{item.uFullName.toUpperCase()}}</h4></h3>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
  import { FETCH_POST_LIKE_USER } from '../../store/modules/post/moduleNames'
  import defaultImage from '@/assets/img/defaultavatar.png'

  export default {
    components: {
      FlexCard,
      Flex,
      Loading,
    },
    created () {
      this.getPostLikeUser()
    },
    methods: {
      getPostLikeUser () {
        if (isNaN(this.$route.params.id)) {
          this.$router.push('/social')
        } else {
          this.loading = true
          this.$store.dispatch(FETCH_POST_LIKE_USER, { id: this.$route.params.id }).then((res) => {
            this.loading = false
          }).catch((err) => {
            this.$router.push('/social')
            this.loading = false
          })
        }
      }
    },
    data () {
      return {
        defaultPreview: defaultImage,
        loading: false,
      }
    },
    name: 'postlikes'
  }
</script>

<style scoped>

</style>
