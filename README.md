# FP Max Extension

This is a tiny extension for quality-of-life improvements while browsing floatplane.com.

Current features:

- Remember last played position
- Timestamp links in comments

🔐 This extension is secure and private. Trusting me is nice, but if you don't that's a smart move -
build this extension yourself: the extension is open source, and available for peer review or forks.

🕷 Post issues/bugs, questions or feature requests at this link:
https://github.com/chenasraf/fp-max-extension/issues

👨‍⚖️ This extension is not affiliated with Floatplane, LMG or LTT in any capacity. Use it at your own
risk, and if something breaks, complain to me and not to the LMG staff. If you are from
LMG/Floatplane and would like me to take this down, please contact me.

## Installation

### Install through Chrome Web Store

The easiest way to install is using the
[Chrome Web Store](https://chrome.google.com/webstore/detail/fp-max/bpneojingmonahfcbnojghpnnllngamc?hl=en&authuser=0)
link.

This extension should work on all Chromium-based browsers:

- Chrome
- Chromium
- Brave
- Arc
- Edge
- Others

### Direct installation

While Chrome Web Store version is not yet available, you can install directly. See our
[Releases](https://github.com/chenasraf/fp-max-extension/releases/latest) page.

- Download the latest release zip
- Extract the zip - make sure it is 1 folder containing other files, not all the files directly, and
  not nested directories
- Drag the directory into your browser's extensions page. Note you must have developer mode enabled
  on your browser for this to work

## Development

To develop new features or if you don't trust the extension on the Chrome Web Store or provided zip,
you should be able build this extension yourself.

### Requirements

- Needs Node.js installed

### Installation

- Clone this repository
- Run `npm install` (or `yarn install`)
- Run `npm run build` (or `yarn build`) to build the output to the `dist/` folder
- Drag the `dist/` folder to your browser's extensions page. Note you must have developer mode
  enabled on your browser for this to work
- You should be good to go

### Contributions

I welcome all PRs, ideas, bug reports or other questions or feedback.

Use the [Issues feature](https://github.com/chenasraf/fp-max-extension) to submit your own.
