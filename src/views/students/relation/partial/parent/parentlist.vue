<template>
  <div>
    <a-relation-table
      :actions="actions"
      @action="getAction"
      :items="filterStudentUsers"
      :fields="[{
            text: 'Ad Soyad',
            value: 'fullname'
          }, {
            text: 'Telefon',
            value: 'phone'
          },
          {
            text: '2. Telefon',
            value: 'phoneother'
          },
            {
            text: 'Email',
            value: 'email'
          },
            {
            text: 'Meslek',
            value: 'job'
          },
           {
            text: 'Adres',
            value: 'address'
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
import { mapGetters } from "vuex";
import Modal from "@/components/amodal/Modal";
import ParentAdd from "./parentadd";
import appPlugin from "@/Providers/appPlugins";
export default {
  components: {
    Modal,
    ParentAdd
  },
  data() {
    return {
      actions: [
        {
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
    };
  },
  computed: {
    ...mapGetters({
      studentusers: "studentusers",
      studentmodel: "studentmodel"
    }),
    filterStudentUsers() {
      return this.studentusers.map(su => ({
        id: su.id,
        fullname: su.uFullName,
        phone: su.uPhone,
        file: su.file,
        phoneother: su.uPhoneOther,
        email: su.uEmail,
        job: su.uJob,
        address: su.uAdress
      }));
    }
  },
  methods: {
    save() {},
    async getAction(item, action) {
      let user = await this.studentusers.find(s => s.id === item.id);
      if (action.action === "edit") {
        console.log(user);
        let modelUser = {
          id: user.id,
          name: user.uName,
          surname: user.uSurname,
          fullname: user.uFullName,
          phone: user.uPhone,
          otherphone: user.uPhoneOther,
          email: user.uEmail,
          tc: user.uTC,
          address: user.uAdress,
          birthday: user.uBirthDay,
          isActive: user.uİsActive ? true : false,
          gender: user.uGender,
          emailnotification: user.uEmailNotification ? true : false,
          status: { school: false, activity: false, club: false },
          smsnotification: user.uSmsNotification ? true : false,
          proximities: user.uproximities_id,
          file: user.file,
          file_id: user.file.id,
          file_path: user.file.path,
          title: 1,
          province: 1,
          job: user.uJob,
          unit: 1,
          student_id: 0
        };

        this.$emit("parentEdit", modelUser);
      } else if (action.action == "delete") {
        appPlugin
          .showConfirm(
            "Öğrenci veli ilişkisini sileceksiniz. Onaylıyor musunuz ?"
          )
          .then(async res => {
            if (res.value) {
              let payload = {
                student_id: this.studentmodel.id,
                user_id: item.id
              };
              let result = await this.$store.dispatch(
                "deleteStudentUser",
                payload
              );
              if (result) {
                await this.$store.dispatch("getStudentsOrUsers", {
                  type: "users",
                  id: this.studentmodel.id
                });
                appPlugin.showalert(
                  "Öğrenci velisi silindi.",
                  "",
                  "success",
                  "Tamam"
                );
              } else {
                appPlugin.showalert(
                  "Uyarı",
                  "Atama sırasında hata meydana geldi.",
                  "warning",
                  "Tamam"
                );
              }
            }
          });
      }
    }
  }
};
</script>