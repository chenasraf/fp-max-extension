# FP Max Extension

This is a tiny extension for quality-of-life improvements while browsing floatplane.com.

Current features:

- Remember last played position
- Show video progress on thumbnails
- Timestamp links in comments

🔐 I try to make this extension secure and private, there is no tracking code anywhere. Trusting me
is nice, but if you don't that's a smart move - build this extension yourself: it is open source,
and available for peer review or forks.

🕷 Post issues/bugs, questions or feature requests at this link:
<https://github.com/chenasraf/fp-max-extension/issues>

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

To avoid the Chrome Web Store, you can install directly from zip in developer mode. See our
[Releases](https://github.com/chenasraf/fp-max-extension/releases/latest) page for the download
link.

- Download the latest release zip
- Extract the zip
  > make sure it is 1 folder containing other files, not all the files directly, and not nested
  > directories
- Drag the directory into your browser's extensions page.
  > Note you must have developer mode enabled on your browser for this to work

## Development

To develop new features or if you don't trust the extension on the Chrome Web Store or provided zip,
you should be able build this extension yourself.

### Requirements

- Needs Node.js installed

### Installation

- Clone this repository
- Run `pnpm install`
- Run `pnpm run build` to build the output to the `dist/` folder
- Drag the `dist/` folder to your browser's extensions page.
  > Note you must have developer mode enabled on your browser for this to work
- You should be good to go

### Contributions

I am developing this package on my free time, so **any support**, whether code, issues, or just
stars is **very helpful** to sustaining its life. If you are feeling incredibly generous and would
like to donate just a small amount to help sustain this project, **I would be very very thankful!**

<a href='https://ko-fi.com/casraf' target='_blank'>
  <img height='36' style='border:0px;height:36px;'
    src='https://cdn.ko-fi.com/cdn/kofi1.png?v=3'
    alt='Buy Me a Coffee at ko-fi.com' />
</a>

I welcome any issues or pull requests on GitHub. If you find a bug, or would like a new feature,
don't hesitate to open an appropriate issue and I will do my best to reply promptly.

If you are a developer and want to contribute code, here are some starting tips:

1. Fork this repository
2. Run `pnpm install`
3. Run `pnpm dev` to build dist folder
4. Install the dist folder using the instruction earlier in the readme
5. Make any changes you would like
6. Update the relevant documentation (readme, code comments, type comments)
7. Create a PR on upstream
