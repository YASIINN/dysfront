<template>
  <div>
      <ACard type="frame">
            <h3
              slot="header"
              class="mb-0">Resim Yükle</h3>
            <div class="text-center">
              <img
                v-if="view"
                :src="smodel.file ? smodel.file_path : viewImage"
                alt="Photo de profil"
                height="150px"
                width="150px"
                class="rounded-circle">
                  <img
                v-if="!view"
                :src="viewImage"
                alt="Photo de profil"
                height="150px"
                width="150px"
                class="rounded-circle">
              <br><br/>
              <div class="upload-btn-wrapper">
               <button class="btnupload">Dosya Seçin</button>
              <input type="file" @change="onChange" accept="image/*">
            </div>
            </div>
          </ACard>
  </div>
</template>
<script>
import 'vue2-dropzone/dist/vue2Dropzone.min.css'
import vueDropzone from "vue2-dropzone";
import axios from "axios";
import { mapGetters } from 'vuex';
import imgdefault from "@/assets/img/default-pp.png";
export default {
  computed: {
  },
  props: {
    smodel: {
      type: Object,
      default: ()=>({})
    }
  },
  data: () => ({
    view: true,
    viewImage: imgdefault,
  }),
   methods: {
    async onChange(event){
            var FR = new FileReader();
            FR.addEventListener("load",  async (e)=>{
              this.viewImage = await e.target.result;
              this.view = false;
             }); 
            await FR.readAsDataURL(event.target.files[0]);
           this.smodel.file = await event.target.files[0]
    }
  },
  components: {
    vueDropzone
  }
};
</script>
<style>
.upload-btn-wrapper {
  position: relative;
  overflow: hidden;
  display: inline-block;
}

.btnupload {
  border: 2px solid gray;
  color: gray;
  background-color: white;
  padding: 8px 20px;
  border-radius: 8px;
  font-size: 10px;
  font-weight: bold;
}

.upload-btn-wrapper input[type=file] {
  font-size: 100px;
  position: absolute;
  left: 0;
  top: 0;
  opacity: 0;
}
</style>