<template>
  <nav class="navbar navbar-top navbar-expand navbar-dark bg-primary border-bottom">
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
          <!--          <li class="nav-item dropdown">-->
          <!--            <a-->
          <!--              class="nav-link"-->
          <!--              href="#"-->
          <!--              role="button"-->
          <!--              data-toggle="dropdown"-->
          <!--              aria-haspopup="true"-->
          <!--              aria-expanded="false"-->
          <!--            >-->
          <!--              <i class="ni ni-bell-55"></i>-->
          <!--            </a>-->
          <!--            <div class="dropdown-menu dropdown-menu-xl dropdown-menu-right py-0 overflow-hidden">-->
          <!--              &lt;!&ndash; Dropdown header &ndash;&gt;-->
          <!--              <div class="px-3 py-3">-->
          <!--                <h6 class="text-sm text-muted m-0">-->
          <!--                  You have-->
          <!--                  <strong class="text-primary">13</strong> notifications.-->
          <!--                </h6>-->
          <!--              </div>-->
          <!--              &lt;!&ndash; List group &ndash;&gt;-->
          <!--              <div class="list-group list-group-flush">-->
          <!--                <a href="#!" class="list-group-item list-group-item-action">-->
          <!--                  <div class="row align-items-center">-->
          <!--                    <div class="col-auto">-->
          <!--                      &lt;!&ndash; Avatar &ndash;&gt;-->
          <!--                      <img alt="Image placeholder" src class="avatar rounded-circle" />-->
          <!--                    </div>-->
          <!--                    <div class="col ml&#45;&#45;2">-->
          <!--                      <div class="d-flex justify-content-between align-items-center">-->
          <!--                        <div>-->
          <!--                          <h4 class="mb-0 text-sm">John Sn222ow</h4>-->
          <!--                        </div>-->
          <!--                        <div class="text-right text-muted">-->
          <!--                          <small>2 hrs ago</small>-->
          <!--                        </div>-->
          <!--                      </div>-->
          <!--                      <p class="text-sm mb-0">Let's meet at Starbucks at 11:30. Wdyt?</p>-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </a>-->
          <!--                <a href="#!" class="list-group-item list-group-item-action">-->
          <!--                  <div class="row align-items-center">-->
          <!--                    <div class="col-auto">-->
          <!--                      &lt;!&ndash; Avatar &ndash;&gt;-->
          <!--                      <img alt="Image placeholder" src class="avatar rounded-circle" />-->
          <!--                    </div>-->
          <!--                    <div class="col ml&#45;&#45;2">-->
          <!--                      <div class="d-flex justify-content-between align-items-center">-->
          <!--                        <div>-->
          <!--                          <h4 class="mb-0 text-sm">John Snow</h4>-->
          <!--                        </div>-->
          <!--                        <div class="text-right text-muted">-->
          <!--                          <small>3 hrs ago</small>-->
          <!--                        </div>-->
          <!--                      </div>-->
          <!--                      <p class="text-sm mb-0">A new issue has been reported for Argon.</p>-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </a>-->
          <!--                <a href="#!" class="list-group-item list-group-item-action">-->
          <!--                  <div class="row align-items-center">-->
          <!--                    <div class="col-auto">-->
          <!--                      &lt;!&ndash; Avatar &ndash;&gt;-->
          <!--                      <img alt="Image placeholder" src class="avatar rounded-circle" />-->
          <!--                    </div>-->
          <!--                    <div class="col ml&#45;&#45;2">-->
          <!--                      <div class="d-flex justify-content-between align-items-center">-->
          <!--                        <div>-->
          <!--                          <h4 class="mb-0 text-sm">John Snow</h4>-->
          <!--                        </div>-->
          <!--                        <div class="text-right text-muted">-->
          <!--                          <small>5 hrs ago</small>-->
          <!--                        </div>-->
          <!--                      </div>-->
          <!--                      <p class="text-sm mb-0">Your posts have been liked a lot.</p>-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </a>-->
          <!--                <a href="#!" class="list-group-item list-group-item-action">-->
          <!--                  <div class="row align-items-center">-->
          <!--                    <div class="col-auto">-->
          <!--                      &lt;!&ndash; Avatar &ndash;&gt;-->
          <!--                      <img alt="Image placeholder" src class="avatar rounded-circle" />-->
          <!--                    </div>-->
          <!--                    <div class="col ml&#45;&#45;2">-->
          <!--                      <div class="d-flex justify-content-between align-items-center">-->
          <!--                        <div>-->
          <!--                          <h4 class="mb-0 text-sm">John Snow</h4>-->
          <!--                        </div>-->
          <!--                        <div class="text-right text-muted">-->
          <!--                          <small>2 hrs ago</small>-->
          <!--                        </div>-->
          <!--                      </div>-->
          <!--                      <p class="text-sm mb-0">Let's meet at Starbucks at 11:30. Wdyt?</p>-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </a>-->
          <!--                <a href="#!" class="list-group-item list-group-item-action">-->
          <!--                  <div class="row align-items-center">-->
          <!--                    <div class="col-auto">-->
          <!--                      &lt;!&ndash; Avatar &ndash;&gt;-->
          <!--                      <img alt="Image placeholder" src class="avatar rounded-circle" />-->
          <!--                    </div>-->
          <!--                    <div class="col ml&#45;&#45;2">-->
          <!--                      <div class="d-flex justify-content-between align-items-center">-->
          <!--                        <div>-->
          <!--                          <h4 class="mb-0 text-sm">John Snow</h4>-->
          <!--                        </div>-->
          <!--                        <div class="text-right text-muted">-->
          <!--                          <small>3 hrs ago</small>-->
          <!--                        </div>-->
          <!--                      </div>-->
          <!--                      <p class="text-sm mb-0">A new issue has been reported for Argon.</p>-->
          <!--                    </div>-->
          <!--                  </div>-->
          <!--                </a>-->
          <!--              </div>-->
          <!--              &lt;!&ndash; View all &ndash;&gt;-->
          <!--              <a-->
          <!--                href="#!"-->
          <!--                class="dropdown-item text-center text-primary font-weight-bold py-3"-->
          <!--              >View all</a>-->
          <!--            </div>-->
          <!--          </li>-->
          <!--          <li class="nav-item dropdown">-->
          <!--            <a-->
          <!--              class="nav-link"-->
          <!--              href="#"-->
          <!--              role="button"-->
          <!--              data-toggle="dropdown"-->
          <!--              aria-haspopup="true"-->
          <!--              aria-expanded="false"-->
          <!--            >-->
          <!--              <i class="ni ni-ungroup"></i>-->
          <!--            </a>-->
          <!--            <div-->
          <!--              class="dropdown-menu dropdown-menu-lg dropdown-menu-dark bg-default dropdown-menu-right"-->
          <!--            >-->
          <!--              <div class="row shortcuts px-4">-->
          <!--                <a href="#!" class="col-4 shortcut-item">-->
          <!--                  <span class="shortcut-media avatar rounded-circle bg-gradient-red">-->
          <!--                    <i class="ni ni-calendar-grid-58"></i>-->
          <!--                  </span>-->
          <!--                  <small>Calendar</small>-->
          <!--                </a>-->
          <!--                <a href="#!" class="col-4 shortcut-item">-->
          <!--                  <span class="shortcut-media avatar rounded-circle bg-gradient-orange">-->
          <!--                    <i class="ni ni-email-83"></i>-->
          <!--                  </span>-->
          <!--                  <small>Email</small>-->
          <!--                </a>-->
          <!--                <a href="#!" class="col-4 shortcut-item">-->
          <!--                  <span class="shortcut-media avatar rounded-circle bg-gradient-info">-->
          <!--                    <i class="ni ni-credit-card"></i>-->
          <!--                  </span>-->
          <!--                  <small>Payments</small>-->
          <!--                </a>-->
          <!--                <a href="#!" class="col-4 shortcut-item">-->
          <!--                  <span class="shortcut-media avatar rounded-circle bg-gradient-green">-->
          <!--                    <i class="ni ni-books"></i>-->
          <!--                  </span>-->
          <!--                  <small>Reports</small>-->
          <!--                </a>-->
          <!--                <a href="#!" class="col-4 shortcut-item">-->
          <!--                  <span class="shortcut-media avatar rounded-circle bg-gradient-purple">-->
          <!--                    <i class="ni ni-pin-3"></i>-->
          <!--                  </span>-->
          <!--                  <small>Maps</small>-->
          <!--                </a>-->
          <!--                <a href="#!" class="col-4 shortcut-item">-->
          <!--                  <span class="shortcut-media avatar rounded-circle bg-gradient-yellow">-->
          <!--                    <i class="ni ni-basket"></i>-->
          <!--                  </span>-->
          <!--                  <small>Shop</small>-->
          <!--                </a>-->
          <!--              </div>-->
          <!--            </div>-->
          <!--          </li>-->
        </ul>
        <!--        <ul class="navbar-nav align-items-center ml-auto ml-md-0">-->
        <!--          <li class="nav-item dropdown">-->
        <!--            <a-->
        <!--              class="nav-link pr-0"-->
        <!--              href="#"-->
        <!--              role="button"-->
        <!--              data-toggle="dropdown"-->
        <!--              aria-haspopup="true"-->
        <!--              aria-expanded="false"-->
        <!--            >-->
        <!--              <div class="media align-items-center">-->
        <!--                <span class="avatar avatar-sm rounded-circle">-->
        <!--                  <img alt="Image placeholder" src />-->
        <!--                </span>-->
        <!--                <div class="media-body ml-2 d-none d-lg-block">-->
        <!--                  <span class="mb-0 text-sm font-weight-bold">John Snow</span>-->
        <!--                </div>-->
        <!--              </div>-->
        <!--            </a>-->
        <!--            <div class="dropdown-menu dropdown-menu-right">-->
        <!--              <div class="dropdown-header noti-title">-->
        <!--                <h6 class="text-overflow m-0">Welcome!</h6>-->
        <!--              </div>-->
        <!--              <a href="#!" class="dropdown-item">-->
        <!--                <i class="ni ni-single-02"></i>-->
        <!--                <span>My profile</span>-->
        <!--              </a>-->
        <!--              <a href="#!" class="dropdown-item">-->
        <!--                <i class="ni ni-settings-gear-65"></i>-->
        <!--                <span>Settings</span>-->
        <!--              </a>-->
        <!--              <a href="#!" class="dropdown-item">-->
        <!--                <i class="ni ni-calendar-grid-58"></i>-->
        <!--                <span>Activity</span>-->
        <!--              </a>-->
        <!--              <a href="#!" class="dropdown-item">-->
        <!--                <i class="ni ni-support-16"></i>-->
        <!--                <span>Support</span>-->
        <!--              </a>-->
        <!--              <div class="dropdown-divider"></div>-->
        <!--              <a href="#!" class="dropdown-item">-->
        <!--                <i class="ni ni-user-run"></i>-->
        <!--                <span>Logout</span>-->
        <!--              </a>-->
        <!--            </div>-->
        <!--          </li>-->
        <!--        </ul>-->
      </div>
    </div>
  </nav>
</template>

<script>
export default {
  methods: {
    setLang(lang) {
      this.$store.dispatch("setLanguage", lang);
    }
  },
  name: "pageheader"
};
</script>

<style scoped>
</style>
