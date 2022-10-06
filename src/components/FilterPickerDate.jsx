import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { DateRangePicker } from 'react-date-range'
import { addDays, getTime } from 'date-fns'
import { useDispatch, useSelector } from 'react-redux'
import { useRef, useState, useEffect } from 'react'
import { Radio } from 'antd'
import { forceClick, forceClickIn } from '../utils/utils'
import {
  errorForm,
  getparams,
  updateError,
  updateForm,
} from '../store/slices/propertiesAutoComplete'
import moment from 'moment'
import { useTranslation } from "react-i18next";

const FilterPickerDate = () => {
  const { t } = useTranslation();

  // Constants
  const options = [
    { label: t('exact_date'), value: 0 },
    { label: '± 1 '+t('days'), value: 1 },
    { label: '± 2 '+t('days'), value: 2 },
    { label: '± 3 '+t('days'), value: 3 },
    { label: '± 7 '+t('days'), value: 7 },
  ]

  // Stores
  const dispatch = useDispatch()
  const params = useSelector(getparams)
  const isError = useSelector(errorForm)
  // States
  const [checkIn, setCheckIn] = useState('')
  const [checkOut, setChekOut] = useState('')
  const [extraDaysIn, setExtraDaysIn] = useState(0)
  const [extraDaysOut, setExtraDaysOut] = useState(0)
  const [state, setState] = useState([
    {
      startDate: new Date(),
      endDate: new Date(),
      key: 'selection',
    },
  ])

  // Refs
  const intOutSelection = useRef('in')
  const dateInSelection = useRef([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ])

  const dateOutSelection = useRef([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: 'selection',
    },
  ])

  useEffect(() => {
    setCheckIn(params.check_in === '' ? '' : params.check_in)
    setChekOut(params.check_out === '' ? '' : params.check_out)
    setExtraDaysIn(params.extra_day_in === '' ? 0 : params.extra_day_in)
    setExtraDaysOut(params.extra_day_out === '' ? 0 : params.extra_day_out)
    console.log()
    setState([
      {
        startDate:
          params.check_in === ''
            ? new Date()
            : addDays(new Date(params.check_in), 1),
        endDate:
          params.check_out === ''
            ? new Date()
            : addDays(new Date(params.check_out), 1),
        key: 'selection',
      },
    ])
  }, [params])

  const searchReset = () => {
    const params = {
      check_in: '',
      check_out: '',
      page: 1,
      extra_day_out: '',
      extra_day_in: '',
    }
    dispatch(updateForm(params))
  }

  function transformDate(fecha) {
    return fecha === '' ? t('add_dates') : moment(fecha).format('MMM DD')
  }

  const cleanDateAll = e => {
    e.preventDefault()
    setCheckIn('')
    setChekOut('')
    setExtraDaysIn(0)
    setExtraDaysOut(0)

    setState([
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ])

    dateInSelection.current = [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]
    dateOutSelection.current = [
      {
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection',
      },
    ]

    if (intOutSelection.current !== 'in') {
      intOutSelection.current = 'in'
      forceClickIn()
    }

    searchReset()
  }

  const handleSelectDateRangePicker = item => {
    if (intOutSelection.current === 'in') {
      const inDateIn = getTime(new Date(item.selection.startDate))
      const outDateOut = getTime(new Date(item.selection.endDate))

      const inDateTemp = getTime(new Date(dateInSelection.current[0].startDate))

      if (inDateIn === outDateOut) {
        dateInSelection.current = [
          {
            startDate: item.selection.startDate,
            endDate: item.selection.startDate,
            key: 'selection',
          },
        ]
      } else {
        if (inDateTemp > inDateIn) {
          dateInSelection.current = [
            {
              startDate: item.selection.startDate,
              endDate: item.selection.startDate,
              key: 'selection',
            },
          ]
        } else if (inDateTemp < outDateOut) {
          dateInSelection.current = [
            {
              startDate: item.selection.endDate,
              endDate: item.selection.endDate,
              key: 'selection',
            },
          ]
        }
      }

      intOutSelection.current = 'out'
      forceClick()
      setState([dateInSelection.current[0]])
      setCheckIn(dateInSelection.current[0].startDate)
      setChekOut('')
    } else if (intOutSelection.current === 'out') {
      dateOutSelection.current = [
        {
          startDate: dateInSelection.current[0].startDate,
          endDate: item.selection.endDate,
          key: 'selection',
        },
      ]

      const outDateOut = getTime(new Date(item.selection.endDate))
      const inDateOut = getTime(new Date(dateInSelection.current[0].startDate))

      if (inDateOut < outDateOut) {
        setState([dateOutSelection.current[0]])
        setCheckIn(dateOutSelection.current[0].startDate)
        setChekOut(dateOutSelection.current[0].endDate)
      } else {
        dateInSelection.current = [
          {
            startDate: item.selection.startDate,
            endDate: item.selection.startDate,
            key: 'selection',
          },
        ]

        setState([dateInSelection.current[0]])
        setCheckIn(dateInSelection.current[0].startDate)
        setChekOut('')
      }
      updateDates(
        dateOutSelection.current[0].startDate,
        dateOutSelection.current[0].endDate
      )
    }
  }

  function changeExtraDay(e, type) {
    const value = e.target.value
    setExtraDaysIn(value)
    setExtraDaysOut(value)
    const params = {
      extra_day_out: value === 0 ? '' : value,
      extra_day_in: value === 0 ? '' : value,
    }
    dispatch(updateForm(params))
  }

  const updateDates = (checkIn, checkOut) => {
    const inD =
      checkIn === '' ? '' : moment(new Date(checkIn)).format('YYYY-MM-DD')
    const outD =
      checkOut === '' ? '' : moment(new Date(checkOut)).format('YYYY-MM-DD')

    const params = {
      check_in: inD,
      check_out: outD,
    }
    dispatch(updateForm(params))
    dispatch(updateError(false))
  }

  return (
    <div className='ib-wrapper-dropdown -date'>
      <div className='ib-item'>
        <button
          className={
            isError
              ? 'ib-action js-show-filter-date -date error'
              : 'ib-action js-show-filter-date -date'
          }
          data-show='in'
          onClick={() => (intOutSelection.current = 'in')}
        >
          <span id='text-check-in' data-text='Check in'>
            {t('check_in')}
          </span>
          <div className='ib-min-text'>
            <span className='-date'> {transformDate(checkIn)}</span>
            <span className='-days'>
              {parseInt(extraDaysIn) !== 0 && extraDaysIn != null
                ? ' ±' + extraDaysIn
                : ''}
            </span>
          </div>
        </button>
        {checkIn !== '' && (
          <button className='ib-close-btn' onClick={e => cleanDateAll(e)}>
            Close
          </button>
        )}
      </div>
      <div className='ib-item'>
        <button
          className={
            isError
              ? 'ib-action js-show-filter-date -date error'
              : 'ib-action js-show-filter-date -date'
          }
          data-show='out'
          onClick={() => (intOutSelection.current = 'out')}
        >
          <span id='text-check-out' data-text='Check out'>
          {t('check_out')}
          </span>
          <div className='ib-min-text'>
            <span className='-date'> {transformDate(checkOut)}</span>
            <span className='-days'>
              {parseInt(extraDaysOut) !== 0 && extraDaysOut != null
                ? ' ±' + extraDaysOut
                : ''}{' '}
            </span>
          </div>
        </button>
        {checkOut !== '' && (
          <button className='ib-close-btn' onClick={e => cleanDateAll(e)}>
            Close
          </button>
        )}
      </div>
      <div
        className={
          isError
            ? 'ib-dropdown -modal-date error'
            : 'ib-dropdown -modal-date'
        }
        style={{ width: '710px', right: '-600px' }}
      >
        <div className='ib-wrapper'>
          <div className='ib-flex-wrapper'>
            <div className='ib-flex-item -full'>
              <span className='ib-label'>Check in</span>
              <DateRangePicker
                rangeColors={['#333']}
                onChange={handleSelectDateRangePicker}
                showSelectionPreview={true}
                minDate={addDays(new Date(), -0)}
                months={2}
                ranges={state}
                direction='horizontal'
                preventSnapRefocus={true}
                moveRangeOnFirstSelection={false}
                retainEndDateOnFirstSelection={false}
              />
            </div>
          </div>
          <div style={{ display: 'flex' }}>
            <div className='ib-flex-wrapper -border-top'>
              <div className='ib-chk-list'>
                <Radio.Group
                  options={options}
                  onChange={event => changeExtraDay(event, 'in')}
                  value={extraDaysIn}
                  optionType='button'
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterPickerDate
