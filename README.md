# NuCypher Staker [![Build Status](https://travis-ci.com/cryptoseal86/stake-nucypher.svg?branch=master)](https://travis-ci.com/cryptoseal86/stake-nucypher) [![Coverage Status](https://coveralls.io/repos/github/cryptoseal86/stake-nucypher/badge.svg?branch=master&source=github)](https://coveralls.io/github/cryptoseal86/stake-nucypher?branch=master)

## Features

  - [x] Show list of Stakes
  - [x] Create new stake
  - [x] Set worker
  - [x] Detach worker
  - [x] Change restaking
  - [X] Winding down stake
  - [X] Withdrawal inflation rewards (NU) and policy rewards (ETH)
  - [X] Divide stake
  - [X] Prolong stake
  - [X] Participating in WorkLock event
  - [X] Claiming ETH locked in WorkLock event
  - [ ] Increase tests coverage to at least 90%

## How to run standalone verion
1. go to working folder in your console
2. run
```bash
git clone https://github.com/cryptoseal86/stake-nucypher.git
```
3. run
```bash
cd stake-nucypher
```
4. run
```bash
yarn install
```
5. run
```bash
yarn start
```
6. go to http://localhost:3000/

## Installation
```bash
# install packages
yarn install
```

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `yarn build`

Builds the app for production to the `build` folder.<br />
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.<br />
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## License

AGPL-3.0
