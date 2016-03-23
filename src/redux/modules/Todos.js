import { createAction, handleActions } from 'redux-actions'
import Immutable from 'immutable'
import fetch from 'isomorphic-fetch'

// Constants
// export const constants = { }
export const FETCH_DATA_REQUEST = 'FETCH_DATA_REQUEST'
export const FETCH_DATA_SUCCESS = 'FETCH_DATA_SUCCESS'
export const FETCH_DATA_FAIL = 'FETCH_DATA_FAIL'

export const getDataRequest = createAction(FETCH_DATA_REQUEST, (data) => data)
export const getDataSuccess = createAction(FETCH_DATA_SUCCESS, (data) => data)
export const getDataFail = createAction(FETCH_DATA_FAIL, (data) => data)

const initialState = Immutable.fromJS({
  myCollection: null,
  isFetch: false,
  isFetching: false,
  statusText: null
})

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
  console.log('parsing')
  return response.json()
}

let API_URL = 'http://localhost:59284/'
export function getData () {
  return (dispatch, getState) => {
    dispatch(getDataRequest())
    return fetch(API_URL + 'Home/GetData', {
      method: 'get',
      headers: {
        'Accept': 'application/json, application/xml, text/plain, text/html, *.*',
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
      },
      mode: 'cors'
    }).then(checkHttpStatus)
      .then(parseJSON)
      .then((response) => {
        try {
          console.log(response)
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

// Action Creators
export const actions = { getData }

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
      statusText: payload.statusText
    }
  }
}, initialState)
