<template>
  <div>
    <table class="table table-bordered" v-if="rows && rows.length>0">
      <thead>
      <tr>
        <th v-for="title in tableTitle">{{title.name}}</th>
      </tr>
      </thead>
      <tbody>
      <tr v-for="(row,i) in rows">
        <td v-for="col in columns" v-if="col.name!=''">
          <p>{{row[col.display]}}</p>
        </td>
        <td class="td-actions text-right">
          <v-button
            v-if="detailVisible"
            :btnIcon="'fa-info'"
            :className="'btn-primary btn-sm'"
            :btnName="'Detay'"
            @onClick="detailClick(row,i)"
          ></v-button>
          <v-button
            v-if="editVisible"

            :btnIcon="'fa-edit'"
            :className="'btn-warning btn-sm'"
            :btnName="'Düzenle'"
            @onClick="editClick(row,i)"
          ></v-button>
          <v-button
            v-if="delVisible"

            :btnIcon="'fa-trash'"
            :className="'btn-danger btn-sm'"
            :btnName="'Sil'"
            @onClick="deleteClick(row,i)"
          ></v-button>
          <v-button
            v-if="cancelVisible"

            :btnIcon="'fa-times'"
            :className="'btn-danger btn-sm'"
            :btnName="'Vazgeç'"
            @onClick="cancelClick(row,i)"
          ></v-button>


        </td>
      </tr>
      <tr></tr>
      </tbody>
      <p class="text pt-4" style="font-weight: bold;">Toplam Kayıt Sayısı : {{rows.length}}</p>
    </table>
    <table v-else class="table table-striped table-bordered table-hover">
      <thead>
      <th class="d-flex justify-content-center">
        <span class="fa fa-info-circle"></span> Bilgilendirme
      </th>
      </thead>
      <tbody>
      <tr>
        <td>
          <p class="text text-center">Kayıt Bulunamadı</p>
        </td>
      </tr>
      </tbody>
      <tfoot></tfoot>
    </table>
  </div>
</template>

<script>
  import { VButton } from '../../Providers/defaultImports'

  export default {
    name: 'index',
    created () {
    },
    components: {
      VButton
    },
    methods: {
      detailClick (e, i) {
        this.$emit('detClick', {
          item: e,
          i: i
        })
      },
      deleteClick (e, i) {
        this.$emit('delClick', {
          item: e,
          i: i
        })
      },
      cancelClick (e, i) {
        this.$emit('cancelClick', {
          item: e,
          i: i
        })
      },
      editClick (e, i) {
        this.$emit('edClick', {
          item: e,
          i: i
        })
      }
    },
    data: () => ({}),
    props: {
      cancelVisible: {
        default: false
      },
      colorShow:{},
      detailVisible: Boolean,
      delVisible: Boolean,
      columns: Array,
      tableTitle: Array,
      rows: Array,
      editVisible: Boolean
    }
  }
</script>

<style scoped>
</style>
