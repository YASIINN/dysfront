<template>
  <div class="container-fluid mt--6 card-wrapper">
    <div class="row">
      <div class="col-md-3">
        <s-image :smodel="studentmodel"></s-image>
      </div>
      <div class="col-md-5">
        <s-personal :smodel="studentmodel" @vld="getVld"></s-personal>
      </div>
      <div class="col-md-4">
        <s-optinal :smodel="studentmodel"></s-optinal>
        <button v-if="status === 'add'" class="btn btn-success" @click="studentSave('add')">Öğrenciyi Kaydet</button>
        <button v-if="status === 'edit'" class="btn btn-success" @click="studentSave('edit')">Öğrenciyi Güncelle</button>
        <!-- <s-relation></s-relation> -->
      </div>
    </div>
    <div v-if="studentmodel.id != 0" class="container-fluid card-wrapper">
      <div>
        <ACard>
          <ATabs fill class="flex-column flex-xs-row" :value="'Okulu'">
            <br />
            <ACard shadow>
              <ATabPane
                v-for="(tabItem, i) in tabList"
                :key="i"
                @getId="getId" :id="tabItem.id"
                :title="tabItem.name"
              >
<!--                <s-relation :tabId="tabItem.id"></s-relation>-->
                <s-relation v-if="currentTab === tabItem.id" :tabId="currentTab"></s-relation>
              </ATabPane>
            </ACard>
          </ATabs>
        </ACard>
      </div>
    </div>

  </div>
</template>
<script>
import { required } from "vuelidate/lib/validators";
import SImage from "./image";
import SPersonal from "./personal";
import SOptinal from "./optinal";
import SRelation from "./relation";
import RelAct from "../relation/activityrelation";
import { mapGetters } from "vuex";
import appPlugin from "@/Providers/appPlugins";
export default {
  props: {
    status: {
      type: String,
      default: "add"
    }
  },
  computed: {
    ...mapGetters({
      studentmodel: "studentmodel",
      errmessage: "errmessage",
      smessage: "successmessage"
    })
  },
  components: {
    SImage,
    SPersonal,
    SOptinal,
    SRelation,
    RelAct
  },
  watch: {
    // "studentmodel.tc"(){

    // }
  },
  methods: {
    getId(v){
      this.currentTab = v;
      console.log(v);
    },
    async studentSave(action) {
      if (this.vld) {
        if (this.vld.$invalid) {
          appPlugin.showalert(
            "Uyarı",
            "Zorunlu alanlara geçerli değerler girmelisiniz.",
            "warning",
            "Tamam"
          );
        } else {
          if (this.studentmodel.email === "") {
            this.studentmodel.email = `${this.studentmodel.tc}@zaferstudent.com`;
          }
          this.studentmodel.fullname =
          this.studentmodel.name + " " + this.studentmodel.surname;

         const formData = new FormData();
         formData.append(`file`, this.studentmodel.file);
         formData.append("tc", this.studentmodel.tc);
         await this.$store.dispatch("saveImage", formData);
          let result = 0;
          if(action == 'add'){
             result = await this.$store.dispatch(
             "createStudent",
             this.studentmodel
            );
          } else {
            console.log(this.studentmodel);

             result = await this.$store.dispatch(
             "updateStudent",this.studentmodel
            );
          }
          if (result) {

            appPlugin.showalert(this.smessage, "", "success", "Tamam");
            if (action == "add") {
              this.$router.push({
                name: "detailstudent",
                params: { id: this.studentmodel.id, data: this.studentmodel }
              });
            }
          } else {
            console.log(this.errmessage);
            appPlugin.showalert("Uyarı", this.errmessage, "warning", "Tamam");
          }
        }
      } else {
        appPlugin.showalert(
          "Uyarı",
          "Öğrencinin; adı, soyadı, tc ve doğum tarihi alanlarının doldurulması zorunludur.",
          "warning",
          "Tamam"
        );
      }
    },
    getVld(v) {
      this.vld = v;
    },
    getSelected() {},
    valid() {}
  },
  data() {
    return {
      submitStatus: null,
      vld: null,
      currentTab: 0,
      // tabList: ["Okulu", "Faaliyet", "Spor Kulubu", "Veli", "Dersler","Seçmeli Dersleri","Öğretmenler", "Bağlı Olduğu Gruplar", "Ek Bilgiler"]
      tabList: [
        { name: "Okulu", id: "school" },
        { name: "Spor Kulübü", id: "club" },
        { name: "Faaliyet", id: "activity" },
        { name: "Detay Bilgileri", id: "detail" },
        { name: "Veli Bilgileri", id: "user" },
        { name: "Dersler", id: "lesson" },
        { name: "Seçmeli Dersler", id: "optlesson" },
      ]
    };
  }
};
</script>
