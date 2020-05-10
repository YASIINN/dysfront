
<template>
     <ACard>
       <div class="row">
      <div class="col-md-4">
         <SearchBox v-model="searchModel.fullname" @search="onSearchHandler($event, 'name')" :placeHolderTxt="$t('ad soyad') "></SearchBox>
      </div>
       <div class="col-md-5">
         <SearchBox v-model="searchModel.email" @search="onSearchHandler($event, 'email')" :placeHolderTxt="$t('veli email') "></SearchBox>
      </div>
      <div class="col-md-3">
            <v-button
                :btnIcon="'fa-search'"
                :className="'btn-info float-right'"
                btnName="Ara"
                @onClick="searchSet"
              ></v-button>
      </div>
    </div>
     </ACard>
</template>
<script>
import SearchBox from "@/components/searchBox";
import VButton from "@/components/button";
export default {
    components: {
        SearchBox, VButton
    },
    data(){
       return {
        searchModel: {
               fullname: "",
               email: "",
               status: "",
            }
       }
    },
    methods: {
        searchSet(){
               this.searchModel = {
               ...this.searchModel,
               status: 1,
            }
            this.$emit("searchStd", this.searchModel);
        },
        searchClear(){},
        onSearchHandler(item, action){
            if(action === 'name'){
                this.searchModel.fullname = item;
            }else {
                this.searchModel.email = item;
            }
        }
    }
}
</script>