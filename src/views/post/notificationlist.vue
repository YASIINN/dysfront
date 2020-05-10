<template>
  <div>
    <Loading v-if="loading"></Loading>
    <flex-card column="col-md-12  col-sm-12 col-lg-12" headerTitle="Bildirimler">
      <div class="card-body ">
        <div>
          <div class="row" v-for="(item,i) in notificationdata">
            <div class="col-md-12  col-sm-12 col-lg-12">
              <div class="card" style="cursor: pointer" @click="onRouteDetail(item)">
                <div class="card-header" :class="item.isRead==0?'activeNtf':''">
                  <div class="row align-items-center">
                    <div class="col-8">

                      <h3 class="mb-0"><img
                        :src="item.touser.file.id==1?defaultPreview:item.touser.file.path"
                        class="avatar rounded-circle float-left"/>
                        <h4 class="card-title float-left pl-2 mt-3">{{item.touser.uFullName.toUpperCase()}}
                          {{item.ntype==1?'Gönderini Beğendi':'Gönderine Yorum Yaptı'}}
                        </h4></h3>

                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">
              <p class="text text-center">Toplam Bildirim {{notificationdata.length>0?notificationdata.length:''}}</p>
            </div>
          </div>
          <div class="row">
            <div class="col-md-12 col-sm-12 col-lg-12">
              <button type="button" class="btn btn-secondary btn-lg btn-block" @click="loadMore()"
                      v-if="nexturl!=''">Daha
                Fazla Yükle
              </button>
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
  import {
    FETCH_ALL_NOTIFICATION,
    FETCH_NEXT_NOTIFICATION,
    SET_PNOTIFICATION_READ
  } from '../../store/modules/pnotification/moduleNames'
  import defaultImage from '@/assets/img/defaultavatar.png'

  export default {
    components: {
      FlexCard,
      Flex,
      Loading,
    },
    created () {

      this.fetchAllPostNotification()
    },
    methods: {
      onRouteDetail (item, i) {
        this.$router.push('/postdetail/' + item.post_id)
        this.$store.dispatch(SET_PNOTIFICATION_READ, {
          id: item.id,
        }).then((res) => {
          console.log('okundu', res)
        }).catch((err) => {
          console.log('Bildirim Okunmadı')
        })
      },
      loadMore () {
        this.loading = true
        let query = appPlugin.urlParse('from_user_id=' + 2)
        if (this.nexturl == this.lasturl) {
          debugger
          this.$store.dispatch(FETCH_NEXT_NOTIFICATION, {
            url: this.nexturl,
            urlparse: query,
          }).then((res) => {
            debugger
            if (res.data.length > 0) {
              res.data.forEach((item) => {
                this.notificationdata.push(item)
              })
            }
            if (res.next_page_url != null) {
              debugger
              this.lasturl = res.last_page_url
              this.nexturl = res.next_page_url
            }
            this.loading = false
          }).catch((err) => {
            debugger
            this.loading = false
            appPlugin.showalert(this.$t('warning'),
              this.$t('fetchError'), 'error',
              this.$t('ok'))
          })
          this.nexturl = ''
          this.loading = false
        } else {
          debugger
          this.$store.dispatch(FETCH_NEXT_NOTIFICATION, {
            url: this.nexturl,
            urlparse: query,
          }).then((res) => {
            debugger
            if (res.data.length > 0) {
              res.data.forEach((item) => {
                this.notificationdata.push(item)
              })
            }
            if (res.next_page_url != null) {
              debugger
              this.nexturl = res.next_page_url
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
      },
      fetchAllPostNotification () {
        this.loading = true
        let query = appPlugin.urlParse('from_user_id=' + 2)
        this.$store.dispatch(FETCH_ALL_NOTIFICATION, { urlparse: query }).then((res) => {
          this.loading = false
          debugger
          console.log(res)

          if (res.next_page_url != null) {
            this.nexturl = res.next_page_url
          }
          this.lasturl = res.last_page_url
          this.notificationdata = res.data
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))

        })
      }
    },
    data () {
      return {
        lasturl: '',
        nexturl: '',
        notificationdata: [],
        defaultPreview: defaultImage,
        loading: false,
      }
    },
    name: 'notificationlist'
  }
</script>

<style scoped>
  .activeNtf {
    background-color: #a1dff0 !important;
  }
</style>
