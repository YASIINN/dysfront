<template>
  <div>
    <Loading v-if="loading"></Loading>
    <div class="row">
      <div class="col-lg-12">
        <div class="table-responsive pt-2">
          <v-table
            :detailVisible="false"
            :edit-visible="false"
            :del-visible="true"
            @delClick="deleteClick($event)"
            :columns="$store.getters.getSchoolDaysHeader"
            :rows="$store.getters.getSchoolDays"
            :table-title="$store.getters.getSchoolDaysHeader"
          >
          </v-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import Loading from "@/components/loading";
import VTable from "@/components/table";
import { appPlugin, Swal, VButton } from "@/Providers/defaultImports";

export default {
  watch: {
    onreset: function(val) {
      if (val == true) {
        this.onRefresh();
      }
    }
  },
  components: {
    VTable,
    VButton,
    Loading
  },
  name: "schooldaylist",
  props: {
    showDelete: {},
    user: {},
    tabKey: {},
    icon: {},
    title: {},
    loadSchoolTask: {},
    onreset: {}
  },
  data() {
    return {
      loading: false
    };
  },
  created() {
    this.onFetchApi();
  },
  methods: {
    deleteClick(data) {
      Swal.fire({
        title:
          "Gün Adı :" + data.item.sdName + " " + "\n" + this.$t("sureDelete"),
        confirmButtonText: this.$t("yes"),
        confirmButtonColor: "red",
        cancelButtonText: this.$t("cancel"),
        icon: "warning",
        showCancelButton: true
      }).then(res => {
        if (res.value) {
          this.loading = true;

          this.$store
            .dispatch("deleteSchoolDays", {
              urlparse: appPlugin.urlParse("id=" + data.item.id),
              index: data.i
            })
            .then(res => {
              if (res.status) {
                if (res.status === 200) {
                  this.$emit("onDelete", false);
                  appPlugin.showalert(
                    this.$t("deleteRecordMsg"),
                    "",
                    "success",
                    this.$t("ok")
                  );
                }
              } else {
                appPlugin.showalert(
                  this.$t("deleteRecordErrMsg"),
                  "",
                  "error",
                  this.$t("ok")
                );
              }

              this.loading = false;
            });
        }
      });
    },
    onRefresh() {
      this.onFetchApi();
    },
    async onFetchApi() {
      this.loading = true;
      await this.$store.dispatch("fetchSchoolDays", {
        urlparse: appPlugin.urlParse(
          "school_p_type_id=" + this.$route.params.id
        )
      });
      this.loading = false;
    }
  }
};
</script>

<style scoped></style>
