import { flexGlobalSettings } from "../utils/constGlobals"

export const ACCESS_TOKEN = flexGlobalSettings.accessToken
export const API_AUTOCOMPLETE_URL = `${flexGlobalSettings.domain_service}/rentals_autocomplete_lookup`
export const API_TRADUCCIONS_URL = `${flexGlobalSettings.overwrite_settings.translateServiceUrl}/api/translation/translations_by_application_and_language`

