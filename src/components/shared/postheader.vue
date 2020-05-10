<template>
  <nav class="navbar navbar-top navbar-expand navbar-dark bg-danger border-bottom">
    <div class="container-fluid">
      <div class="collapse navbar-collapse" id="navbarSupportedContent">
        <ul class="navbar-nav align-items-center ml-md-auto">
          <li class="nav-item d-xl-none">
            <div
              class="pr-3 sidenav-toggler sidenav-toggler-dark"
              data-action="sidenav-pin"
              data-target="#sidenav-main"
            >
              <div class="sidenav-toggler-inner">
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
                <i class="sidenav-toggler-line"></i>
              </div>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a class="nav-link" href="#" role="button" data-toggle="dropdown" aria-haspopup="true"
               aria-expanded="false">
              <i class="fa fa-bell text-white">
              </i>
              {{$store.getters.getPNotification.length>0?$store.getters.getPNotification.length:''}}

            </a>
            <div class="dropdown-menu dropdown-menu-xl  dropdown-menu-right  py-0 overflow-hidden">
              <div class="px-3 py-3">
                <h6 class="text-sm text-muted m-0" v-if="$store.getters.getPNotification.length>0">Okunmamış <strong
                  class="text-primary">
                  {{$store.getters.getPNotification.length>0?$store.getters.getPNotification.length:''}}</strong>
                  Bildirim.</h6>
                <h6 class="text-sm text-muted m-0" v-else>Okunmamış Bildirim Yok</h6>
              </div>
              <!-- List group -->

              <div class="list-group list-group-flush">
                <a class="list-group-item list-group-item-action"
                   style="cursor: pointer"
                   @click.prevent="routePost(item)"
                   v-for="(item,i) in  $store.getters.getPNotification "
                >

                  <div class="row align-items-center">
                    <div class="col-auto">
                      <!-- Avatar -->
                      <img alt="Image placeholder" :src="item.touser.file.id==1?defaultPreview:item.touser.file.path"
                           class="avatar rounded-circle">
                    </div>
                    <div class="col ml--2">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 class="mb-0 text-sm">{{item.touser.uFullName}}</h4>
                        </div>
                        <div class="text-right text-muted">
                          <small>{{item.created_at|formatToday}}</small>
                        </div>
                      </div>
                      <p class="text-sm mb-0">{{item.ntype==1?'Gönderini Beğendi':'Gönderine Yorum Yaptı'}}</p>
                    </div>
                  </div>
                </a>
              </div>
              <router-link tag="a" to="/allnotification"
                           class="dropdown-item text-center text-primary font-weight-bold py-3">Tümünü Göster
              </router-link>
            </div>
          </li>
          <li class="nav-item dropdown">
            <a
              class="nav-link"
              href="#"
              role="button"
              data-toggle="dropdown"
              aria-haspopup="true"
              aria-expanded="false"
            >
              <i class="fa fa-language"></i>
            </a>
            <div class="dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden">
              <!-- Dropdown header -->
              <div class="px-3 py-3">
                <h6 class="text-sm text-muted m-0">Dil Seçiniz</h6>
              </div>
              <!-- List group -->
              <div class="list-group list-group-flush">
                <a
                  @click="setLang('tr')"
                  class="list-group-item list-group-item-action"
                  style="cursor: pointer !important;"
                >
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <img
                        alt="Türkçe"
                        src="../../assets/img/turkishflag.png"
                        style="width: 50px; height: 50px"
                      />
                    </div>
                    <div class="col ml--2">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 class="mb-0 text-sm">Türkçe</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
                <a
                  @click="setLang('en')"
                  class="list-group-item list-group-item-action"
                  style="cursor: pointer !important;"
                >
                  <div class="row align-items-center">
                    <div class="col-auto">
                      <!-- Avatar -->
                      <img
                        alt="İngilizce"
                        src="../../assets/img/englishflag.png"
                        style="width: 50px; height: 50px"
                      />
                    </div>
                    <div class="col ml--2">
                      <div class="d-flex justify-content-between align-items-center">
                        <div>
                          <h4 class="mb-0 text-sm">İngilizce</h4>
                        </div>
                      </div>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </li>
        </ul>
                <ul class="navbar-nav align-items-center ml-auto ml-md-0">
                  <li class="nav-item dropdown">
                    <a
                      class="nav-link pr-0"
                      href="#"
                      role="button"
                      data-toggle="dropdown"
                      aria-haspopup="true"
                      aria-expanded="false"
                    >
                      <div class="media align-items-center">
                        <span class="avatar avatar-sm rounded-circle">
                          <img alt="Image placeholder" src="../../assets/img/defaultavatar.png" />
                        </span>
                        <div class="media-body ml-2 d-none d-lg-block">
                          <span class="mb-0 text-sm font-weight-bold">Yasin Dalkılıç</span>
                        </div>
                      </div>
                    </a>
                    <div class="dropdown-menu dropdown-menu-right">
                      <div class="dropdown-header noti-title">
                        <h6 class="text-overflow m-0">Hoşgeldiniz!</h6>
                      </div>
                      <a href="#!" class="dropdown-item">
                        <i class="fa fa-share-square"></i>
                        <span>Gönderilerim</span>
                      </a>
                      <a href="#!" class="dropdown-item">
                        <i class="fa fa-lock"></i>
                        <span>Parola Değiştir</span>
                      </a>
                      <a href="#!" class="dropdown-item">
                          <i class="fa fa-user-edit"></i>
                        <span>Profili Düzenle</span>
                      </a>
                      <div class="dropdown-divider"></div>
                      <a href="#!" class="dropdown-item">
                        <i class="fa fa-sign-out-alt"></i>
                        <span>Çıkış Yap</span>
                      </a>
                    </div>
                  </li>
                </ul>
      </div>
    </div>
  </nav>
</template>

<script>
  import defaultImage from '@/assets/img/defaultavatar.png'
  import { FETCH_PNOTIFICATION, SET_PNOTIFICATION_READ } from '../../store/modules/pnotification/moduleNames'
  import appPlugin from '../../Providers/appPlugins'

  export default {
    created () {
      this.fetchNotification()
    },
    data () {
      return {
        defaultPreview: defaultImage,
      }
    },
    methods: {
      routePost (item) {
        this.$router.push('/postdetail/' + item.post_id)
        this.$store.dispatch(SET_PNOTIFICATION_READ, {
          id: item.id,
        }).then((res) => {
          console.log('okundu', res)
        }).catch((err) => {
          console.log('Bildirim Okunmadı')
        })
      },
      fetchNotification () {
        this.loading = true
        let query = appPlugin.urlParse('from_user_id=' + 2 + '& isRead=0')
        this.$store.dispatch(FETCH_PNOTIFICATION, { urlparse: query }).then((res) => {
          this.loading = false
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('getRecordErro'), 'error', this.$t('ok'))
        })
      },
      setLang (lang) {
        this.$store.dispatch('setLanguage', lang)
      }
    },
    name: 'postheader'
  }
</script>

<style scoped>
</style>
