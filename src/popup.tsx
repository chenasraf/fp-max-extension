import { render } from 'preact'
import SettingsPage from './pages/Settings'

function PopupApp() {
  return <SettingsPage mode="popup" />
}

render(<PopupApp />, document.getElementById('root') as HTMLElement)
