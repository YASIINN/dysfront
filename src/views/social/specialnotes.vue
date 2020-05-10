<template>
  <flex-card column="col-lg-12 col-sm-12 col-md-12" headerTitle="İletilen Notlar">
    <Loading v-if="loading"/>
    <div class="row">
      <div class="col-md-8 col-lg-8 col-lg-8 ml-3 pl-3">
        <div class="messaging">
          <div class="inbox_msg">
            <div class="inbox_people">
              <div class="headind_srch">
                <div class="recent_heading">
                  <h4>Gelen Kutusu</h4>
                </div>
                <!--   <chatusersearch/>-->
              </div>
              <div class="inbox_chat">
                <chatuserlist :avatarUri="item.user.file.id==1?defaultPreview:item.user.file.path"
                              v-for="(item,i,k) in userNotesList"
                              @onMsgDelete="onDeleteSpecialNotes(item,i,k)"
                              @onSelect="onSelectUserMsg(item,i)"
                              :username="item.user.uFullName.toUpperCase()"
                              :lastmsg="item.lastmsg"
                              :lastmsgdate="item.date"
                              :notseen="item.notseen"
                              :itemclass="item.active==true?'chat_list active_chat':'chat_list'"
                ></chatuserlist>
              </div>
            </div>
            <div class="mesgs" v-if="selectedUserMsg.length>0">
              <div class="row">
                <div class="col-md-12 bg-secondary bg-white">
                  <div class="row align-items-center">
                    <div class="col-8">
                      <h3 class="mb-0"><img
                        :src="selectedUser.file.id==1?defaultPreview:selectedUser.file.path"
                        class="avatar rounded-circle float-left"/>
                        <h4 class="card-title float-left pl-2 mt-3">{{selectedUser.uFullName.toUpperCase()}}</h4></h3>
                    </div>
                  </div>
                </div>
              </div>
              <div class="msg_history mt-5 pd-5">
                <div v-for="(msg,msgindex) in selectedUserMsg" :class="msg.to_user_id==2?'outgoing_msg':'incoming_msg'">

                  <div class="incoming_msg_img" v-if="msg.to_user_id!=2">
                    <img :src="selectedUser.file.id==1?defaultPreview:selectedUser.file.path"
                         :alt="selectedUser.uFullName">
                  </div>
                  <div class="received_msg" :class="msg.to_user_id==2?'sent_msg':'received_msg'">

                    <p v-if="msg.to_user_id==2">{{msg.content}}</p>
                    <span class="time_date mt-2 pt-2 mb-1 pb-1"
                          v-if="msg.to_user_id==2"> {{msg.created_at|formatToday}}     |    {{msg.status=='1'?'Okundu':'Okunmadı'}}
                    <i class="fa fa-trash-alt float-right text-red" @click="onDeleteMsg(msg,msgindex)"/>
                    </span>
                    <div class="received_withd_msg" v-if="msg.to_user_id!=2">
                      <p>{{msg.content}}</p>
                      <span class="time_date mt-2 pt-2 mb-1 pb-1"> {{msg.created_at|formatToday}}    |    {{msg.status=='1'?'Okundu':'Okunmadı'}}</span>
                    </div>
                  </div>
                </div>

              </div>
              <div class="type_msg mt-2 pt-2">
                <div class="input_msg_write">
                  <textarea class="form-control write_msg" v-model="content" rows="3"
                            placeholder="Mesaj Yaz .."> </textarea>
                  <!--          <input type="text-area" class="write_msg" placeholder="Mesaj Yaz .."/>-->
                  <button class="btn btn-outline-success btn-sm float-right mt-3  " @click="sendMsg">
                    <i class="fa fa-paper-plane"></i>
                    Gönder
                  </button>
                  <button class="btn btn-outline-secondary btn-sm float-right mt-3 mr-3" @click="reloadUserMsgContent">
                    <i class="fa fa-undo"></i>
                    Yenile
                  </button>
                </div>
                <!--      <button class="msg_send_btn" type="button"><i class="fa fa-paper-plane" aria-hidden="true"></i>
                      </button>-->
              </div>
            </div>
          </div>


          <p class="text-center top_spac" v-if="userNotesList.length!=0"> Toplam {{userNotesList.length}} Konuşma</p>
          <p class="text-center top_spac" v-else> Konuşma Geçmişi Bulunamadı</p>
        </div>
      </div>
      <div class="col-md-3 col-sm-3 col-lg-3 ">
        <div class="card">
          <div class="card-header">
            <div class="input-group">
              <input type="text" placeholder="Kişilerde Ara..." v-model="searchTxt" class="form-control search">
              <div class="input-group-prepend">
                <span class="input-group-text search_btn" @click="onSearchContact"><i class="fas fa-search"></i></span>
              </div>
            </div>
          </div>
          <div class="card-body contacts ">
            <h3 class="text text-center">Kişiler</h3>
            <label v-if="contactUser.length<1"> {{$t('noData')}}</label>

            <ul class="list-group">
              <li class="list-group-item d-flex justify-content-between align-items-center"
                  v-for="(item,i) in contactUser"
                  :class="item.activePopup==true?'active':'false'">
                <label v-if="contactUser.length>0"> {{item.uFullName.toUpperCase()}}</label>
                <span v-if="contactUser.length>0" class="badge badge-primary badge-pill"
                      style="cursor: pointer !important;"
                      @click="openMsgPopup(item,i)">
                  <i class="fa fa-paper-plane"></i>
                </span>
              </li>
            </ul>
          </div>
          <div class="card-footer">
            <p class="text text-center" v-if="contactUser.length!=0">
              Toplam : {{contactUser.length}}
            </p>
          </div>
          <p class="text text-center" style="cursor: pointer !important;" @click="loadMore"
             v-if="nextpageurl!='' && contactUser.length!=0">
            Daha Fazla Yükle</p>
        </div>
      </div>

      <msg-popup
        @onSend="createNewUserMsg($event)"
        :username="selectedContact.uFullName"
        v-if="selectedContact.id!=undefined"
        :avatar="selectedContact.file.id==1?defaultPreview:selectedContact.file.path"></msg-popup>
    </div>


  </flex-card>
