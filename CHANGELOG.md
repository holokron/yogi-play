# Changelog

## [0.37.2] - 2020-06-20

### Fixed

- Incorret state of sound after first click

### Changed

- Packages update
- Changed order of search and text-to-speech

## [0.37.1] - 2020-01-07

### Fixed

- Fixed loading of sounds

## [0.37.0] - 2019-12-29

### Changed

- Optimized redux state

## [0.36.0] - 2019-12-19

### Changed

- Improved sound search

## [0.35.0] - 2019-12-15

### Changed

- Removed containers and changed to hooks

## [0.34.0] - 2019-08-06

### Added

- Added some `react-redux` hooks

### Changed

- Packages update
- Node version bumped to 12

## [0.33.2] - 2019-06-11

### Changed

- Packages update

## [0.33.1] - 2019-05-20

### Changed

- Packages update
- Docs update

## [0.33.0] - 2019-05-04

### Added

- Sound search

### Changed

- Added container to `TextToSpeech` and refactored to hooks
- Updated dependencies

## [0.32.0] - 2019-04-23

### Added

- `useToggle` hook

### Changed

- Updated dependencies
- `Navigation` tests

### Removed

- `ToggleContainer`

## [0.31.0] - 2019-04-20

### Added

- Added sentry
- Issue template

### Changed

- Changed add sound link
- Updated tests

## [0.30.0] - 2019-04-20

### Added

- Reducer tests
- Prettier and git hooks
- Coverage config

### Changed

- Actions interfaces
- Updated dependencies

## [0.29.0] - 2019-04-13

### Added

- SoundState state in store

### Changed

- Updated dependencies

## [0.28.0] - 2019-03-28

### Changed

- Updated dependencies
- Changed Footer

## [0.27.0] - 2019-02-12

### Changed

- Updated dependencies
- Switched off service worker
- Cache rules

### Removed

- Unused files

## [0.26.1] - 2019-01-17

### Fixed

- Fixes for legacy devices

## [0.26.0] - 2019-01-17

### Changed

- Massive performance optimizations, moved to REST api instead of Firebase live data fetching

## [0.25.0] - 2019-01-16

### Changed

- Moved to original react-scripts with TS
- Updated packages

## [0.24.0] - 2018-12-06

### Changed

- Bundle optimizations

## [0.23.0] - 2018-12-01

### Added

- Favourites functionality

## [0.22.0] - 2018-11-13

### Added

- Deeper redux integration

### Changed

- UI improvements

## [0.21.0] - 2018-11-08

### Added

- Redux

### Changed

- Updated packages

## [0.20.1] - 2018-10-05

### Fixed

- Fixed version number

## [0.20.0] - 2018-10-05

### Changed

- Updated dependencies

## [0.19.0] - 2018-09-22

### Changed

- Updated outdated packages, typescript to v3

## [0.18.0] - 2018-05-01

### Changed

- Updated React to 16.3
- Updated Typescript to 2.8
- Design fixes

## [0.17.0] - 2018-03-31

- Released under open source license to github
- Added docs
- Added travis CI config

## [0.16.0] - 2018-03-27

### Added

- Facebook login/registration
- Google login/registration

## [0.15.0] - 2018-03-25

### Added

- Added _recent_ tag case in _Sounds_

### Changed

- Improved orderings of tags and sounds

### Removed

- _info_ color from _PlayButton_ when sounds is new

## [0.14.0] - 2018-03-24

### Added

- Reactstrap library
- Forms tests
- Official Font Awesome React components

### Changed

- Button component in _PlayButton_
- Button component in _AuthenticationForm_, _RegistrationForm_
- Col component in _SoundsRow_
- NavPill component to Nav in _Sounds_
- _Nav_ to SoundsNav and used react Nav component
- _NavItem_ to \_SoundNavItem and used reactstrap Nav component
- Used Reactstrap components in _Navigation_
- Used Reactstrap components where needed

### Removed

- _Col_ component
- _NavPills_ component
- _Card_ component
- _Header_ component
- _FormGroup_ component
- _Input_ component

### Fixed

- Click on _PlayButton_ in loading state, loads audio again

## [0.13.0] - 2018-03-24

### Added

- _isNew_ flag in _Sound_ type and reacting for it in _PlayButton_

## [0.12.0] - 2018-03-23

### Added

- Firebase sounds integration
- Changelog

### Changed

- Moved Footer from routes to App
