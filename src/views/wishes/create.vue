<template>
  <Modal
    @onCloseModal="onClose"
    modalTitle="Şikayet Ve Öneri Formu"
    @onClick="saveWish"
    modalSaveBtnText="Kaydet"
    modalCloseBtnText="Kapat"
    :modalCloseBtnVisible="true"
    :modalSaveBtnVisible="true"
  >
    <flex-card column="col-md-12 col-sm-12 col-lg-12">
      <div class="row">
        <div class="col-md-12 col-sm-12 col-lg-12">
          <div class="form-group">
            <label>Başlık</label>
            <div class="input-group input-group-merge">
              <v-input :inputType="'text'" placeholder="Başlık Giriniz"></v-input>
            </div>
          </div>
          <div class="form-group">
            <label>İçerik</label>
            <div class="input-group input-group-merge">
              <textarea class="form-control" rows="5" placeholder="İçerik Giriniz.."></textarea>
            </div>
          </div>
          <div class="form-group">
            <label>Şikayet Tipi</label>
            <div class="input-group input-group-merge">
              <v-select
                class
                v-model.trim="selectedwish"
                :propName="'name'"
                :bindData="'id'"
                :optionData="wishTypeData"
              ></v-select>
            </div>
          </div>
          <div class="form-group justify-content-center">
            <label>Dosya Seçimi</label>
            <div class="input-group input-group-merge">
              <input
                @change="onChange($event)"
                multiple
                class="form-control"
                ref="file"
                id="wishFile"
                style="display: none;"
                type="file"
              />
              <a
                @click="$refs.file.click()"
                aria-pressed="true"
                class="btn btn-sm btn-outline-dark float-center"
                role="button"
              >Dosya Seç</a>
            </div>
          </div>

        </div>
      </div>
    </flex-card>
    <p
      class="text-center text"
      v-if="wishData.fileList.length>0"
    >Dosya Sayısı {{wishData.fileList.length}}</p>
    <div class="row" v-for="(item,i) in wishData.fileList">
      <div class="col-10">
        <i class="fa fa-file"></i>
        <a href="#">{{item.name}}</a>
      </div>
      <div class="col-2 mt-2">
        <v-button
          btnName="Sil"
          class="btn btn-sm btn-danger"
          :btnIcon="'fa-times'"
          @onClick="removeFile(i)"
        ></v-button>
      </div>
    </div>
  </Modal>
</template>

<script>
import Modal from "@/components/modal";
import VInput from "@/components/input";
import VSelect from "@/components/select";
import Flex from "@/components/layout";
import VButton from "@/components/button";
import FlexCard from "@/components/flexwithcard";

export default {
  name: "create",
  methods: {
    onClose() {
      this.wishData = {
        title: "",
        content: "",
        fileList: [],
        type: ""
      };
    },
    removeFile(i) {
      let fileInput = document.getElementById("wishFile");
      this.wishData.fileList.splice(i, 1);
    },
    onChange(e) {
      let fileInput = document.getElementById("wishFile");
      for (let i = 0; i < e.target.files.length; i++) {
        this.wishData.fileList.push(e.target.files[i]);
      }
      fileInput.value = "";
      /*const file = e.target.files[0]
        this.personData.file = file
        appPlugin.readFileToBase64(file).then(res => {
          res.date = new Date().toLocaleDateString()
          res.time =
            new Date().getHours() +
            '.' +
            new Date().getMinutes() +
            '.' +
            new Date().getSeconds()
          res.decode64 = res.base64
          res.base64 = 'data:image/png;base64,' + res.base64
          this.personData.fileprew = res.base64
        })*/
    },
    saveWish() {
      alert("selam");
      var fd = new FormData();
      var ins = this.wishData.fileList.length;
      for (var x = 0; x < ins; x++) {
        fd.append("fileToUpload[]", this.wishData.fileList[x]);
      }
      this.$store.dispatch("test", fd);

      console.log(fd);
    }
  },
  data() {
    return {
      selectedwish: 0,
      fileList: [],
      wishData: {
        title: "",
        content: "",
        fileList: [],
        type: ""
      },
      wishTypeData: [
        {
          id: 1,
          name: "Şikayet"
        },
        {
          id: 2,
          name: "Öneri"
        }
      ]
    };
  },
  components: {
    Modal,
    FlexCard,
    VInput,
    VSelect,
    VButton
  }
};
</script>

<style scoped>
</style>
