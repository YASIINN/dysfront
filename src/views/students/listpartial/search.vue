<template>
   <ACard>
       <div class="row">
      <div class="col-md-4">
         <SearchBox v-model="searchModel.fullname" @search="onSearchHandler($event, 'name')" :placeHolderTxt="$t('ad soyad') "></SearchBox>
      </div>
       <div v-if="email" class="col-md-4">
         <SearchBox v-model="searchModel.email" @search="onSearchHandler($event, 'email')" :placeHolderTxt="$t('veli email') "></SearchBox>
      </div>
         <div v-if="!disabled" class="col-md-2">
           <v-button
             :className="'btn-info float-right'"
             btnName="Temizle"
             @onClick="searchClear"
           ></v-button>
         </div>
      <div class="col-md-2">
             <v-button
                :btnIcon="'fa-search'"
                :className="'btn-info float-right'"
                btnName="Ara"
                @onClick="searchSet"
              ></v-button>
      </div>
    </div>
     <div class="container">
            <div class="row">
           <div class="col-md-6">
                <bts-select
                  :disabled="disabled"
              :options="typeOptions"
              :defaultOpt="selectedType"
              :type="'type'"
              :susage="dSearch"
               @selected="getSelected"
            ></bts-select>
           </div>
               <div v-if="filterdatas.length > 0" class="col-md-6">
                <bts-select
                  :disabled="disabled"
              :options="filterdatas"
                :defaultOpt="selectedData"
              :type="'ofc'"
              :susage="dSearch"
               @selected="getSelected"
            ></bts-select>
           </div>
    </div>
     </div>
    <br/>
   </ACard>
</template>
<script>
import SearchBox from "@/components/searchBox";
import VButton from "@/components/button";
import { mapGetters } from 'vuex';
import Vue from "vue";
export default {
    computed: {
        ...mapGetters({filterdatas: "filterdatas", filtermodel:"filtermodel"})
    },
    components: {
        SearchBox, VButton
    },
    async created(){
       if(!this.default){
      this.searchModel = this.filtermodel;
      if(this.searchModel.detailSearch){
         this.dSearch = false;
         await this.$store.dispatch("fetchFilterDatas", {type: this.searchModel.type});
        let selecttype = this.typeOptions.filter(fo=>fo.code === this.searchModel.type);
        Vue.set(this.selectedType,0, selecttype[0]);
        const selectdata = this.filterdatas.filter(fd=> fd.activity_id === this.searchModel.activity_id && fd.period_id === this.searchModel.period_id);
        Vue.set(this.selectedData,0, selectdata[0])
         this.$emit("searchStd", this.searchModel);
      } else {
         this.dSearch = true;
         await this.$store.dispatch("fetchFilterDatas", {type: 1});
      }
       } else {
               this.dSearch = true;
         await this.$store.dispatch("fetchFilterDatas", {type: 1});
       }
    },
    data() {
        return {
            dSearch: true,
            selectedData: [{name: 'Okul Seçin'}],
            selectedType:[{name: 'Okul'}],
            typeOptions: [{name: 'Okul', code: 1}, {name: 'Faaliyet', code: 2}, {name: 'Kulüp', code: 3}],
            searchModel: {
               fullname: "",
               email: "",
               type: 1, //okul 1, faaliyet 2, kulup 3
               school_id: 0,
               activity_id: 0,
               period_id: 0,
               club_id: 0,
               detailSearch: 0,
               search: 0,
               status: 0,
            }
        }
    },
    props: {
        searchStd: {
            type: Function,
        },
        default: {
            type:Boolean,
            default: false,
        },
        email:{
            type: Boolean,
            default: false
        },
      disabled: {
          type: Boolean,
          default: false
      }
    },
    methods: {
        onSearchStudents(){
        },
        async searchClear(){
            this.searchModel.fullname = "";
            this.searchModel = {
              fullname: "",
               email: "",
               type: 1, //okul 1, faaliyet 2, kulup 3
               school_id: 0,
               activity_id: 0,
               period_id: 0,
               club_id: 0,
               detailSearch: 0,
               search: 0,
               status: 0
            }
              await this.$store.commit("setFilterDatas", []);
              setTimeout( async () => {
                    await this.$store.dispatch("fetchFilterDatas", {type: 1});
              }, 100);
            this.$emit("searchStd", this.searchModel);
        },
        searchSet(){
              this.searchModel = {
               ...this.searchModel,
               status: 1,
            }
            console.log(this.searchModel);
            this.$emit("searchStd", this.searchModel);
         },
         async getSelected(data, type, susage) {
             console.log(susage);
             console.log(type);
          if(susage){
                 if(type === 'type' && data){
                if(data.code === 2){
                   this.selectedData = [{name: "Faaliyet Seçin"}];
                }
                else if(data.code === 1){
                     this.selectedData = [{name: "Okul Seçin"}];
                }
                else{
                     this.selectedData = [{name: "Kulüp Seçin"}];
                }
                await this.$store.commit("setFilterDatas", []);
              setTimeout( async () => {
                    await this.$store.dispatch("fetchFilterDatas", {type: data.code});
              }, 100);
              console.log(this.filterdatas);
         } else if(type === "ofc" && data){
             this.searchModel.detailSearch = 1
             if(data.type === 1){
                 this.searchModel.type = 1;
                 this.searchModel.school_id = data.id;
             } else if(data.type === 2){
                 this.searchModel.type = 2;
                 this.searchModel.activity_id = data.activity_id;
                this.searchModel.period_id = data.period_id;
             } else {
                 console.log(data);
                 this.searchModel.type = 3;
                 this.searchModel.club_id = data.id
             }
         }else {
             await this.$store.commit("setFilterDatas", []);
         }
          }
        },
        async detailSearch(){
          await this.$store.dispatch("fetchFilterDatas", {type: 1});
        },
        onSearchHandler(item, action){
            if(action === 'name'){
                this.searchModel.fullname = item;
            }else {
                this.searchModel.email = item;
            }
        }
    }
}
</script>
