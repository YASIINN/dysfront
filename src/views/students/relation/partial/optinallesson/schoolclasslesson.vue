<template>
    
    <div>
        <button :style="{'margin-left': '15px'}" class="btn btn-primary btn-sm float-right" @click="openModal('sc')">Otomatik Atama</button>
          <a-relation-table
       @action="getAction"
      :items="mainlessons.filter(l=>l.lesson_type === 1)"
     :fields="[{
            text: 'Okul',
            value: 'school'
          }, {
            text: 'Sınıf',
            value: 'clases'
          },
          { 
            text: 'Ders',
            value: 'lesson'
          },
          {
            text: 'İşlemler',
            value: 'action'
          }
          ]"
    ></a-relation-table>
    </div>
</template>
<script>
import { mapGetters } from 'vuex';
import appPlugin from "@/Providers/appPlugins";
export default {
   props: {
      mainlessons: {
          type: [Array, Object],
          default: ()=>([])
      },
      openModal: {
        type: Function,
      },
   },
    computed: {
        ...mapGetters({studentmodel: "studentmodel", schoolclass: "schoolclass"})
    },
    data(){
        return {
              selectedaplessons: [],
               modals: {
               modal:false
            },
            datas: [],
        }
    },
   methods: {
         getAction(item, action) {
      appPlugin
        .showConfirm(
          "Öğrenci ders ilişkisini sileceksiniz. Onaylıyor musunuz ?"
        )
        .then(res => {
          if (res.value) {
            const payload = {
              type: "sc",
              ...item
            };
            console.log(payload);
            this.$emit("parentaction", payload, action);
          }
        });
    }
    }
}
</script>