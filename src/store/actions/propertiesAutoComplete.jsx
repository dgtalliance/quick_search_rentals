import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { ACCESS_TOKEN, API_AUTOCOMPLETE_URL } from '../../config/config'

const defaultPropsShortCode = {
  board_id: String(
    document
      .getElementById('ib-wrapper-quick-search-rentals')
      .getAttribute('data-boardid')
  ),
}

export const boardId = defaultPropsShortCode.board_id

export const fetchAsyncAutoComplete = createAsyncThunk(
  'properties/fetchAsyncAutoComplete',
  async arg => {
    try {
      let url = `&board_id=${boardId}`

      if (arg.term !== '' && arg.term !== undefined) {
        url += `&search=${arg.term}`
      }
      const body = `access_token=${ACCESS_TOKEN}${url}`
      const response = await axios.post(API_AUTOCOMPLETE_URL, body)
      if (response.data.length !== 0) {
        return {
          data: response.data,
          status: true,
        }
      } else {
        return {
          message: 'No Data',
          code: 200,
          status: false,
        }
      }
    } catch (error) {
      return {
        message: error.response.data,
        code: error.response.status,
        status: false,
      }
    }
  }
)
