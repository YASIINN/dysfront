<template>
       <div class="table-responsive">
    
         <table class="table ">
  <thead>
    <tr>
      <th v-for="(field, i) in fields" :key="i" scope="col">
        {{field.text}}
      </th>
    </tr>
  </thead>
  <tbody>
    <tr v-for="(item,a) in items" :key="a">
      <td v-for="(it, i) in fields.filter(f=>f.value != 'action')">
          {{item[fields[i].value]}}
      </td>
      <td>
        <button v-for="(action,i) in actions" type="button" :class="`btn btn-${action.class} btn-${action.size}`" @click="setParent(item, action)">{{action.text}}</button>
      </td>
    </tr>
  </tbody>
</table>
       </div>
</template>
<script>
export default {
  name: "ARelationTable",
  props: {
       i :{
         type: Number,
         default: 1
       },
       fields: {
         type: Array,
         default: ()=>[]
       },
       links: {
         type: Array,
          default: ()=>[]
       },
       actions: {
         type: Array,
         default: ()=>[{
           class: "danger",
           size: "sm",
           action: "delete",
           text: "Sil"
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
      this.$emit("action", item, action);
    }
  }
}
</script>