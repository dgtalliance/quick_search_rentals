import { createSlice } from '@reduxjs/toolkit'
import { fetchAsyncAutoComplete } from '../actions/propertiesAutoComplete'

const initialState = {
  city_data: [],
  loading: false,
  error: {
    status: true,
    code: '',
    message: '',
  },
  errorForm: false,
  params: {
    check_in: '',
    check_out: '',
    keyword: '',
    page: 1,
    extra_day_out: '',
    extra_day_in: '',
    sort: 'avg_price-asc',
  },
}

export const autoCompleteSlice = createSlice({
  name: 'autocomplete',
  initialState,
  reducers: {
    updateClean: (state, { payload }) => {
      state.city_data = payload
    },
    updateForm: (state, { payload }) => {
      state.params = { ...state.params, ...payload }
    },
    updateError: (state, { payload }) => {
      state.errorForm = payload
    },
  },
  extraReducers: {
    [fetchAsyncAutoComplete.pending]: state => {
      state.loading = true
    },
    [fetchAsyncAutoComplete.fulfilled]: (state, actions) => {
      state.loading = false
      if (actions.payload.status) {
        state.city_data = actions.payload.data
      } else {
        state.city_data = []
        state.error = actions.payload
      }
    },
    [fetchAsyncAutoComplete.rejected]: (state, actions) => {
      state.loading = false
      state.city_data = []
      state.error = {
        status: false,
        code: '',
        message: actions.error.message,
      }
    },
  },
})
export const getautocompleteData = state => state.autocomplete.city_data
export const getparams = state => state.autocomplete.params
export const errorForm = state => state.autocomplete.errorForm
export const { updateClean, updateForm, updateError } =
  autoCompleteSlice.actions
export default autoCompleteSlice.reducer
