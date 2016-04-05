import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'

// Constants
// export const constants = { }
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
export const FETCH_DATA_FAIL = 'FETCH_DATA_FAIL'

export const FETCH_HEADER_REQUEST = 'FETCH_HEADER_REQUEST'
export const FETCH_HEADER_SUCCESS = 'FETCH_HEADER_SUCCESS'
export const FETCH_HEADER_FAIL = 'FETCH_HEADER_FAIL'

export const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
export const UPLOAD_FILE_FAIL = 'UPLOAD_FILE_FAIL'
export const RE_ORDER_DATA = 'RE_ORDER_DATA'

export const getDataRequest = createAction(FETCH_DATA_REQUEST, (data) => data)
export const getDataSuccess = createAction(FETCH_DATA_SUCCESS, (data) => data)
export const getDataFail = createAction(FETCH_DATA_FAIL, (data) => data)

export const getHeaderRequest = createAction(FETCH_HEADER_REQUEST, (data) => data)
export const getHeaderSuccess = createAction(FETCH_HEADER_SUCCESS, (data) => data)
export const getHeaderFail = createAction(FETCH_HEADER_FAIL, (data) => data)

export const uploadFileRequest = createAction(UPLOAD_FILE_REQUEST, (data) => data)
export const uploadFileSuccess = createAction(UPLOAD_FILE_SUCCESS, (data) => data)
export const uploadFileFail = createAction(UPLOAD_FILE_FAIL, (data) => data)

export const reorderDataAction = createAction(RE_ORDER_DATA, (data) => data)

const initialState = Immutable.fromJS({
  myCollection: null,
  mappingHeader: null,
  isFetch: false,
  isFetching: false,
  isFetchHeader: false,
  isFetchingHeader: false,
  statusText: null,
  isUploaded: false,
  isUploading: false
})

function reOrderOffice (normalArr, parrentOfficeId, filteredList) {
  let childs = normalArr.filter((item) => {
    return item.ParrentOfficeId === parrentOfficeId
  })

  childs.sort((l, r) => {
    return l.OrderNo > r.OrderNo ? 1 : -1
  })

  childs.map((item) => {
    item.Orders = []
    for (let i = 0; i < childs.length; i++) {
      item.Orders = [...item.Orders, ({ OrderNo: (i + 1), Text: (i + 1) })]
    }

    filteredList.push(item)
    reOrderOffice(normalArr, item.ID, filteredList)
  })
}

function checkHttpStatus (response) {
  if (response.status >= 200 && response.status < 300) {
    return response
  } else {
    var error = new Error(response.statusText)
    error.response = response
    throw error
  }
}

function parseJSON (response) {
  return response.json()
}

let API_URL = 'http://192.168.1.108:82/'
/*  export function getData () {
  return (dispatch, getState) => {
    dispatch(getDataRequest())
    return fetch('/offices.json', {
      method: 'get',
      headers: {
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      }
    }).then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        try {
          let temp = []
          reOrderOffice(response.items, -1, temp)
          dispatch(getDataSuccess({filteredList: temp}))
        } catch (e) {
          console.log(e)
          dispatch(getDataFail({
            status: 405,
            statusText: e
          }))
        }
      })
    .catch((error) => {
      dispatch(getDataFail({
        status: 405,
        statusText: error.message
      }))
    })
  }
}*/

export function getData () {
  return (dispatch, getState) => {
    dispatch(getDataRequest())
    return fetch('/data.json', {
      method: 'get'
    }).then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        try {
          dispatch(getDataSuccess(response))
        } catch (e) {
          console.log(e)
          dispatch(getDataFail({
            status: 405,
            statusText: e
          }))
        }
      })
      .catch((error) => {
        dispatch(getDataFail({
          status: 405,
          statusText: error.message
        }))
      })
  }
}

export function getMappingHeader () {
  return (dispatch, getState) => {
    dispatch(getHeaderRequest())
    let temp = localStorage.getItem('selectedFile')
    if (temp) {
      let selectedFile = JSON.parse(temp)
      dispatch(getHeaderSuccess(selectedFile))
      return
    }

    dispatch(getHeaderFail({
      status: 405,
      statusText: 'Parse failed'
    }))
    // console.log(localStorage.getItem('selectedFile'))
    // return fetch('/mapping_db.json', {
    //   method: 'get'
    // }).then(checkHttpStatus)
    //   .then(parseJSON)
    //   .then((response) => {
    //     try {
    //       dispatch(getHeaderSuccess(response))
    //     } catch (e) {
    //       dispatch(getHeaderFail({
    //         status: 405,
    //         statusText: e
    //       }))
    //     }
    //   })
  }
}

export function uploadFile (fileData) {
  return (dispatch, getState) => {
    dispatch(uploadFileRequest())
    return fetch(API_URL + 'Home/ParseXlsx', {
      method: 'POST',
      mode: 'cors',
      body: fileData
    }).then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        try {
          dispatch(uploadFileSuccess(response))
        } catch (e) {
          dispatch(uploadFileFail({
            status: 403,
            statusText: 'Invalid file'
          }))
        }
      })
      .catch((error) => {
        dispatch(uploadFileFail({
          status: 401,
          statusText: error.message
        }))
      })
  }
}

export function orderData (data) {
  return (dispatch, getState) => {
    let temp = []
    reOrderOffice(data, -1, temp)
    dispatch(reorderDataAction({filteredList: temp}))
  }
}

// Action Creators
export const actions = { getData, getMappingHeader, uploadFile, orderData }

export default handleActions({
  [FETCH_DATA_REQUEST]: (state, { payload }) => {
    return {...state,
      isFetching: true,
      isFetch: false
    }
  },
  [FETCH_DATA_SUCCESS]: (state, { payload }) => {
    return {...state,
      isFetching: false,
      isFetch: true,
      myCollection: payload
    }
  },
  [FETCH_DATA_FAIL]: (state, { payload }) => {
    return {...state,
      isFetching: false,
      statusText: payload.statusText,
      myCollection: null
    }
  },
  [FETCH_HEADER_REQUEST]: (state, { payload }) => {
    return {...state,
      isFetchingHeader: true,
      isFetchHeader: false
    }
  },
  [FETCH_HEADER_SUCCESS]: (state, { payload }) => {
    return {...state,
      isFetchingHeader: false,
      isFetchHeader: true,
      mappingHeader: payload
    }
  },
  [FETCH_HEADER_FAIL]: (state, { payload }) => {
    return {...state,
      isFetchingHeader: false,
      statusText: payload.statusText,
      mappingHeader: null
    }
  },
  [UPLOAD_FILE_REQUEST]: (state, { payload }) => {
    return {...state,
      isUploading: true,
      isUploaded: false
    }
  },
  [UPLOAD_FILE_SUCCESS]: (state, { payload }) => {
    return {...state,
      isUploading: false,
      isUploaded: true,
      myCollection: payload
    }
  },
  [UPLOAD_FILE_FAIL]: (state, { payload }) => {
    return {...state,
      isUploading: false,
      statusText: payload.statusText,
      myCollection: null
    }
  },
  [RE_ORDER_DATA]: (state, { payload }) => {
    return {...state,
      myCollection: payload
    }
  }
}, initialState)
