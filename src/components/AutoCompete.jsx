import { memo, useEffect, useState } from 'react'
import 'antd/dist/antd.css'
import { Input, AutoComplete } from 'antd'
import { useDispatch, useSelector } from 'react-redux'

import {
  getautocompleteData,
  updateClean,
  getparams,
  updateForm,
  errorForm,
  updateError,
} from '../store/slices/propertiesAutoComplete'

import { fetchAsyncAutoComplete } from '../store/actions/propertiesAutoComplete'

import { useTranslation } from "react-i18next";

const Complete = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation();

  const autocompleteData = useSelector(getautocompleteData)
  const params = useSelector(getparams)
  const isError = useSelector(errorForm)

  const [keyword, setKeyword] = useState('')
  const [ibAutocompleteCities, setIbAutoCompleteCities] = useState([])

  useEffect(() => {
    setIbAutoCompleteCities(autocompleteData.items)
  }, [autocompleteData])

  useEffect(() => {
    if (params.keyword !== '') {
      let temptext = params.keyword.split('_')
      temptext = temptext[0].replaceAll('-', ' ')
      setKeyword(temptext)
    } else {
      setKeyword('')
    }
  }, [params])

  const setAutocompleteTerm = (term, type) => {
    const param = {
      keyword: `${term.replaceAll(' ', '-') + '_' + type.toLowerCase()}`,
    }
    dispatch(updateForm(param))
    dispatch(updateError(false))
  }

  const handleKeyUpAutocompleteEvent = inputValue => {
    setKeyword(inputValue)
  }
  const handleSelectAutocomplete = value => {
    const tempterm = JSON.parse(value)
    setKeyword(tempterm.label)
    setAutocompleteTerm(tempterm.label, tempterm.type)
  }
  const handleClearAutocompleteEvent = () => {
    setKeyword('')

    if (params.keyword !== '') {
      const param = {
        keyword: '',
        page: '1',
      }
      dispatch(updateForm(param))
      dispatch(fetchAsyncAutoComplete({ term: '' }))
    }
  }
  const handleSubmitAutocompleteForm = e => {
    e.preventDefault()
    setKeyword(e.target.value)
    const inputValue = e.target.value

    if (inputValue !== '') {
      // Cerrar autocomplete
      if (/^\d+$/.test(inputValue) && inputValue.length === 5) {
        setAutocompleteTerm(inputValue, 'zip')
      } else {
        let matchCity

        for (let i = 0, l = ibAutocompleteCities.length; i < l; i++) {
          const term = ibAutocompleteCities[i]
          const match = new RegExp('^' + term.label + '$', 'i')

          if (match.test(inputValue) !== false) {
            matchCity = term
            break
          }
        }

        if (typeof matchCity !== 'undefined') {
          setAutocompleteTerm(matchCity.label, 'city')
        } else {
          setAutocompleteTerm(inputValue, null)
        }
      }
    }
  }

  const capitalizarPrimeraLetra = str => {
    return str.charAt(0).toUpperCase() + str.slice(1)
  }

  const renderLabel = item => {
    const label = item.label
    const searchString = keyword

    if (searchString) {
      const index = label.toLowerCase().indexOf(searchString.toLowerCase())
      if (index !== -1) {
        const length = searchString.length

        const prefix = label.substring(0, index)
        const suffix = label.substring(index + length)
        const match = label.substring(index, index + length)

        return (
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}
          >
            <span>
              {prefix}
              <span className='searchString'>{match}</span>
              {suffix}
            </span>
            <span>
              <strong>{capitalizarPrimeraLetra(item.type)}</strong>
            </span>
          </div>
        )
      }
    }

    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}
      >
        <span>{label}</span>
        <span>
          <strong>{capitalizarPrimeraLetra(item.type)}</strong>
        </span>
      </div>
    )
  }

  const fillOptions = options => {
    const data = []
    if (Array.isArray(options)) {
      options.forEach((item, index) => {
        data.push({
          label: renderLabel({ label: item.value, type: item.type_value }),
          value: JSON.stringify({ label: item.value, type: item.type_value }),
          keyi: index,
        })
      })
    }
    return data
  }

  useEffect(() => {
    // eslint-disable-next-line no-undef
    jQuery(document).ready(function () {
      let debounce

      // eslint-disable-next-line no-undef
      jQuery('#autocumple_search').on('keydown', function (e) {
        // get keycode of current keypress event
        const code = e.keyCode || e.which

        // do nothing if it's an arrow key or enter
        if (
          code === 37 ||
          code === 38 ||
          code === 39 ||
          code === 40 ||
          code === 13
        ) {
          return false
        }

        // do normal behavior for any other key
        clearTimeout(debounce)
        debounce = setTimeout(() => {
          const inputValue = e.target.value
          if (inputValue !== '') {
            dispatch(fetchAsyncAutoComplete({ term: inputValue }))
          } else {
            dispatch(updateClean([]))

            const param = {
              keyword: '',
              page: '1',
            }
            dispatch(updateForm(param))
            dispatch(fetchAsyncAutoComplete({ term: '' }))
          }
        }, 400)
      })
    })
  }, [])

  return (
    <AutoComplete
      id='autocumple_search'
      allowClear
      onSearch={handleKeyUpAutocompleteEvent}
      onSelect={handleSelectAutocomplete}
      onClear={handleClearAutocompleteEvent}
      value={keyword}
      popupClassName='certain-category-search-dropdown'
      options={fillOptions(ibAutocompleteCities)}
    >
      <Input
        className={isError ? 'error' : ''}
        value={keyword}
        size='large'
        placeholder={t('enter_address_city_zip_or_mls')}
        onKeyPress={e => {
          setKeyword(e.target.value)
        }}
        onPressEnter={handleSubmitAutocompleteForm}
      />
    </AutoComplete>
  )
}
export default memo(Complete)
