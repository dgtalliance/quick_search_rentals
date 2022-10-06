import QuickSearch from "./components/QuickSearch";
import "./assets/fonts/icons/style.css"
import "./assets/reset/index.css"
import "./assets/shortcode/_index.css"
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { fetchAsyncAutoComplete } from "./store/actions/propertiesAutoComplete";


function App() {
  const dispatch = useDispatch()
  useEffect(() => {
    dispatch(fetchAsyncAutoComplete({ term: '' }))
  },[])

  return <QuickSearch/>
}

export default App
