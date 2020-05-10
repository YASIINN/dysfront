<template>
  <div>
    <div class="row">
      <div class="col-xl-12">
        <div class="card bg-default">
          <div class="card-header bg-transparent">
            <div class="row align-items-center">
              <div class="col">
                <!--    <h5 class="h3 text-white mb-0">Zafer DYS Hoşgeldiniz. Version: Beta</h5>-->
                <textarea class="form-control" v-model="msg" @keypress="sendmsg($event)"></textarea>
                <button class="btn btn-primary" @click="sendmsg">Mesaj Yolla</button>
                <br/>
                <ul>
                  <li v-for="item in msgList">{{item}}</li>
                </ul>
              </div>
            </div>
          </div>
          <div class="card-body">
            <!-- Chart -->
            <div class="chart">
              <!-- Chart wrapper -->
              <canvas id="chart-sales-dark" class="chart-canvas"></canvas>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'
  import MainLayout from '../layouts/main'

  export default {
    name: 'home',
    components: {
      MainLayout,
    },
    data () {
      return {
        msgList: [],
        msg: ''
      }
    },
    created () {
      debugger
      let _this=this;
      Pusher.logToConsole = true
      var pusher = new Pusher('ba64fd6e5d3a97fa3064', {
        cluster: 'eu',
        forceTLS: true
      })
      var channel = pusher.subscribe('my-channel')
      channel.bind('send-msg', function (data) {
        debugger
        _this.msgList.push(data.msg)
        console.log(data)
      })
    },
    methods: {
      sendmsg (e) {
        debugger
        if(e.keyCode==13){

        axios.post('/mesaj', { msg:this.msg }).then((res) => {
          this.msg = ''
          debugger
        }).catch((err) => {
          debugger
        })
        }

      },
      test () {
        this.$store.dispatch('setLanguage')

      }
    }
  }
</script>
