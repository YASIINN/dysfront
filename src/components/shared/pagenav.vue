<template>
  <nav
    class="sidenav navbar navbar-vertical fixed-left navbar-expand-xs navbar-light bg-white"
    id="sidenav-main"
  >
    <div class="scrollbar-inner">
      <div class="sidenav-header d-flex align-items-center">
        <a class="navbar-brand" href="#">
          <img src="../../assets/img/logo.png" class="navbar-brand-img" alt="..." />
        </a>
        <div class="ml-auto">
          <div
            class="sidenav-toggler d-none d-xl-block"
            data-action="sidenav-unpin"
            data-target="#sidenav-main"
          >
            <div class="sidenav-toggler-inner">
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
              <i class="sidenav-toggler-line"></i>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar-inner">
        <!-- Collapse -->
        <div class="collapse navbar-collapse" id="sidenav-collapse-main">
          <!-- Nav items -->
          <ul class="navbar-nav">
            <li class="nav-item" v-for="(item,index) in router">
              <!--active-->

              <a
                class="nav-link"
                :href="'#'+item.hashfragment"
                data-toggle="collapse"
                role="button"
                v-if="item.subRoute.length>0"
                aria-expanded="false"
                :aria-controls="item.hashfragment"
              >
                <i :class="item.icon+ ' ' + item.class"></i>
                <span class="nav-link-text">{{item.label}}</span>
              </a>
              <div>
                <!--                <router-link active-class="active" exact tag="a" class="nav-link" aria-expanded="false"
                                             :aria-controls="item.hashfragment" v-if="item.subRoute.length>0"
                                             @click.native.prevent="collapseRoute(item.hashfragment)"
                                             to=""
                                             data-toggle="collapse" role="button">
                                  <i :class="item.icon+ ' ' + item.class"></i>
                                  <span class="nav-link-text">{{item.label}}</span>
                </router-link>-->
              </div>
              <!--       <router-link active-class="active" tag="a" class="nav-link" aria-expanded="false"
                                  :aria-controls="item.hashfragment" v-if="item.subRoute.length>0"
                                  :to="{name:'/', hash:'#'+item.hashfragment}"
                                  data-toggle="collapse" role="button">
                       <i :class="item.icon+ ' ' + item.class"></i>
                       <span class="nav-link-text">{{item.label}}</span>
              </router-link>-->
              <!--active-->
              <router-link
                exact
                active-class="active"
                v-if="item.subRoute.length<1"
                :to="item.route"
                class="nav-link"
              >
                <i :class="item.icon+ ' ' + item.class"></i>
                <span class="nav-link-text">{{item.label}}</span>
              </router-link>
              <div class="collapse" :id="item.hashfragment" v-if="item.subRoute.length>0">
                <ul class="nav nav-sm flex-column">
                  <li class="nav-item" v-for="subitem in item.subRoute">
                    <router-link
                      tag="a"
                      exact
                      active-class="active"
                      class="nav-link"
                      :class="subitem.class"
                      :to="subitem.route"
                    >{{subitem.label}}</router-link>
                  </li>
                </ul>
              </div>
            </li>
          </ul>
          <hr class="my-3" />
          <h6 class="navbar-heading p-0 text-muted">Ayar</h6>
          <!-- Navigation -->
          <!--  <ul class="navbar-nav mb-md-3">
              <li class="nav-item">
                <a class="nav-link" href="../../docs/getting-started/overview.html" target="_blank">
                  <i class="ni ni-spaceship"></i>
                  <span class="nav-link-text">Getting started</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../../docs/foundation/colors.html" target="_blank">
                  <i class="ni ni-palette"></i>
                  <span class="nav-link-text">Foundation</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../../docs/components/alerts.html" target="_blank">
                  <i class="ni ni-ui-04"></i>
                  <span class="nav-link-text">Components</span>
                </a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="../../docs/plugins/charts.html" target="_blank">
                  <i class="ni ni-chart-pie-35"></i>
                  <span class="nav-link-text">Plugins</span>
                </a>
              </li>
          </ul>-->
        </div>
      </div>
    </div>
  </nav>
</template>

<script>
import { routeData } from "@/Providers/appConstants";

export default {
  watch: {
    /*      $route (route) {

              $(route.hash).collapse('toggle')
            }*/
  },
  methods: {
    collapseRoute(route) {
      // ;
      $("#" + route).collapse("toggle");
    },
    setActiveClass() {}
  },
  data() {
    return {
      router: routeData
    };
  },
  name: "pagenav"
};
</script>

<style scoped>
</style>
