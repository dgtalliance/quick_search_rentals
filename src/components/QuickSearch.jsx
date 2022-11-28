import { generateSlug, initScript } from '../utils/utils'
import Complete from './AutoCompete'
import { useDispatch, useSelector } from 'react-redux'
import {
  getparams,
  updateError,
  updateForm,
} from '../store/slices/propertiesAutoComplete'
import { fetchAsyncAutoComplete } from '../store/actions/propertiesAutoComplete'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import FilterDateSelectByWeek from './FilterDateSelectByWeek';

initScript()
const { VITE_APP_ENV } = import.meta.env

const QuickSearch = () => {
  const { t } = useTranslation()

  const dispatch = useDispatch()
  const params = useSelector(getparams)

  useEffect(() => {}, [params])

  const searchReset = () => {
    const params = {
      keyword: '',
      check_in: '',
      check_out: '',
      page: 1,
      extra_day_out: '',
      extra_day_in: '',
    }
    dispatch(updateForm(params))
    dispatch(fetchAsyncAutoComplete({ term: '' }))
  }

  const quickSearchTerms = e => {
    e.preventDefault()
    const urls = '/vacation-rentals/?'
    const paramsUrl = generateSlug(params)
    const hostName =
      VITE_APP_ENV === 'dev' ? 'http://localhost:3001' : window.location.origin

    const linkToOpen = hostName + urls + paramsUrl

    if (
      params.keyword !== '' ||
      (params.check_in !== '' && params.check_out !== '')
    ) {
      window.open(linkToOpen)
    } else {
      dispatch(updateError(true))
    }
  }

  return (
    <>
      {/* <!--AQUI INICIA EL SHORTCODE --> */}
      <div id='ib-wrapper-quick-search'>
        <div className='ib-modal-quick-search'>
          <div className='ib-wrapper-modal'>
            <div className='ib-header-modal'>
              <div className='ib-title'>{t('Quick Search')}</div>
              <button
                className='ib-close-modal js-close-quick-search-modal'
                aria-label='Close modal'
              ></button>
            </div>

            <div className='ib-body-modal -bottom'>
              {/*  <!--TODO ESTO VIENE DE RENTALS--> */}
              <div className='ib-guests-search'>
                <div className='ib-wrapper-item -default'>
                  <div className='ib-wrapper-dropdown -search'>
                    <div className='ib-action -search js-show-basic-filter'>
                      {/* AutoComplete */}
                      <Complete />
                    </div>
                  </div>

                  {/* FilterPickerDate */}
                  <FilterDateSelectByWeek />
                </div>
              </div>
              {/*  <!--TODO ESTO VIENE DE RENTALS--> */}

              <button
                className='js-show-quick-search-modal ms-btn-show-modal-qs'
                aria-label='Show modal quick search'
              ></button>
            </div>

            <div className='ib-footer-modal'>
              <a className='ib-link' onClick={searchReset}>
                {t('Clear')}
              </a>
              <button
                type='button'
                className='ib-btn js-submit-filter'
                onClick={quickSearchTerms}
              >
                {t('Search')}
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* <!--AQUI FINALIZA EL SHORTCODE --> */}
    </>
  )
}

export default QuickSearch
