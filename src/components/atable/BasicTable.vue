<template>
    <table class="table table-striped">
  <thead>
    <tr>
      <th v-for="(field, i) in fields" :key="i" scope="col">
        {{field.text}}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item,i) in items" :key="i">
      <td >{{item.name}}</td>
      <td>{{item.code}} </td>
      <td>
        <button v-for="(action,i) in links" type="button" :class="`btn btn-${action.class} btn-${action.size}`" @click="setParent(item, action)">{{action.text}}</button>
      </td>
      <td>
        <button v-for="(action,i) in actions" type="button" :class="`btn btn-${action.class} btn-${action.size}`" @click="setParent(item, action)">{{action.text}}</button>
      </td>
    </tr>
  </tbody>
</table>
</template>
<script>
export default {
  name: "ABasicTable",
  props: {
       i :{
         type: Number,
         default: 1
       },
       fields: {
         type: Array,
         default: ()=>[{
            text: 'Faaliyet Adı',
            value: 'aName'
          },
          {
            text: 'Faliyet Kodu',
            value: 'aCode'
          },
           {
            text: 'Detay',
            value: 'detay'
          },
          {
            text: 'İşlemler',
            value: 'ogrname'
          }
          ]
       },
       links: {
         type: Array,
          default: ()=>[{
           class: "info",
           size: "sm",
           action: "details",
           text: "Takvim"
         }]
       },
       actions: {
         type: Array,
         default: ()=>[{
           class: "danger",
           size: "sm",
           action: "delete",
           text: "Sil"
         },
         {
           class: "primary",
           size: "sm",
           action: "edit",
           text: "Düzenle"
         }
         ]
       },
       items: {
           type: Array,
           default: ()=>[]
       },
  },

  methods: {
    setParent(item, action){
      this.$emit("details", item, action);
    }
  }
}
</script>