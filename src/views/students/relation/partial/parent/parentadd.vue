<template>
  <div>
    <div class>
      <div class="row">
        <div class="col-md-4">
          <ACard type="frame">
            <h3 slot="header" class="mb-0">Resim Yükle</h3>
            <div class="text-center">
              <img
             v-if="view"
                :src="susermodel.file ? susermodel.file_path:viewImage"
                alt="Photo de profil"
                height="150px"
                width="150px"
                class="rounded-circle"
              />
                 <img
                v-if="!view"
                :src="viewImage"
                alt="Photo de profil"
                height="150px"
                width="150px"
                class="rounded-circle">
              <br />
              <br />
              <div class="upload-btn-wrapper">
                <button class="btnupload">Veli Resmi Seçin</button>
                <input type="file" @change="onChange" accept="image/*" />
              </div>
            </div>
            <br>
            <div class="text-center">
              <label> Yakınlık </label>
              <multiselect v-model="susermodel.proximities" track-by="name" label="name" :multiple="false" :options="filterProximities" :searchable="true" :allow-empty="false"></multiselect>

              <label> Cinsiyet </label>
              <multiselect v-model="susermodel.gender" track-by="name" label="name" :multiple="false" :options="optionsGender" :searchable="true" :allow-empty="false"></multiselect>
            </div>
          </ACard>
        </div>
        <div class="col-md-8">
          <ACard type="frame">
            <div class="row">
              <div class="col-md-6">
                <AInput
                  v-model="$v.susermodel.name.$model"
                  label="Adı"
                  placeholder="Adı"
                  :class="status($v.susermodel.name)"
                />
                <div
                  class="error"
                  v-if="!$v.susermodel.name.minLength"
                >Adı alanı en az {{$v.susermodel.name.$params.minLength.min}} karakter olmalıdır.</div>
              </div>
              <div class="col-md-6">
                <AInput
                  v-model="$v.susermodel.surname.$model"
                  label="Soyadı"
                  placeholder="Soyadı"
                  :class="status($v.susermodel.surname)"
                />
                <div
                  class="error"
                  v-if="!$v.susermodel.surname.minLength"
                >Soyadı alanı en az {{$v.susermodel.surname.$params.minLength.min}} karakter olmalıdır.</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <AInput v-model="susermodel.job" label="Meslek" placeholder="Meslek" />
              </div>

              <div class="col-md-6">
                <Label>Doğum Tarihi</Label>
                <d-picker :mode="'single'" :minDate="'1980-01-01'" @picker="getPicker"></d-picker>
              </div>
            </div>
            <div class="row">
              <div class="col-md-6">
                <AInput
                  v-model="$v.susermodel.email.$model"
                  label="E-Posta"
                  placeholder="Email"
                  :class="status($v.susermodel.email)"
                />
                <div class="error" v-if="!$v.susermodel.email.email">Geçerli bir email girilmelidir.</div>
              </div>
              <div class="col-md-6">
                <AInput
                  v-model="$v.susermodel.tc.$model"
                  label="Tc No"
                  placeholder="Tc No"
                  :class="status($v.susermodel.tc)"
                />
                <div
                  class="error"
                  v-if="!$v.susermodel.tc.minLength"
                >Tc Kimlik No {{$v.susermodel.tc.$params.minLength.min}} haneden oluşur.</div>
                <div class="error" v-if="!$v.susermodel.tc.numeric">Lütfen sadece rakam giriniz.</div>
              </div>
            </div>

            <div class="row">
              <div class="col-md-6">
                <Label>Cep Tel</Label>
                <masked-input
                  mask="\0 (111) 111-11-11"
                  class="form-control"
                  placeholder="Ev Tel"
                  v-model="$v.susermodel.phone.$model"
                />
                <div
                  class="error"
                  v-if="!$v.susermodel.phone.minLength"
                >Telefon numarası başında 0 ile baraber {{$v.susermodel.phone.$params.minLength.min}} haneden oluşur.</div>
                <div
                  class="error"
                  v-if="!$v.susermodel.phone.maxLength"
                >Telefon numarası başında 0 ile baraber {{$v.susermodel.phone.$params.maxLength.max}} haneden oluşur.</div>
              </div>
              <div class="col-md-6">
                <Label>Ev veya 2. Cep Tel</Label>
                <masked-input
                  mask="\0 (111) 111-11-11"
                  class="form-control"
                  placeholder="Ev Tel"
                  v-model="$v.susermodel.otherphone.$model"
                />
                <div
                  class="error"
                  v-if="!$v.susermodel.otherphone.minLength"
                >Telefon numarası başında 0 ile baraber {{$v.susermodel.phone.$params.minLength.min}} haneden oluşur.</div>
                <div
                  class="error"
                  v-if="!$v.susermodel.otherphone.maxLength"
                >Telefon numarası başında 0 ile baraber {{$v.susermodel.otherphone.$params.maxLength.max}} haneden oluşur.</div>
              </div>
              <div class="col-md-12">
                <br>
                <label> Adres</label>
                <textarea v-model="$v.susermodel.address.$model" class="form-control form-control-alternative"
                          rows="3" placeholder="Adres..."></textarea>

              </div>
            </div>
          </ACard>
        </div>
      </div>
    </div>
    <div class="card">
      <div class="card-body py-3 mb-1">
        <div class="row">
          <div class="col-md-4">
            <div class="col-md-12">
              <ACheckBox
                :acbId="'emailnotification'"
                v-model="susermodel.emailnotification"
              >Email bildirimleri alsın.</ACheckBox>
            </div>
          </div>
          <div class="col-md-4">
            <div class="col-md-12">
              <ACheckBox
                :acbId="'smsnotification'"
                v-model="susermodel.smsnotification"
              >Sms bildirimleri alsın.</ACheckBox>
            </div>
          </div>
          <div class="col-md-4">
            <div class="col-md-12">
              <ACheckBox :acbId="'suseractive'" v-model="susermodel.isActive">Aktif</ACheckBox>
            </div>
          </div>
        </div>
        <button
          class="btn btn-primary float-right"
          @click="save"
        >{{ susermodel.type ==='add' ? 'Kaydet':'Güncelle'}}</button>
      </div>
    </div>
  </div>
