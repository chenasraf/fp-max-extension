import { render } from 'preact'
import SettingsPage from './pages/Settings'

function OptionsApp() {
  return <SettingsPage mode="options" />
}

render(<OptionsApp />, document.getElementById('root') as HTMLElement)
