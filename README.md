swarm-icons
===========
Icon library module of the [Swarm Design System](https://github.com/meetup/swarm-design-system)

## Documentation
[https://meetup.github.io/swarm-icons/](https://meetup.github.io/swarm-icons/)


---------

## Using `swarm-icons` in your project

#### Installation

```bash
npm install swarm-icons --save-dev
```

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
3. Export your icon as SVG and commit it to `src/svg/`. Follow the "dash-between-words" file naming convention.
4. Submit a pull request

Once the pull request is merged, we can manually run `grunt` and `grunt ghpages` in
the `master` branch. This will generate distributions and documentation for our Icon library.

*In an upcoming release, Travis will handle builds/versioning when a PR is merged*

#### Changing an icon
0. Check out a new branch. For example, `edit_camera_icon`.
1. Use the sketch source file in `src/sketch/` to make edits.
2. Commit your changes and submit a PR.


----------

## Development

#### grunt commands

task         | description
------------ | ------------------------
[default]    | cleans and rebuilds docs and distributions
`dist`       | builds icon distributions to `dist/`
`optimize`   | optimizes files from `src/` into `dist/optimized/`
`ghpages`    | clean & rebuild; pushes built doc html file to `gh-pages` branch

#### TODO:
- Travis integration
- auto-export SVG files to `src/svg` from assets committed to `src/sketch`
