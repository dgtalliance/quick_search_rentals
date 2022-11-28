import { Checkbox } from 'antd'
import moment from 'moment/moment'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {
  errorForm,
  getparams,
  updateError,
  updateForm,
} from '../store/slices/propertiesAutoComplete'
import { useTranslation } from 'react-i18next'
import { closedFilterDropdown } from './../utils/utils';

// Get number of days in a month
const getDaysInMonth = (year, month) => {
  return new Date(year, month, 0).getDate()
}

const getFirstDayOfMonth = (year, month) => {
  return new Date(year, month - 1, 1).getDay()
}

const generateDaysAndWeeks = (year, month) => {
  const firstDayOfMonth = getFirstDayOfMonth(year, month)
  const daysInMonth = getDaysInMonth(year, month)

  const weeks = []

  let day = 1
  let week = 0
  let weekDay = 0
  let pastDays = 1

  while (day <= daysInMonth) {
    if (weekDay === 0) {
      weeks[week] = []
    }

    if (pastDays > firstDayOfMonth) weeks[week].push(day)
    else weeks[week].push(null)

    weekDay++
    if (weekDay === 7) {
      weekDay = 0
      week++
    }
    pastDays++

    if (pastDays - 1 > firstDayOfMonth) day++
  }

  return weeks
}

