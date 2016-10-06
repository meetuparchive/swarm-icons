## Assets
Create an icon source directory with some `svg` icons, lol


## Documentation
Find an adequate documentation tool that:

* we can pass a big list of icon names to a template
* basically does with this page in admin does: `svg_sprite.jsp`


## Build
Set up `Gruntfile` to build icons. The build should do the following:

* Optimize the `svg` files with `grunt-svgmin`
* create a distribution for our apps (just a dir of optimized files), for example `./dist/iOS`
* create a distribution for the web using `grunt-svgstore`, in the form of an HTML snippet
* build docs to display icons and their names
