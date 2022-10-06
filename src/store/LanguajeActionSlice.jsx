import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

const API_AUTOCOMPLETE_URL =
  'http://127.0.0.1:8000/api/translation/translations_by_application/1'
export const fetchAsyncLanguages = createAsyncThunk(
  'properties/fetchAsyncLanguages',
  async arg => {
    try {
      const response = await axios.get(API_AUTOCOMPLETE_URL)
      return {
        data: response.data,
        status: true,
      }
    } catch (error) {
      return {
        message: 'Error',
        code: 400,
        status: false,
      }
    }
  }
)

const initialState = {
  languages: {},
}
export const languagesSlice = createSlice({
  name: 'language',
  initialState,
  reducers: {},
  extraReducers: {
    [fetchAsyncLanguages.pending]: state => {},
    [fetchAsyncLanguages.fulfilled]: (state, actions) => {
      console.log(actions.payload.data)
      state.languages = actions.payload.data
    },
    [fetchAsyncLanguages.rejected]: (state, actions) => {},
  },
})
export const getlanguages = state => state.language.languages
export default languagesSlice.reducer
