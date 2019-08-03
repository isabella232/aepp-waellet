# Waellet

<p align="center">
<img
    src="https://waellet.com/images/waellet_transparent.png"
    width="500px">
</p>

[![CircleCI](https://circleci.com/gh/aeternity/aepp-waellet/tree/master.svg?style=svg)](https://circleci.com/gh/aeternity/aepp-waellet/tree/master)
[![GitHub version](https://badge.fury.io/gh/aeternity%2Faepp-waellet.svg)](https://badge.fury.io/gh/aeternity%2Faepp-waellet)
<a href="https://github.com/aeternity/aepp-waellet">
  <img src="https://tokei.rs/b1/github/aeternity/aepp-waellet?category=lines" alt="Current total lines.">
</a>
<a href="https://github.com/aeternity/aepp-waellet/blob/master/LICENSE">
  <img src="https://img.shields.io/badge/license-ISC-blue.svg" alt="License.">
</a>
<a href="https://github.com/aeternity/aepp-waellet/blob/master/LICENSE">
  <img src="https://img.shields.io/badge/aeternity-aepp-%23F22F70.svg" alt="Aeternity aepp">
</a>

**Waellet is a browser extension that allows you to interact with Aeternity blockchain in your browser.**

We see Waellet as user’s first choice wallet when it comes to interacting with dApps hosted on different blockchains. Build around aeternity, Waellet is to become a tool that enables users to pay for different services without the need to worry about the network of the particular dApp – this will happen in a decentralized and cryptographic secure way through integration with the WeiDex – decentralized exchange.

Currently, Waellet is still in beta and under heavy development. Last week we on-boarded three more people to work along with Milen, pushing to bring you our best vision of the wallet as soon as possible.

## Download 
- [Chrome Web Extensions Store](https://chrome.google.com/webstore/detail/waellet/nnkfipoloblhgnahnaocfkhmmplcdneb)
- [Firefox Add-on](https://addons.mozilla.org/en-US/firefox/addon/waellet/)

or see instructions below how to build it from source.


## Build

Clone the master branch of this repo.

```
$ git clone https://github.com/waellet/waellet.git
$ cd waellet
```

### Build locally

```
$ npm install
$ npm run build
```

### Develop locally

```
$ npm install
$ npm run watch:dev
```

### Running tests

```
$ npm install
$ npm run test
```

### Adding to browser via local build

- Chromium based (Chrome, Brave, Opera)

1. Open chrome/brave browser `Preferences -> More tools > Extensions`
2. Make sure `Developer mode` is `On` in the right corner.
3. Click `Load unpacked` button and select the generated `dist` folder in the cloned repo.

- Firefox

1. Open the Firefox menu and select `Add-ons` section.
2. Click the `Tools for  all add-ons` button and select `Debug Add-ons`
3. Click `Load a temorary add-on` navigate to the generated `dist` folder in the cloned repo and select the `manifest.json` file.

## Security
If you discover a security vulnerability within this application, please send an e-mail to hello@waellet.com. All security vulnerabilities will be promptly addressed.

## Contribution

Contributions are more than welcome.

If you spot an issue while testing/using the waellet - [submit an issue](https://github.com/aeternity/aepp-waellet/issues)

If you want to help us with building this amazing project submit your PR!
