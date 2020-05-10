<template>
    <div>
         <button class="btn btn-primary btn-sm float-right" @click="parentAssign">Atama Yap</button>
            <button class="btn btn-primary btn-sm float-right" @click="newParent">Yeni Veli</button>
          <ATabs fill class="flex-column flex-xs-row" :value="title">
            <br />
              <ATabPane
                v-for="(tabItem, i) in tabList"
                :key="i"
                :title="tabItem.name"
              >
              <parent-list v-if="tabItem.id === 'parentlist'" @parentEdit="parentEdit"></parent-list>
               </ATabPane>
                <ATabPane v-if="status == 'add'" title="Yeni Veli">
                   <parent-add ></parent-add>
                </ATabPane>
              <ATabPane v-if="status == 'edit'" title="Veli Güncelleme">
                   <parent-add></parent-add>
                </ATabPane>
                 <ATabPane v-if="status == 'assign'" title="Veli Atama">
                   <parent-assign></parent-assign>
                </ATabPane>
          </ATabs>
    </div>
</template>
<script>
import ParentList from "./partial/parent/parentlist";
import ParentAdd from "./partial/parent/parentadd";
import ParentAssign from "./partial/parent/parentassign";
import studentUserModelEmpty from "@/store/model/studentUserModelEmpty";
export default {
  components: {
    ParentList, ParentAdd, ParentAssign
  },
  computed: {
  },
  methods: {
    async parentEdit(modeluser){
         console.log(modeluser)
          await this.$store.commit("setStudentUserModel", modeluser);
        this.status = "";
        setTimeout(async ()=>{
            this.status =  await 'edit';
            this.title = await 'Veli Güncelleme'
          },
        1000)
    },
    async newParent(){
         console.log(studentUserModelEmpty);
         await this.$store.commit("setStudentUserModel", studentUserModelEmpty);
         this.status =  await 'add';
         this.title = await 'Yeni Veli'
    },
    async parentAssign(){
         this.status =  await 'assign';
         this.title = await 'Veli Atama'
    }
  },
  data() {
    return {
         studentUserModelEmpty,
         status: "",
         title: "Veli Listesi",
        tabList: [
        { name: "Veli Listesi", id: "parentlist" },
      ]
    }
  }
}
</script>