</template>
<script>
import {
  required,
  minLength,
  maxLength,
  between,
  helpers,
  numeric,
  email
} from "vuelidate/lib/validators";
import MaskedInput from "vue-masked-input";
import DPicker from "@/components/activity/DPicker";
import { mapGetters } from "vuex";
import appPlugin from "@/Providers/appPlugins";
import imgdefault from "@/assets/img/default-pp.png";
import Multiselect from 'vue-multiselect'
export default {
  props: {
    pstatus: {
      type: String,
      default: ""
    }
  },
  computed: {
    ...mapGetters({
      suser: "studentuser",
      studentmodel: "studentmodel",
      susermodel: "studentusermodel",
      proximities: "proximities",
      errmessage: "errmessage",
      smessage: "successmessage"
    }),
    filterProximities(){
      return this.proximities.map(p=>({
        code: p.id,
        name: p.pName
      }))
    }
  },
  async beforeMount() {
    await this.$store.dispatch("fetchProximities");
     const proximities = await this.proximities.map(p=>({
       code: p.id,
       name: p.pName
     }))
    const proximity = await proximities.find(p=>p.code === this.susermodel.proximities);
    const gender = await this.optionsGender.find(g=>g.code === this.susermodel.gender);
    this.susermodel.proximities = proximity;
    this.susermodel.gender = gender;
  },
  components: {
    DPicker,
    MaskedInput,
    Multiselect
  },
  validations: {
    susermodel: {
      name: {
        required,
        minLength: minLength(3)
      },
      address: {
        required,
      },
      surname: {
        required,
        minLength: minLength(3)
      },
      email: {
        required,
        email
      },

      tc: {
        required,
        minLength: minLength(11),
        maxLength: maxLength(11),
        numeric
      },
      phone: {
        required,
        maxLength: maxLength(17),
        minLength: minLength(17)
      },
      otherphone: {
        required,
        maxLength: maxLength(17),
        minLength: minLength(17)
      }
    }
  },
  methods: {
    async save() {
      console.log(this.susermodel);
      console.log(this.$v.susermodel.$invalid);
      if (this.$v.susermodel.$invalid) {
        appPlugin.showalert(
          "Uyarı",
          "Alanların tamamı zorunludur. Lütfen doğru doldurunuz.",
          "warning",
          "Tamam"
        );
      } else {
     //   if (this.susermodel.file_id != 1) {
          const formData = new FormData();
          formData.append(`file`, this.susermodel.file);
          formData.append("tc", this.susermodel.tc);
          await this.$store.dispatch("saveUserImage", formData);
     //   }
        this.susermodel.student_id = this.studentmodel.id;
        let result = 0;
        if (this.susermodel.type === "add") {
         result = await this.$store.dispatch(
            "createStudentUsers",
            this.susermodel
          );
          if (result) {
            this.$store
              .dispatch("createUserUTypes", {
                user_id: this.susermodel.id,
                users_types_id: 2
              })
              .then(res => {
                if (res.status) {
                  this.$store
                    .dispatch("createPersonPassword", {
                      userid: this.susermodel.id
                    })
                    .then(res => {});
                } else {
                  appPlugin.showalert(
                    "Veli parolası oluşturulurken hata gerçekleşti ",
                    "",
                    "error",
                    "Tamam"
                  );
                }
              })
              .catch(err => {
                this.loading = false;
                appPlugin.showalert(
                  "Veli Eklenirken Hata Gerçekleşti ",
                  "",
                  "error",
                  "Tamam"
                );
              });
          }
        } else {
          result = await this.$store.dispatch(
            "updateStudentUsers",
            this.susermodel
          );
        }
        if (result) {
          await this.$store.dispatch("getStudentsOrUsers", {
            type: "users",
            id: this.studentmodel.id
          });
          appPlugin.showalert(this.smessage, "", "success", "Tamam");
        } else {
          console.log(this.errmessage);
          appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
        }
      }
    },
    async onChange(event) {
      var FR = new FileReader();
      FR.addEventListener("load", async e => {
        this.viewImage = await e.target.result;
        this.view = false;
      });
      await FR.readAsDataURL(event.target.files[0]);
      this.susermodel.file = await event.target.files[0];
    },
    getPicker(birthday) {
      this.susermodel.birthday = birthday;
    },
    status(validation) {
      return {
        error: validation.$error,
        dirty: validation.$dirty
      };
    }
  },
  data() {
    return {
      view: true,
      viewImage: imgdefault,
      //   proximities: [
      //     { name: "Anne", code: 0 },
      //     { name: "Baba", code: 1 }
      //   ],
      optionsGender: [
        { name: "Kadın", code: 0 },
        { name: "Erkek", code: 1 }
      ],
      submitStatus: null
    };
  }
};
</script>
<style>
input {
  border: 1px solid silver;
  border-radius: 4px;
  background: white;
  padding: 5px 10px;
}

.dirty {
  border-color: #5a5;
  background: #efe;
}

.dirty:focus {
  outline-color: #8e8;
}

.error {
  border-color: red;
  background: #fdd;
}

.error:focus {
  outline-color: #f99;
}
</style>
