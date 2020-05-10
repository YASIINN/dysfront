<template>
  <div class="row justify-content-center">
    <div class="col-lg-5 col-md-7">
      <div class="card bg-secondary border-0 mb-0">
        <div class="card-body px-lg-5 py-lg-5">
          <img
            src="data:image/png;base64,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"
            class="rounded-circle img-center img-fluid shadow shadow-lg--hover"
            style="width: 140px;"
          />
          <div class="text-center text-muted mb-4">
            <small>Zafer Koleji DYS Giriş</small>
          </div>
          <form role="form">
            <div
              class="form-group mb-3"
              :class="{'has-danger':$v.user.useremail.$error,'has-success':!$v.user.useremail.$error}"
            >
              <div class="input-group input-group-merge input-group-alternative">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="ni ni-email-83"></i>
                  </span>
                </div>
                <input
                  class="form-control"
                  :class="{'is-invalid':$v.user.useremail.$error,'is-valid':!$v.user.useremail.$error}"
                  placeholder="Email"
                  type="email"
                  v-model.trim="$v.user.useremail.$model"
                />
                <div class="invalid-feedback">
                  <small v-if="!$v.user.useremail.required">Lütfen Email Adresini Giriniz</small>
                  <small v-if="!$v.user.useremail.email">Lütfen Geçerli Bir Email Adresini Giriniz</small>
                </div>
              </div>
            </div>
            <div
              class="form-group"
              :class="{'has-danger':$v.user.userpassword.$error,'has-success':!$v.user.userpassword.$error}"
            >
              <div class="input-group input-group-merge input-group-alternative">
                <div class="input-group-prepend">
                  <span class="input-group-text">
                    <i class="ni ni-lock-circle-open"></i>
                  </span>
                </div>
                <input
                  class="form-control"
                  :class="{'is-invalid':$v.user.userpassword.$error,'is-valid':!$v.user.userpassword.$error}"
                  placeholder="Parola.."
                  v-model.trim="$v.user.userpassword.$model"
                  type="password"
                />
                <div class="invalid-feedback">
                  <small v-if="!$v.user.userpassword.required">Lütfen Parola Giriniz</small>
                  <small v-if="!$v.user.userpassword.minLength">Parolanız 8 Karakterden Küçük Olamaz</small>
                </div>
              </div>
            </div>
            <div class="custom-control custom-control-alternative custom-checkbox">
              <input class="custom-control-input" id=" customCheckLogin" type="checkbox" />
              <label class="custom-control-label" for="customCheckLogin">
                <span class="text-muted">Remember me</span>
              </label>
            </div>
            {{$v.error}}
            <div class="text-center">
              <button type="button" class="btn btn-primary my-4" @click="onLoginControl">Giriş Yap</button>
            </div>
          </form>
        </div>
      </div>
      <div class="row mt-3">
        <div class="col-6">
          <a href="#" class="text-light">
            <small>Forgot password?</small>
          </a>
        </div>
        <div class="col-6 text-right">
          <a href="#" class="text-light">
            <small>Create new account</small>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Login from "@/layouts/login";
import { required, email, minLength } from "vuelidate/lib/validators";
import appPlugin from "@/Providers/appPlugins";
export default {
  name: "index",
  components: { Login },
  methods: {
    onLoginControl() {
      if (this.$v.$invalid) {
        appPlugin.showalert(
          "Uyarı",
          "Lütfen Geçerli Bir Email Adresi Ve Parola Giriniz",
          "warning",
          "Tamam"
        );
      } else {
        appPlugin.showalert("ttt", "aaa", "success", "tm");
      }
    }
  },
  data() {
    return {
      user: {
        useremail: "",
        userpassword: ""
      },
      name: "",
      age: 0
    };
  },
  validations: {
    user: {
      useremail: {
        required,
        email
      },
      userpassword: {
        required,
        minLength: minLength(8)
      }
    }
  }
};
</script>

<style scoped>
</style>
