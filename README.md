swarm-icons
===========
[![npm version](https://badge.fury.io/js/swarm-icons.svg)](https://badge.fury.io/js/swarm-icons)
[![Build Status](https://travis-ci.org/meetup/swarm-icons.svg?branch=master)](https://travis-ci.org/meetup/swarm-icons)

Icon library module of the [Swarm Design System](https://github.com/meetup/swarm-design-system)

## Documentation
[https://meetup.github.io/swarm-icons/](https://meetup.github.io/swarm-icons/)

---------

## Using `swarm-icons` in your project

#### Installation

```bash
yarn add swarm-icons
```

#### Usage

##### Optimized svg files
If you need individual `svg` files for your project, you will find them in `dist/optimized`.

##### SVG sprite
For an svg sprite, `swarm-icons` also generates an HTML include, `dist/sprite/sprite.inc`.
You can inject this include into the top of an HTML document (right after the opening `body` tag).
For more information about svg sprites, see this article from [CSS Tricks](https://css-tricks.com/svg-sprites-use-better-icon-fonts/).

##### React
If the svg sprite is included at the top of every HTML document in your React project, you can use the
`Icon` component in [`meetup-web-components`](https://github.com/meetup/meetup-web-components) to render the icon.

----------

## Modifying the icon library

#### Adding new icons
0. Check out a new branch. For example, `new_fancy_icon`.
1. Use sketch template in `design_resources` for your new icon
2. Commit your icon sketch file to `src/sketch/`
3. Run `yarn run build` to export icon distributions from sketch files
4. Commit the resulting changes
5. Submit a pull request
6. The PR will publish a `-beta` tag to npm

#### Changing an icon
0. Check out a new branch. For example, `edit_camera_icon`.
1. Use the sketch source file in `src/sketch/` to make edits
3. Run `yarn run build` to export icon distributions from sketch files
4. Commit the resulting changes
5. Submit a pull request
6. The PR will publish a `-beta` tag to npm

#### Releases
This package uses semver versioning to tag releases, although the patch version
is determined exclusively by the Travis build number for pushes to `master`.
Major and minor versions are hard-coded into the [Makefile](Makefile#L2).

Manual pushes to `master` and PR merges to master will be built by Travis, and
will kick off the yarn publish routine. The currently-published version of the
package is shown on the repo homepage on GitHub in a badge at the top of the
README.

----------

## Development

### Setup
**You must have the [`sketchtool cli`](https://www.sketchapp.com/tool/) installed to run `build` commands**

Once you have the latest version of Sketch installed, run the following to set up `sketchtool`:

```bash
~/Applications/Sketch.app/Contents/Resources/sketchtool/install.sh
```

#### yarn commands

task                      | description
------------------------- | ------------------------
`yarn run build`          | builds all icon distributions to `dist/`; builds docs to `doc/build`
`yarn run publish-docs`   | builds and publishes documentation to github pages

---------

# Release notes

## v1.2.0
- Major (non-breaking) changes to sketch file artboards and pages
	- arboards names are now used to generate file names
	- artboards are organized by "platform" page
- Improved build to generate distributions directly from sketch files
	- **you must now have the `sketchtool` cli to build**
- Added a `pdf` distribution for iOS

## v1.1.0
- Removed `chevron-down`.

## v1.0.0
Some icon shapes have been deleted. A checklist of usage in consumer apps can be found [here](https://docs.google.com/a/meetup.com/spreadsheets/d/1wgm7-aooN_FJkSnnzS6JbempVaazqX3suBtQv9Q0tNY/edit?usp=sharing)

- Added new icon shapes
- Updated existing shapes
- Created `--small` shape variants for drawing icons at `xs` size
	- third party icons prefixed with `external-` do not have `--small` variants
- Deleted a number icons.
	- `messages-new`
	- `messages-notif`
	- `messages`
	- `pause`
	- `start-new`
