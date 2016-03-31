import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'

// Constants
// export const constants = { }
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
export const FETCH_DATA_FAIL = 'FETCH_DATA_FAIL'
export const UPLOAD_FILE_REQUEST = 'UPLOAD_FILE_REQUEST'
export const UPLOAD_FILE_SUCCESS = 'UPLOAD_FILE_SUCCESS'
export const UPLOAD_FILE_FAIL = 'UPLOAD_FILE_FAIL'
export const RE_ORDER_DATA = 'RE_ORDER_DATA'

export const getDataRequest = createAction(FETCH_DATA_REQUEST, (data) => data)
export const getDataSuccess = createAction(FETCH_DATA_SUCCESS, (data) => data)
export const getDataFail = createAction(FETCH_DATA_FAIL, (data) => data)

export const uploadFileRequest = createAction(UPLOAD_FILE_REQUEST, (data) => data)
export const uploadFileSuccess = createAction(UPLOAD_FILE_SUCCESS, (data) => data)
export const uploadFileFail = createAction(UPLOAD_FILE_FAIL, (data) => data)

export const reorderDataAction = createAction(RE_ORDER_DATA, (data) => data)

const initialState = Immutable.fromJS({
  myCollection: null,
  isFetch: false,
  isFetching: false,
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

let API_URL = 'http://localhost:59284/'
export function getData () {
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
export const actions = { getData, uploadFile, orderData }

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
