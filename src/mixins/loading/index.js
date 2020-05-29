const loadingMixins = {

  data () {
    return {
      loading: false,
      someInfo: 'Yasin'
    }
  },
  methods: {
    onCloseIndıcator () {
      this.loading = false
    },
    onOpenIndıcator () {
      this.loading = true
    },
    changeName (param) {
      this.someInfo = param
    },
  }
}

export default loadingMixins
