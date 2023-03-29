import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
const { version } = packageJson

// Convert from Semver (example: 0.1.0-beta6)
const [major, minor, patch, label = '0'] = version
  // can only contain digits, dots, or dash
  .replace(/[^\d.-]+/g, '')
  // split into version parts
  .split(/[.-]/)

const name = 'FP Max'

export default defineManifest(async (env) => ({
  manifest_version: 3,
  name: name + (env.mode === 'staging' ? ' [STG]' : env.mode === 'development' ? ' [DEV]' : ''),
  // up to four numbers separated by dots
  version: `${major}.${minor}.${patch}.${label}`,
  // semver is OK in "version_name"
  version_name: version,
  description: 'Enhance your Floatplane experience',
  permissions: ['storage'],
  action: {
    default_popup: 'popup.html',
  },
  options_page: 'options.html',
  content_scripts: [
    {
      matches: [
        'https://www.floatplane.com/*',
        'https://floatplane.com/*',
        'https://beta.floatplane.com/*',
      ],
      js: ['src/content_script.ts'],
    },
  ],
}))