export default function FilterDateSelectByWeek() {
  const { t } = useTranslation()
  const isError = useSelector(errorForm)
  // global vars
  const options = [
    { label: t('Friday'), value: 'fri' },
    { label: t('Saturday'), value: 'sat' },
    { label: t('Sunday'), value: 'sun' },
  ]
  // Store
  const dispatch = useDispatch()
  const params = useSelector(getparams)

  // States vars
  const [numberWeek, setNumberWeek] = useState(1)
  const [daysWeek, setDaysWeek] = useState(['fri', 'sat', 'sun'])
  const [checkindate, setCheckInDate] = useState('--')

  useEffect(() => {
    setNumberWeek(params.number_week === undefined ? 1 : params.number_week)

    if (params.days_week !== '' && params.days_week !== undefined) {
      const temp = params.days_week.split(',')
      setDaysWeek(temp)
    } else {
      setDaysWeek(['fri', 'sat', 'sun'])
    }

    if (params.check_in !== '' && params.check_in !== undefined) {
      setCheckInDate(moment(params.check_in).format('MM-DD-YYYY'))
    } else {
      setCheckInDate('--')
    }
  }, [params])

  function transformDate(datetemp) {
    return datetemp === '--' ? t('Add dates') : moment(datetemp).format('MMM DD')
  }

  const onChangeDayWeekAvaliable = checkedValues => {
    if (checkedValues.length === 0) {
      setDaysWeek(['fri', 'sat', 'sun'])
      onUpdateForm(checkindate, ['fri', 'sat', 'sun'], Number(numberWeek))
    } else {
      setDaysWeek(checkedValues)
      onUpdateForm(checkindate, checkedValues, Number(numberWeek))
    }
  }

  const onChangeCheckInAvaliable = e => {
    setCheckInDate(e.target.value)
    onUpdateForm(e.target.value, daysWeek, Number(numberWeek))
  }

  const onChangeWeekAvaliableMinus = () => {
    if (numberWeek > 1) {
      setNumberWeek(Number(numberWeek) - 1)
      onUpdateForm(checkindate, daysWeek, Number(numberWeek) - 1)
    }
  }
  const onChangeWeekAvaliablePlus = () => {
    if (numberWeek < 20) {
      setNumberWeek(Number(numberWeek) + 1)
      onUpdateForm(checkindate, daysWeek, Number(numberWeek) + 1)
    }
  }
  const onSearch = () => {
    let params = {}
    if (checkindate !== '--') {
      const checkOut = moment(new Date(checkindate))
        .add(numberWeek * 7, 'day')
        .format('YYYY-MM-DD')
      const checkIn = moment(new Date(checkindate)).format('YYYY-MM-DD')
      console.log(daysWeek.toString(), checkIn, checkOut, numberWeek)

      params = {
        check_in: checkIn,
        check_out: checkOut,
        days_week: daysWeek.toString(),
        number_week: numberWeek,
        page: 1,
      }
      dispatch(updateError(false))
    } else {
      dispatch(updateError(true))
      params = {
        check_in: '',
        check_out: '',
        days_week: daysWeek.toString(),
        number_week: numberWeek,
        page: 1,
      }
    }
    dispatch(updateForm(params))
    closedFilterDropdown()
  }
  const onUpdateForm = (checkindateD, daysWeekD, numberWeekD) => {
    let params = {}
    if (checkindateD !== '--') {
      const checkOut = moment(new Date(checkindateD))
        .add(numberWeekD * 7, 'day')
        .format('YYYY-MM-DD')
      const checkIn = moment(new Date(checkindateD)).format('YYYY-MM-DD')
      console.log(daysWeekD.join(','), checkIn, checkOut, numberWeekD)

      params = {
        check_in: checkIn,
        check_out: checkOut,
        days_week: daysWeekD.join(','),
        number_week: numberWeekD,
        page: 1,
      }
      dispatch(updateError(false))
    } else {
      params = {
        check_in: '',
        check_out: '',
        days_week: daysWeekD.join(','),
        number_week: numberWeekD,
        page: 1,
      }
    }
    dispatch(updateForm(params))
  }
  const cleanForm = () => {
    const daysWeek = ['fri', 'sat', 'sun']
    setDaysWeek(daysWeek)
    setNumberWeek(1)
    setCheckInDate('--')
    const params = {
      check_in: '',
      check_out: '',
      days_week: daysWeek.toString(),
      number_week: 1,
      page: 1,
    }
    dispatch(updateForm(params))
  }

  const extractDaysBetweenDates = (startDate, endDate) => {
    const now = startDate
    const dates = []
    let count = 0
    while (now.isSameOrBefore(endDate)) {
      if (count === 0) {
        dates.push(now.format('M/YYYY'))
      } else {
        dates.push('-' + now.format('M/YYYY'))
      }
      now.add(1, 'month')
      count++
    }

    const resultsDates = dates.toString().split('-')
    const arrayDatesObj = []

    resultsDates.forEach(items => {
      const date = items.split('/')
      const obj = {
        month: Number(date[0] - 1),
        year: date[1].replace(',', ''),
      }

      arrayDatesObj.push(obj)
    })

    return arrayDatesObj
  }

  const groupDates = () => {
    const weeks = []
    const fromDate = moment()
    const toDate = moment().add(11, 'months')
    const results = extractDaysBetweenDates(fromDate, toDate)

    results.forEach(itemsMonth => {
      const temp = generateDaysAndWeeks(itemsMonth.year, itemsMonth.month + 1)

      const month = itemsMonth.month + 1
      temp.forEach(days => {
        if (days[5] !== null && days[5] !== undefined) {
          const dateConvert = month + '-' + days[5] + '-' + itemsMonth.year
          const dateValueConert = month + '-' + days[5] + '-' + itemsMonth.year
          const dateForSelect = {
            label: moment(new Date(dateConvert)).format('MMMM D, YYYY'),
            value: moment(new Date(dateValueConert)).format('MM-DD-YYYY'),
          }
          weeks.push(dateForSelect)
        }
      })
    })
    return weeks
  }

  return (
    <div className='ib-wrapper-dropdown -date -delete-active'>
      <div className='ib-item'>
        <button
          className={
            isError
              ? 'ib-action js-show-filter-date -date error'
              : 'ib-action js-show-filter-date -date'
          }
          data-show='in'
        >
          <span id='text-check-in' data-text='Check in'>
            {t('Check In')}
          </span>
          <div className='ib-min-text'>
            <span className='-date'> {transformDate(checkindate)}</span>
          </div>
        </button>
        {checkindate !== '--' && (
          <button className='ib-close-btn' onClick={cleanForm}>
            Close
          </button>
        )}
      </div>
      <div className='ib-dropdown -modal-date'>
        <div className='ib-wrapper'>
          <div className='ib-flex-wrapper'>
            <div className='ib-flex'>
              <span className='ib-labe-text'>{t('Check-In Date')}</span>
              <select
                name='checkindate'
                id='checkindate'
                className='ib-ms-select'
                value={checkindate}
                onChange={onChangeCheckInAvaliable}
              >
                <option value='--'>{t('Starting Day')}</option>
                {groupDates().map((items, index) => (
                  <option key={index} value={items.value}>
                    {items.label}
                  </option>
                ))}
              </select>
            </div>

            <div className='ib-flex'>
              <span className='ib-labe-text'>{t('Check-In Day')}</span>
              <div className='ib-flex ib-chkList'>
                <Checkbox.Group
                  options={options}
                  value={daysWeek}
                  defaultValue={['fri', 'sat', 'sun']}
                  onChange={onChangeDayWeekAvaliable}
                />
              </div>
            </div>

            <div className='ib-flex'>
              <span className='ib-label'>{t('Number of Weeks')}</span>
              <div className='ib-spinner'>
                <button
                  className='ib-down ib-btn-spiner'
                  data-parent='text-sleeps'
                  onClick={() => onChangeWeekAvaliableMinus()}
                >
                  -
                </button>
                <input
                  type='number'
                  min='1'
                  max='20'
                  value={numberWeek}
                  id='numberWeek'
                  disabled
                />
                <button
                  className='ib-up ib-btn-spiner'
                  data-parent='text-sleeps'
                  onClick={() => onChangeWeekAvaliablePlus()}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className='ib-modal-footer'>
          <button
            className='ib-btn js-submit-filter js-submit-filter-date'
            onClick={onSearch}
          >
            {t('Done')}
          </button>
        </div>
      </div>
    </div>
  )
}