</template>

<script>
  import {
    Loading,
    VSelect,
    FlexCard,
    Flex,
    VTabs,
    VTabContent,
    VButton,
    Multiselect,
    VInput,
    Swal,
    appPlugin
  } from '@/Providers/defaultImports'
  import chatusersearch from '@/components/chatusersearch/index'
  import chatuserlist from '@/components/chatuser/index'
  import Vue from 'vue'
  import _ from 'underscore'
  import {
    CREATE_USER_NOTES, DELETE_USER_MSG_BOX,
    DELETE_USER_NOTES, FETCH_NEXT_CONTACTS, FETCH_USER_MSG_BOX,
    FETCH_USER_NOTES, SHOW_USER_NOTE,
    UPDATE_USER_NOTES
  } from '../../store/modules/specialnotes/moduleNames'
  import defaultImage from '@/assets/img/defaultavatar.png'
  import MsgPopup from '@/components/msgpopup/index'
  import { FETCH_ALL_USERSSEARCH } from '../../store/modules/users/moduleNames'

  export default {
    created () {
      this.fetchUserRecentMsg()
      debugger

    },
    methods: {
      onSearchContact () {
        if (this.searchTxt.trim() != '') {
          let payload = appPlugin.urlParse('uİsActive=1' + '& uFullName%' + this.searchTxt)
          this.fetchContactList({ urlparse: payload, paginate: true, users: this.notInContactUsers })
        } else {
          this.contactUser = []
          let payload = appPlugin.urlParse('uİsActive=1')
          this.fetchContactList({ urlparse: payload, paginate: true, users: this.notInContactUsers })
        }

      },
      loadMore () {
        debugger
        let query = []
        this.loading = true
        query = appPlugin.urlParse('uİsActive=1'
          + (this.searchTxt.trim() == '' ? '' : '& uFullName%' + this.searchTxt))
        if (this.nextpageurl == this.lastpageurl) {

          debugger
          /*
          *
          *          query = appPlugin.urlParse('created_at >' + moment(this.queryfilter.psdate).format('YYYY-MM-DD')
            + (this.queryfilter.tag == 0 ? '' : '& tag_id=' + this.queryfilter.tag) + (this.queryfilter.ptype == 0 ? '' : '& post_type_id=' + this.queryfilter.ptype))
          * */
          this.$store.dispatch(FETCH_NEXT_CONTACTS, {
            url: this.nextpageurl,
            urlparse: query,
            paginate: true,
            users: this.notInContactUsers
          }).then((res) => {
            debugger
            this.contactUser.push(res.data.data[0])
            if (res.data.next_page_url != null) {
              debugger
              this.lastpageurl = res.data.last_page_url
              this.nextpageurl = res.data.next_page_url
            }
            this.loading = false
          }).catch((err) => {
            debugger
            this.loading = false
            appPlugin.showalert(this.$t('warning'),
              this.$t('fetchError'), 'error',
              this.$t('ok'))
          })
          this.nextpageurl = ''
          this.loading = false
        } else {
          debugger
          this.$store.dispatch(FETCH_NEXT_CONTACTS, {
            url: this.nextpageurl,
            urlparse: query,
            paginate: true,
            users: this.notInContactUsers
          }).then((res) => {
            debugger
            this.contactUser.push(res.data.data[0])

            if (res.data.next_page_url != null) {
              debugger
              this.nextpageurl = res.data.next_page_url
            }
            this.loading = false
          }).catch((err) => {
            debugger
            this.loading = false
            appPlugin.showalert(this.$t('warning'),
              this.$t('fetchError'), 'error',
              this.$t('ok'))
          })
          this.loading = false
        }
      },
      createNewUserMsg (data) {
        debugger
        //TODO USER ID
        let payload = {
          touserid: 2,
          fromuserid: this.selectedContact.id,
          ncontent: data
        }
        this.loading = true
        this.$store.dispatch(CREATE_USER_NOTES, payload).then((res) => {
          debugger
          let outgoing = _.groupBy(res.data, 'from_user_id')
          this.userNotesList.unshift({
            [Object.keys(outgoing)[0]]: outgoing[Object.keys(outgoing)[0]],
            active: false,
            date: outgoing[Object.keys(outgoing)[0]][0].created_at,
            lastmsg: outgoing[Object.keys(outgoing)[0]][0].content,
            notseen: outgoing[Object.keys(outgoing)[0]][0].status,
            user: outgoing[Object.keys(outgoing)[0]][0].fromuser
          })
          this.notInContactUsers.push(outgoing[Object.keys(outgoing)[0]][0].fromuser.id)
          let payload = appPlugin.urlParse('uİsActive=1')
          /*  let newContactUser=this.contactUser.filter((item)=>{
              return item.id!=outgoing[Object.keys(outgoing)[0]][0].fromuser.id
            })*/
          this.contactUser = []

          this.fetchContactList({ urlparse: payload, paginate: true, users: this.notInContactUsers })
          debugger
          /*   let grouped=
             this.userNotesList[this.selectedNoteListIndex][this.selectedUser.id].push(
               res.data
             )*/
          this.$store.commit('setpopupstyle', 'none')

          /*   this.userNotesList[this.selectedNoteListIndex].lastmsg = res.data.content
             this.userNotesList[this.selectedNoteListIndex].date = res.data.created_at
             this.content = ''*/
          this.loading = false
        }).catch((err) => {
          debugger
          this.loading = false
        })
      },
      fetchContactList (payload) {
        debugger
        this.loading = true

        this.$store.dispatch(FETCH_ALL_USERSSEARCH, payload).then((res) => {
          debugger
          this.loading = false
          if (res.data.next_page_url != null) {
            this.nextpageurl = res.data.next_page_url
          }
          this.lastpageurl = res.data.last_page_url
          if (payload.urlparse.length > 1) {
            this.contactUser = []
          }
          if (res.data.data.length > 0) {
            res.data.data.forEach((item) => {
              item.activePopup = false
              this.contactUser.push(item)
            })
          }
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'),
            this.$t('fetchError'), 'error',
            this.$t('ok'))
        })
      },
      onDeleteSpecialNotes (msg, i) {
        debugger
        this.selectedUserMsg = []

        let key = Object.keys(msg)[0]
        //userspecialnoteid
        let deletedNotes = []
        this.userNotesList[i][key].forEach((item) => {
          deletedNotes.push(item.userspecialnoteid)
        })
        debugger
        this.notInContactUsers = this.notInContactUsers.filter((item) => {
          return item != msg.user.id
        })
        /*   this.notInContactUsers.push(outgoing[Object.keys(outgoing)[0]][0].fromuser.id)*/
        let payload = appPlugin.urlParse('uİsActive=1')
        this.fetchContactList({ urlparse: payload, paginate: true, users: this.notInContactUsers })

        this.$store.dispatch(DELETE_USER_MSG_BOX, { notes: deletedNotes }).then((res) => {
          this.selectedUserMsg = []
          this.userNotesList.splice(i, 1)
          this.contactUser = []

          this.loading = false
        }).catch((err) => {
          this.loading = false
          debugger
        })
        //genel mesaj kutusundan silinecek tamamen
      },
      openMsgPopup (item) {
        this.selectedContact = item
        this.$store.commit('setpopupstyle', 'block')
      },
      reloadUserMsgContent () {
        this.loading = true
        let payload = {
          touserid: this.selectedUser.id,
          userid: 2
        }
        this.$store.dispatch(SHOW_USER_NOTE, payload).then((res) => {
          this.loading = false
          debugger
          //isRead
          //USER ID
          let data = res.data
          let notSeen = res.data.filter((item) => {
            return (item.status == 0 && item.to_user_id != 2)
          })
          if (notSeen.length > 0) {
            debugger
            let payload = appPlugin.urlParse('to_user_id=' + this.selectedUser.id + '& from_user_id=' + 2)
            this.isReadMessage(payload).then((res) => {
              if (res == true) {
                data.forEach((item) => {
                  if (item.status == 0 && item.to_user_id != 2) {
                    item.status = 1
                  }
                })
                debugger
                this.selectedUserMsg = data
                Vue.set(this.userNotesList[this.selectedNoteListIndex], this.selectedUser.id, data)
                this.userNotesList[this.selectedNoteListIndex].lastmsg = data[data.length - 1].content
                this.userNotesList[this.selectedNoteListIndex].date = data[data.length - 1].created_at
              } else {
                debugger
              }
            })
          } else {
            debugger
            this.selectedUserMsg = data
            Vue.set(this.userNotesList[this.selectedNoteListIndex], this.selectedUser.id, data)
            this.userNotesList[this.selectedNoteListIndex].lastmsg = data[data.length - 1].content
            this.userNotesList[this.selectedNoteListIndex].date = data[data.length - 1].created_at
          }

          /*      this.selectedUserMsg = res.data*/
          /* Vue.set(this.userNotesList[this.selectedNoteListIndex], this.selectedUser.id, res.data)*/
          console.log(this.userNotesList)
          /*          this.userNotesList[this.selectedNoteListIndex][this.selectedUser.id] = []*/
          /*   this.userNotesList[this.selectedNoteListIndex][this.selectedUser.id] = res.data*/
          console.log('yenileme', res)
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), 'Mesajlar Yenilenirken Hata Gerçekleşti', 'error', this.$t('ok'))
        })
      },
      onDeleteMsg (msg, index) {
        debugger
        this.loading = true
        this.$store.dispatch(DELETE_USER_NOTES, { id: msg.id }).then((res) => {
          this.loading = false
          this.selectedUserMsg.splice(index, 1)
          this.userNotesList[this.selectedNoteListIndex].lastmsg = this.selectedUserMsg[this.selectedUserMsg.length - 1].content
          this.userNotesList[this.selectedNoteListIndex].date = this.selectedUserMsg[this.selectedUserMsg.length - 1].created_at
        }).catch((err) => {
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('deleteRecordErrMsg'), 'error', this.$t('ok'))
        })
        /*  this.selectedUserMsg.splice(index,1);*/
      },
      sendMsg () {
        if (this.content.trim() == '') {
          appPlugin.showalert(this.$t('warning'), 'Mesaj Boş Gönderilemez', 'info', this.$t('ok'))
        } else {
          this.loading = true
          let payload = {
            touserid: 2,
            fromuserid: this.selectedUser.id,
            ncontent: this.content
          }
          this.$store.dispatch(CREATE_USER_NOTES, payload).then((res) => {
            debugger
            this.userNotesList[this.selectedNoteListIndex][this.selectedUser.id].push(
              res.data[0]
            )

            this.userNotesList[this.selectedNoteListIndex].lastmsg = res.data[0].content
            this.userNotesList[this.selectedNoteListIndex].date = res.data[0].created_at
            this.content = ''
            this.loading = false
          }).catch((err) => {
            debugger
            this.loading = false
          })
        }

      },
      isReadMessage (payload) {
        let deferred = new Promise(((resolve, reject) => {
          this.loading = true
          this.$store.dispatch(UPDATE_USER_NOTES, { urlparse: payload }).then((res) => {
            debugger
            this.loading = false
            resolve(true)
          }).catch((err) => {
            this.loading = false
            appPlugin.showalert(this.$t('warning'), 'Mesajlar Okundu Olarak İşaretlenemedi', 'error', this.$t('ok'))
            resolve(false)
          })
        }))
        return deferred

      },
      onSelectUserMsg (item, i) {
        debugger
        //TODO USER ID
        let payload = appPlugin.urlParse('to_user_id=' + item.user.id + '& from_user_id=' + 2)
        this.userNotesList.forEach((item, index) => {
          if (index != i) {
            item.active = false
          }
        })

        this.selectedNoteListIndex = i
        item.active = true
        this.selectedUserMsg = item[item.user.id]
        this.selectedUser = item.user
        if (item.notseen != 0) {
          this.isReadMessage(payload).then((res) => {
            if (res == true) {
            }
          })
        }
        item.notseen = 0
        /*   this.userNotesList.forEach((item, index) => {
             if (index != i) {
               item.active = false
             }
           })
           item.notseen = 0
           this.selectedNoteListIndex = i
           item.active = true
           this.selectedUserMsg = item[item.user.id]
           this.selectedUser = item.user*/

      },
      fetchUserRecentMsg () {
        //TODO USER ID DEĞİŞECEK
        this.loading = true
        /*        let userMsgBoxData=[]
                this.$store.dispatch(FETCH_USER_MSG_BOX, {
                  userid: 2
                }).then((res) => {
                  if(res.data.length>0){
                    userMsgBoxData=res.data
                  }
                }).catch((err) => {
                  debugger
                })*/
        this.$store.dispatch(FETCH_USER_MSG_BOX, {
          userid: 2
        }).then((res) => {
          debugger
          this.loading = false
          let notInUsers = []
          if (res.data.length < 1) {
            notInUsers.push(2)
            let payload = appPlugin.urlParse('uİsActive=1')
            this.notInContactUsers = notInUsers
            this.fetchContactList({ urlparse: payload, paginate: true, users: notInUsers })
          } else {
            /*     let tummesaj = [...data[0].frommessage, ...data[0].tomessage];
     console.log("tumu",tummesaj)
     let gruplanan=_.groupBy(tummesaj,"from_user_id")*/
            let frommessage = _.where(res.data, { from_user_id: 2 })
            let tomessage = res.data.filter((item) => {
              return item.to_user_id == 2
            })
            let msgList = []
            let incoming = _.groupBy(frommessage, 'to_user_id')
            let incomingkeys = Object.keys(incoming)
            let outgoing = _.groupBy(tomessage, 'from_user_id')
            let outgoingkeys = Object.keys(outgoing)
            for (let i = 0; i < incomingkeys.length; i++) {
              for (let j = 0; j < outgoingkeys.length; j++) {
                if (incomingkeys[i] === outgoingkeys[j]) {
                  let totalMsg = [...incoming[incomingkeys[i]], ...outgoing[outgoingkeys[j]]]
                  let notSeenMsgCount = totalMsg.filter((item) => {
                    //TODO USERID
                    return ((item.to_user_id != 2) && (item.status == 0))
                  })
                  let user = {}
                  if (totalMsg[0].fromuser.id == incomingkeys[i]) {
                    user = totalMsg[0].fromuser
                  }
                  if (totalMsg[0].touser.id == incomingkeys[i]) {
                    user = totalMsg[0].touser
                  }
                  let sorted = _.sortBy(totalMsg, 'id')
                  debugger
                  sorted[0].user = user
                  notInUsers.push(incomingkeys[i])
                  debugger
                  msgList.push({
                    [incomingkeys[i]]: sorted,
                    user: user,
                    active: false,
                    lastmsg: sorted[sorted.length - 1].content,
                    date: sorted[sorted.length - 1].created_at,
                    notseen: notSeenMsgCount.length,

                  })
                }

              }
            }
            debugger
            let differentKeys = _.difference(incomingkeys, outgoingkeys)
            let otherdifferentKeys = _.difference(outgoingkeys, incomingkeys)
            let totalDifferent = [...differentKeys, ...otherdifferentKeys]
            totalDifferent.forEach((item) => {
              debugger
              let user = {}
              /*     if (totalMsg[0].fromuser.id == incomingkeys[i]) {
                     user = totalMsg[0].fromuser
                   }
                   if (totalMsg[0].touser.id == incomingkeys[i]) {
                     user = totalMsg[0].touser
                   }*/
              if (incoming[item] != undefined) {
                debugger
                if (incoming[item][0].fromuser.id == item) {
                  user = incoming[item][0].fromuser
                }
                if (incoming[item][0].touser.id == item) {
                  user = incoming[item][0].touser
                }
                incoming[item][0].user = user
                let notSeenCount = incoming[item].filter((item) => {
                  return item.status == 0

                })
                debugger
                notInUsers.push(item)
                msgList.push({
                  [item]: incoming[item],
                  user: user,
                  active: false,
                  lastmsg: incoming[item][incoming[item].length - 1].content,
                  date: incoming[item][0].created_at,
                  notseen: notSeenCount.length

                })
              }
              debugger
              if (outgoing[item] != undefined) {
                debugger
                if (outgoing[item][0].fromuser.id == item) {
                  user = outgoing[item][0].fromuser
                }
                if (outgoing[item][0].touser.id == item) {
                  user = outgoing[item][0].touser
                }
                notInUsers.push(item)
                outgoing[item][0].user = user
                msgList.push({
                  [item]: outgoing[item],
                  user: user,
                  active: false,
                  lastmsg: outgoing[item][outgoing[item].length - 1].content,
                  date: outgoing[item][0].created_at,
                  notseen: 0
                })
              }
            })
            this.userNotesList = _.sortBy(msgList, 'date').reverse()

            //USER ID TODO
            notInUsers.push(2)
            let payload = appPlugin.urlParse('uİsActive=1')
            this.notInContactUsers = notInUsers
            this.fetchContactList({ urlparse: payload, paginate: true, users: notInUsers })
            debugger
            /*            console.log('yok', olmayan)
                        console.log('birleşim', birlesim)
                        this.datas = birlesim[1]
                        console.log('gelen mesajlar', banagelen)
                        console.log('gönderdiklerim', benimcevapladıgım)*/
            debugger
          }
          console.log('store', this.$store.getters.getUserNotes)
        }).catch((err) => {
          debugger
          this.loading = false
          appPlugin.showalert(this.$t('warning'), this.$t('fetchError'), 'error', this.$t('ok'))
        })
      }
    },
    name: 'specialnotes',
    data () {
      return {
        selectedContact: {},
        searchTxt: '',
        contactUser: [],
        selectedNoteListIndex: 0,
        notInContactUsers: [],
        content: '',
        defaultPreview: defaultImage,
        datas: [],
        userNotesList: [],
        loading: false,
        selectedUser: {},
        selectedUserMsg: [],
        nextpageurl: '',
        lastpageurl: ''
      }
    },
    components: {
      MsgPopup,
      chatusersearch,
      chatuserlist,
      Flex,
      FlexCard,
      Loading
    }
  }
