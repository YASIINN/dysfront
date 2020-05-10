import axios from 'axios'
import _ from 'underscore'
import {
  SET_POST,
  CREATE_POST,
  DELETE_POST,
  FETCH_ALL_POST,
  FETCH_POST,
  GET_POST,
  GET_POST_HEADER,
  UPDATE_POST,
  FETCH_NEXT_POST,
  SET_NEXT_POST,
  LIKE_POST,
  FETCH_POST_LIKE_USER,
  GET_POST_LIKE_USER, SET_POST_LIKE_USER, FETCH_USER_POST, GET_USER_POST, SET_USER_POST,
  SET_NEXT_USERS_POST, FETCH_NEXT_USERS_POST,
  FETCH_POST_VIEW_USER, GET_POST_VIEW_USER, SET_VIEW_POST_USER, GET_POST_DETAIL_PASS_DATA, SET_POST_DETAIL_PASS_DATA,
  FETCH_POST_DETAIL,
  LIKE_COMMENT,
  CREATE_COMMENT,
  DELETE_COMMENT,
  FETCH_POST_COMMENT
} from './moduleNames'

const post = {
  state: {
    postList: [],
    postLikeUser: [],
    userPosts: [],
    postViewUser: [],
    postdetailPassed: [],
  },
  mutations: {
    [SET_VIEW_POST_USER] (state, data) {
      state.postViewUser = data
    },
    [SET_POST_DETAIL_PASS_DATA] (state, data) {
      state.postdetailPassed = data
    },
    [SET_USER_POST] (state, data) {
      state.userPosts = []
      data.forEach((item) => {

        //TODO BEnim user id
        debugger
        if (item.user.id == 2) {
          item.showviews = true
          item.showDelete = true
        } else {
          item.showviews = false
          item.showDelete = false
        }
        if (item.likes.length > 0) {
          let userLike = _.where(
            item.likes,
            {
              id: 2
            }
          )
          if (userLike.length < 1) {
            item.userLike = false

          } else {
            item.userLike = true
          }
        } else {
          item.userLike = false
        }

        item.iFiles = []
        item.dFiles = []
        if (item.files.length > 0) {
          item.files.forEach((file) => {
            if (file.viewtype == 'img') {
              item.iFiles.push(file.path)
            } else {
              item.dFiles.push({
                fileName: file.viewname,
                uri: file.path
              })
            }
          })
        }
        state.userPosts.push(item)
      })
    },
    [SET_NEXT_USERS_POST] (state, data) {
      data.forEach((item) => {

        //TODO BEnim user id
        debugger
        if (item.user.id == 2) {
          item.showviews = true
          item.showDelete = true
        } else {
          item.showviews = false
          item.showDelete = false
        }
        if (item.likes.length > 0) {
          let userLike = _.where(
            item.likes,
            {
              id: 2
            }
          )
          if (userLike.length < 1) {
            item.userLike = false

          } else {
            item.userLike = true
          }
        } else {
          item.userLike = false
        }

        item.iFiles = []
        item.dFiles = []
        if (item.files.length > 0) {
          item.files.forEach((file) => {
            if (file.viewtype == 'img') {
              item.iFiles.push(file.path)
            } else {
              item.dFiles.push({
                fileName: file.viewname,
                uri: file.path
              })
            }
          })
        }
        state.userPosts.push(item)
      })
    },
    [SET_NEXT_POST] (state, data) {
      data.forEach((item) => {

        //TODO BEnim user id
        debugger
        if (item.user.id == 2) {
          item.showviews = true
          item.showDelete = true
        } else {
          item.showviews = false
          item.showDelete = false
        }
        if (item.likes.length > 0) {
          let userLike = _.where(
            item.likes,
            {
              id: 2
            }
          )
          if (userLike.length < 1) {
            item.userLike = false

          } else {
            item.userLike = true
          }
        } else {
          item.userLike = false
        }

        item.iFiles = []
        item.dFiles = []
        if (item.files.length > 0) {
          item.files.forEach((file) => {
            if (file.viewtype == 'img') {
              item.iFiles.push(file.path)
            } else {
              item.dFiles.push({
                fileName: file.viewname,
                uri: file.path
              })
            }
          })
        }
        state.postList.push(item)
      })
    },
    [SET_POST_LIKE_USER] (state, data) {
      state.postLikeUser = data
    },
    [SET_POST] (state, data) {
      state.postList = []
      data.forEach((item) => {

        //TODO BEnim user id
        debugger
        if (item.user.id == 2) {
          item.showviews = true
          item.showDelete = true
        } else {
          item.showviews = false
          item.showDelete = false
        }
        if (item.likes.length > 0) {
          let userLike = _.where(
            item.likes,
            {
              id: 2
            }
          )
          if (userLike.length < 1) {
            item.userLike = false

          } else {
            item.userLike = true
          }
        } else {
          item.userLike = false
        }

        item.iFiles = []
        item.dFiles = []
        if (item.files.length > 0) {
          item.files.forEach((file) => {
            if (file.viewtype == 'img') {
              item.iFiles.push(file.path)
            } else {
              item.dFiles.push({
                fileName: file.viewname,
                uri: file.path
              })
            }
          })
        }
        state.postList.push(item)
      })
      debugger
    }
  },
  actions: {
    [UPDATE_POST] ({ commit, state }, updatedData) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .put('/province/' + updatedData.id, updatedData)
          .then(response => {
            if (response.status === 200) {
              state.provinceList.forEach((item, i) => {
                if (item.id === response.data.id) {
                  state.provinceList[i] = response.data
                }
              })
            }
            resolve(response)
          })
          .catch(err => {
            resolve(err.message)
          })
      })

      return deferred
    },
    [FETCH_POST_DETAIL] ({ commit, state }, data) {

      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/postdetail/' + data.id)
          .then(response => {
            debugger
            if (response.status === 200) {
              debugger
              response.data.forEach((item) => {

                //TODO BEnim user id
                debugger
                item.comments.forEach((comment) => {
                  comment.iFiles = []
                  comment.dFiles = []
                  if (comment.files.length > 0) {
                    comment.files.forEach((file) => {
                      if (file.viewtype == 'img') {
                        comment.iFiles.push(file.path)
                      } else {
                        comment.dFiles.push({
                          fileName: file.viewname,
                          uri: file.path
                        })
                      }
                    })
                  }
                  //Benimse Yorum
                  if (comment.user_id == 2) {
                    comment.commentDelete = true
                  } else {
                    comment.commentDelete = false
                  }
                  if (comment.likes.length > 0) {
                    debugger
                    let userLike = _.where(
                      comment.likes,
                      {
                        id: 2
                      }
                    )
                    debugger
                    if (userLike.length < 1) {
                      comment.userLike = false
                    } else {
                      comment.userLike = true
                    }
                  } else {
                    comment.userLike = false
                  }
                })
                item.comments = item.comments.reverse()
                if (item.user.id == 2) {
                  item.showviews = true
                  item.showDelete = true
                } else {
                  item.showviews = false
                  item.showDelete = false
                }
                if (item.likes.length > 0) {
                  let userLike = _.where(
                    item.likes,
                    {
                      id: 2
                    }
                  )
                  if (userLike.length < 1) {
                    item.userLike = false

                  } else {
                    item.userLike = true
                  }
                } else {
                  item.userLike = false
                }

                item.iFiles = []
                item.dFiles = []
                if (item.files.length > 0) {
                  item.files.forEach((file) => {
                    if (file.viewtype == 'img') {
                      item.iFiles.push(file.path)
                    } else {
                      item.dFiles.push({
                        fileName: file.viewname,
                        uri: file.path
                      })
                    }
                  })
                }
                state.userPosts.push(item)
              })
              commit(SET_POST_DETAIL_PASS_DATA, response.data)
            }
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })

      return deferred
    },
    [DELETE_POST] ({ commit, state }, data) {
      debugger
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/post/' + data.id)
          .then(response => {
            debugger
            if (response.status === 200) {
              if (data.deletedType == 'mypost') {
                state.userPosts.splice(data.index, 1)
              } else if (data.deletedType == 'allpost') {
                state.postList.splice(data.index, 1)
              } else if (data.deletedType == 'postdetail') {
                state.postdetailPassed.splice(data.index, 1)
              }
            }
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })

      return deferred
    },
    [DELETE_COMMENT] ({ commit, state }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .delete('/deletecomment/' + data.id)
          .then(response => {
            debugger
            if (response.status === 200) {
              state.postdetailPassed[0].comments.splice(data.index, 1)
            }
            resolve(response)
          })
          .catch(err => {
            reject(err)
          })
      })

      return deferred
    },

    [LIKE_COMMENT] ({ commit, state, dispatch }, data) {
      debugger
      //postlike
      let deferred = new Promise(((resolve, reject) => {
        debugger
        axios.post('/likecomment', data).then((res) => {
          if (res.status == 200) {
            let postIndex = 0
            if (data.likedCommentType == 'detailpost') {
              let comment = state.postdetailPassed[0].comments.filter((item, i) => {
                if (item.id == data.commentid) {
                  postIndex = i
                  return item
                }
              })
              /*        filter((item, i) => {
                        if (item.id == data.postid) {
                          postIndex = i
                          return item
                        }
                      })*/
              if (data.liketype == 1) {
                debugger
                comment[0].userLike = true
                comment[0].likes.push({
                  uFullName: 'Yasin Dalkılıç',
                  id: data.userid
                })
              } else {
                debugger
                comment[0].userLike = false
                let likedUser = state.postdetailPassed[0].comments[postIndex].likes.filter((item) => {
                  /*  return item.id != data.userid*/
                  return item.id != data.userid
                })
                comment[0].likes = likedUser
              }
              /*      state.postdetailPassed[postIndex].userLike = post[0].userLike
                    state.postdetailPassed[postIndex].likes = post[0].likes*/
            }
            resolve(res)
          }
        }).catch((err) => {
          debugger
          reject(err.message)
        })
      }))
      return deferred
    },
    [LIKE_POST] ({ commit, state, dispatch }, data) {
      debugger
      //postlike
      let deferred = new Promise(((resolve, reject) => {
        debugger
        axios.post('/postlike', data).then((res) => {
          if (res.status == 200) {
            let postIndex = 0
            if (data.likedPostType == 'mypost') {
              let post = state.userPosts.filter((item, i) => {
                if (item.id == data.postid) {
                  postIndex = i
                  return item
                }
              })
              if (data.liketype == 1) {
                debugger
                post[0].userLike = true
                //Userdan alınacak TODO
                post[0].likes.push({
                  uFullName: 'Yasin Dalkılıç',
                  id: data.userid
                })
              } else {
                debugger
                post[0].userLike = false
                let likedUser = post[0].likes.filter((item) => {
                  return item.id != data.userid
                })
                post[0].likes = likedUser
              }
              state.userPosts[postIndex].userLike = post[0].userLike
              state.userPosts[postIndex].likes = post[0].likes
            } else if (data.likedPostType == 'allpost') {
              let post = state.postList.filter((item, i) => {
                if (item.id == data.postid) {
                  postIndex = i
                  return item
                }
              })
              if (data.liketype == 1) {
                debugger
                post[0].userLike = true
                post[0].likes.push({
                  uFullName: 'Yasin Dalkılıç',
                  id: data.userid
                })
              } else {
                debugger
                post[0].userLike = false
                let likedUser = post[0].likes.filter((item) => {
                  return item.id != data.userid
                })
                post[0].likes = likedUser
              }
              state.postList[postIndex].userLike = post[0].userLike
              state.postList[postIndex].likes = post[0].likes
            } else if (data.likedPostType == 'detailpost') {
              let post = state.postdetailPassed.filter((item, i) => {
                if (item.id == data.postid) {
                  postIndex = i
                  return item
                }
              })
              if (data.liketype == 1) {
                debugger
                post[0].userLike = true
                post[0].likes.push({
                  uFullName: 'Yasin Dalkılıç',
                  id: data.userid
                })
              } else {
                debugger
                post[0].userLike = false
                let likedUser = post[0].likes.filter((item) => {
                  return item.id != data.userid
                })
                post[0].likes = likedUser
              }
              state.postdetailPassed[postIndex].userLike = post[0].userLike
              state.postdetailPassed[postIndex].likes = post[0].likes
            }
            resolve(res)
          }
        }).catch((err) => {
          debugger
          reject(err.message)
        })
      }))
      return deferred
    },
    [FETCH_POST_COMMENT] ({ commit, state, dispatch }, data) {
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/getcomments', data).then((res) => {
          res.data[0].comments.forEach((comment) => {
            comment.iFiles = []
            comment.dFiles = []
            if (comment.files.length > 0) {
              comment.files.forEach((file) => {
                if (file.viewtype == 'img') {
                  comment.iFiles.push(file.path)
                } else {
                  comment.dFiles.push({
                    fileName: file.viewname,
                    uri: file.path
                  })
                }
              })
            }
            //Benimse Yorum
            if (comment.user_id == 2) {
              comment.commentDelete = true
            } else {
              comment.commentDelete = false
            }
            if (comment.likes.length > 0) {
              debugger
              let userLike = _.where(
                comment.likes,
                {
                  id: 2
                }
              )
              debugger
              if (userLike.length < 1) {
                comment.userLike = false
              } else {
                comment.userLike = true
              }
            } else {
              comment.userLike = false
            }
          })
          state.postdetailPassed[0].comments = res.data[0].comments.reverse()
          resolve(res)
        }).catch((err) => {
          reject(err)
        })
      }))
      return deferred
    },
    [CREATE_COMMENT] ({ commit, state, dispatch }, data) {
      debugger
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/createcomment', data).then((res) => {
          if (res.status == 200) {
            debugger
            res.data[0].comments.forEach((comment) => {
              comment.iFiles = []
              comment.dFiles = []
              if (comment.files.length > 0) {
                comment.files.forEach((file) => {
                  if (file.viewtype == 'img') {
                    comment.iFiles.push(file.path)
                  } else {
                    comment.dFiles.push({
                      fileName: file.viewname,
                      uri: file.path
                    })
                  }
                })
              }
              //Benimse Yorum
              if (comment.user_id == 2) {
                comment.commentDelete = true
              } else {
                comment.commentDelete = false
              }
              if (comment.likes.length > 0) {
                debugger
                let userLike = _.where(
                  comment.likes,
                  {
                    id: 2
                  }
                )
                debugger
                if (userLike.length < 1) {
                  comment.userLike = false
                } else {
                  comment.userLike = true
                }
              } else {
                comment.userLike = false
              }
            })
            state.postdetailPassed[0].comments = res.data[0].comments.reverse()
            resolve(res)
          }
        }).catch((err) => {
          debugger
          reject(err)
        })
      }))
      return deferred
    },
    [CREATE_POST] ({ commit, state, dispatch }, data) {
      debugger
      let deferred = new Promise((resolve, reject) => {
        axios
          .post('/post', data)
          .then(res => {
            debugger
            debugger
            if (res.status === 200) {
              debugger
              res.data.forEach((item) => {
                if (item.user.id == 2) {
                  item.showDelete = true
                } else {
                  item.showDelete = false
                }
                if (item.likes.length > 0) {
                  let userLike = _.where(
                    item.likes,
                    {
                      id: 2
                    }
                  )
                  if (userLike.length < 1) {
                    item.userLike = false

                  } else {
                    item.userLike = true
                  }
                } else {
                  item.userLike = false
                }

                item.iFiles = []
                item.dFiles = []
                if (item.files.length > 0) {
                  item.files.forEach((file) => {
                    if (file.viewtype == 'img') {
                      item.iFiles.push(file.path)
                    } else {
                      item.dFiles.push({
                        fileName: file.viewname,
                        uri: file.path
                      })
                    }
                  })
                }
              })
              state.postList.unshift(res.data[0])
              /*
              state.postList = [...state.postList, res.data[0]]*/
            }
            resolve(res)
          })
          .catch(err => {
            reject(err.message)
          })
      })
      return deferred
    },
    [FETCH_POST_VIEW_USER] ({ commit, state, dispatch }, data) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/postview/' + data.id)
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                commit(SET_VIEW_POST_USER, res.data)
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    },
    [FETCH_POST_LIKE_USER] ({ commit, state, dispatch }, data) {

      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/postlike/' + data.id)
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                commit(SET_POST_LIKE_USER, res.data)
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    },
    [FETCH_ALL_POST] ({ commit, state, dispatch }) {
      let deferred = new Promise((resolve, reject) => {
        axios
          .get('/posttype')
          .then(res => {
            if (res.status) {
              if (res.status == 200) {
                commit(SET_POST_TYPE, res.data)
                resolve(res.data)
              }
            }
          })
          .catch(err => {
            resolve(err)
          })
      })
      return deferred
    },

    [FETCH_NEXT_USERS_POST] ({ commit, state, dispatch }, data) {
      //değişecek TODO
      debugger
      let deferred = new Promise(((resolve, reject) => {
        axios.post(data.url, data.query).then((res) => {
          resolve(res)
          debugger
          commit(SET_NEXT_USERS_POST, res.data.data)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred

    },
    [FETCH_NEXT_POST] ({ commit, state, dispatch }, data) {
      //değişecek TODO
      debugger
      let deferred = new Promise(((resolve, reject) => {
        axios.post(data.url, data).then((res) => {
          resolve(res)
          debugger
          commit(SET_NEXT_POST, res.data.data)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred

    },
    [FETCH_USER_POST] ({ commit, state, dispatch }, data) {
      debugger
      let deferred = new Promise(((resolve, reject) => {
        axios.post('/mypost', data).then((res) => {
          resolve(res)
          debugger
          commit(SET_USER_POST, res.data.data)
        }).catch((err) => {
          resolve(err)
        })
      }))
      return deferred
    },
    [FETCH_POST] ({ commit, state, dispatch }, data) {
      //değişecek TODO
      debugger
      let deferred = new Promise(((resolve, reject) => {
        debugger
        axios.post('/getPost', data).then((res) => {
          debugger
          debugger
          commit(SET_POST, res.data.data)
          debugger
          resolve(res)
debugger
        }).catch((err) => {
          debugger
          reject(err);
        })
      }))
      return deferred

    }
  },
  getters: {
    [GET_POST] (state) {
      return state.postList
    },
    [GET_POST_LIKE_USER] (state) {
      return state.postLikeUser
    },
    [GET_USER_POST] (state) {
      return state.userPosts
    },
    [GET_POST_VIEW_USER] (state) {
      return state.postViewUser
    },
    [GET_POST_DETAIL_PASS_DATA] (state) {
      return state.postdetailPassed
    }
  }
}
export default post
