import { configureStore } from '@reduxjs/toolkit'
// reducers
import autocomplete from '../store/slices/propertiesAutoComplete'

export const store = configureStore({
  reducer: {
    autocomplete,
  },
})
