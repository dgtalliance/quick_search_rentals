export const closeModalDates = () => {
  jQuery('.js-show-filter-date').click()
}

export const forceClick = () => {
  jQuery(".ib-action.-date[data-show='out']").trigger('click')
}
export const forceClickIn = () => {
  jQuery(".ib-action.-date[data-show='in']").trigger('click')
}

export const initScript = () => {
  jQuery(document).bind('click', function (e) {
    if (jQuery('.ib-wrapper-dropdown.-date').has(e.target).length === 0) {
      jQuery('.ib-guests-search .ib-wrapper-dropdown').removeClass(
        'active-dp in out'
      )
      jQuery('.js-show-filter-date').removeClass('-show')
    }
  })

  jQuery(document).on('click', '.js-show-quick-search-modal', function (e) {
    e.preventDefault()
    jQuery('body').addClass('activeModalquickSearch')
  })

  jQuery(document).on('click', '.js-close-quick-search-modal', function (e) {
    e.preventDefault()
    jQuery('body').removeClass('activeModalquickSearch')
  })

  jQuery(document).on('click', '.js-show-filter-date', function (e) {
    e.preventDefault()

    jQuery('.ib-guests-search .ib-wrapper-dropdown').removeClass('active')
    const activeItem = jQuery(this).attr('data-show')
    const parent = jQuery(this).parents('.ib-wrapper-dropdown')

    jQuery('.js-show-filter-date').removeClass('-show')
    jQuery(this).addClass('-show')

    switch (activeItem) {
      case 'in':
        parent.removeClass('out')
        if (parent.hasClass('in')) {
          parent.removeClass('active-dp in')
          jQuery('.js-show-filter-date').removeClass('-show')
        } else {
          parent.addClass('active-dp in')
          jQuery(this).addClass('-show')
        }
        break

      case 'out':
        parent.removeClass('in')
        if (parent.hasClass('out')) {
          parent.removeClass('active-dp out')
          jQuery('.js-show-filter-date').removeClass('-show')
        } else {
          parent.addClass('active-dp out')
          jQuery(this).addClass('-show')
        }
        break
    }
  })
}

export const closedFilterDropdown = () => {
  const obj = jQuery('.js-show-filter-date')
  jQuery('.ib-guests-search .ib-wrapper-dropdown').removeClass(
    'active-dp in out'
  )
  jQuery('.js-show-filter-date').removeClass('-show')
  const parent = jQuery(obj).parents('.ib-wrapper-dropdown')
  if (parent.hasClass('active')) {
    parent.removeClass('active')
  } else {
    jQuery('.ib-guests-search .ib-wrapper-dropdown').removeClass('active')
    parent.addClass('active')
  }
}

// GENERATOR PARAMS
export const generateSlug = params => {
  let request = ''
  let cont = 0
  for (const prop in params) {
    if (params[prop] !== '') {
      if (cont === 1) {
        if (prop === 'keyword') {
          request += `&${prop}=${encodeURIComponent(params[prop])}`
        } else {
          request += `&${prop}=${params[prop]}`
        }
      } else {
        cont++
        if (prop === 'keyword') {
          request += `${prop}=${encodeURIComponent(params[prop])}`
        } else {
          request += `${prop}=${params[prop]}`
        }
      }
    }
  }
  return request
}