</script>

<style scoped>
  ::-webkit-scrollbar {
    width: 5px;
  }

  ::-webkit-scrollbar-track {
    width: 5px;
    background: #f5f5f5;
  }

  ::-webkit-scrollbar-thumb {
    width: 1em;
    background-color: #ddd;
    outline: 1px solid slategrey;
    border-radius: 1rem;
  }

  .container {
    max-width: 1170px;
    margin: auto;
  }

  img {
    max-width: 100%;
  }

  .inbox_people {
    background: white none repeat scroll 0 0;
    float: left;
    overflow: hidden;
    width: 40%;
    height: 100%;
    border-right: 1px solid #c4c4c4;
  }

  .inbox_msg {
    clear: both;
    height: 100%;
    overflow: hidden;
  }

  .top_spac {
    margin: 20px 0 0;
  }


  .recent_heading {
    float: left;
    width: 40%;
  }

  .srch_bar {
    display: inline-block;
    text-align: right;
    width: 60%;
  }

  .headind_srch {
    padding: 10px 29px 10px 20px;
    overflow: hidden;
    border-bottom: 1px solid #c4c4c4;
  }

  .recent_heading h4 {
    color: #05728f;
    font-size: 21px;
    margin: auto;
  }

  .srch_bar input {
    border: 1px solid #cdcdcd;
    border-width: 0 0 1px 0;
    width: 100%;
    padding: 2px 0 4px 6px;
    background: none;
  }

  .srch_bar .input-group-addon button {
    background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
    border: medium none;
    padding: 0;
    color: #707070;
    font-size: 18px;
  }

  .srch_bar .input-group-addon {
    margin: 0 0 0 -27px;
  }

  .chat_ib h5 {
    font-size: 15px;
    color: #464646;
    margin: 0 0 8px 0;
  }

  .chat_ib h5 span {
    font-size: 13px;
    float: right;
  }

  .chat_ib p {
    font-size: 14px;
    color: #989898;
    margin: auto
  }

  .chat_img {
    float: left;
    width: 11%;
  }

  .chat_ib {
    float: left;
    padding: 0 0 0 15px;
    width: 88%;
  }

  .chat_people {
    overflow: hidden;
    clear: both;
  }

  .chat_list {
    border-bottom: 1px solid #c4c4c4;
    margin: 0;
    padding: 18px 16px 10px;
  }

  .inbox_chat {
    height: 550px;
    overflow-y: scroll;
  }

  .active_chat {
    background: #c3bdc7;
  }

  .incoming_msg_img {
    display: inline-block;
    width: 6%;
  }

  .received_msg {
    display: inline-block;
    padding: 0 0 0 10px;
    vertical-align: top;
    width: 92%;
  }

  .received_withd_msg p {
    background: #ebebeb none repeat scroll 0 0;
    border-radius: 3px;
    color: #646464;
    font-size: 14px;
    margin: 0;
    padding: 5px 10px 5px 12px;
    width: 100%;
  }

  .time_date {
    color: #747474;
    display: block;
    font-size: 12px;
    margin: 8px 0 0;
  }

  .received_withd_msg {
    width: 57%;
  }

  .mesgs {
    float: left;
    padding: 30px 15px 0 25px;
    width: 60%;
  }

  .sent_msg p {
    background: #05728f none repeat scroll 0 0;
    border-radius: 3px;
    font-size: 14px;
    margin: 0;
    color: #fff;
    padding: 5px 10px 5px 12px;
    width: 100%;
  }

  .outgoing_msg {
    overflow: hidden;
    margin: 26px 0 26px;
  }

  .sent_msg {
    float: right;
    width: 46%;
  }

  .input_msg_write input {
    background: rgba(0, 0, 0, 0) none repeat scroll 0 0;
    border: medium none;
    color: #4c4c4c;
    font-size: 15px;
    min-height: 48px;
    width: 100%;
  }

  .type_msg {
    border-top: 1px solid #c4c4c4;
    position: relative;
  }

  .msg_send_btn {
    background: #05728f none repeat scroll 0 0;
    border: medium none;
    border-radius: 50%;
    color: #fff;
    cursor: pointer;
    font-size: 17px;
    height: 33px;
    position: absolute;
    right: 0;
    top: 11px;
    width: 33px;
  }

  textarea {
    resize: none;
  }

  .messaging {
    border: 1px solid #c4c4c4;
    padding: 0 0 50px 0;
  }

  .msg_history {
    height: 516px;
    overflow-y: auto;
  }

  .contacts {
    height: 516px;
    max-height: 516px;
    overflow-y: scroll;
  }
</style>
