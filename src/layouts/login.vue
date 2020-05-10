<template>
  <div class="bg-default g-sidenav-show g-sidenav-pinned">
    <div class="main-content bgimg">
      <div class="header py-7 py-lg-8 pt-lg-9">
        <div class="container">
          <div class="header-body text-center mb-7">
            <div class="row justify-content-center">
              <div class="col-xl-5 col-lg-6 col-md-8 px-5"></div>
            </div>
          </div>
        </div>
      </div>
      <div class="container mt--8 pb-5">
        <router-view></router-view>
      </div>
    </div>
  </div>
   <!-- <footer class="py-5" id="footer-main">
      <div class="container">
        <div class="row align-items-center justify-content-xl-between">
          <div class="col-xl-6">
            <div class="copyright text-center text-xl-left text-muted">
              &copy; 2019
              <a
                href="https://www.creative-tim.com"
                class="font-weight-bold ml-1"
                target="_blank"
              >Zafer Koleji</a>
            </div>
          </div>
        </div>
      </div>
    </footer>-->
</template>

<script>
export default {
  name: "login"
};
</script>

<style >
.bgimg {
  background-image: linear-gradient(to right, rgba(255,0,0,0), rgba(255,0,0,1));
/*  background-image: url("http://img7.mynet.com/galeri/2016/02/29/115015841/6299874-600x406.jpg");

  background-size: 100% 100%;*/
}
</style>
