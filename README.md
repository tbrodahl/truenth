# TrueNTH Static

This is the project files to build a static set of HTML/CSS/Javascript files for the TrueNTH microsite.

##### TL; DR –– Where are the HTML, CSS, and JS files?

The entire `dist/` directory, or set of compiled artifacts (HTML, CSS, and JavaScript), is not included in version control. You will need to run `gulp build` to generate these files.

## This project uses gulp

We are using [gulp](http://www.gulpjs.com), the amazing Javascript Task Runner, for a simple compilation of [SASS](http://sass-lang.com/), [CoffeeScript](http://coffeescript.org/), and [PUG](https://pugjs.org) files. A few other tasks related to asset compilation are included as well; see the `gulpfile.js` file for the full set of tasks.

Installation is simple:

### Three Step Install

1. [Install node and npm](https://gist.github.com/isaacs/579814)
2. Install gulp: `npm install -g gulp`
3. Install dependencies (reads from package.json): `npm install`

Once installed, type `gulp` in the Terminal to spawn a local development server and watch / compile changes. Source files found in `src/`; compiled files are built into `./dest/`

_A quick note on styles:_
Where possible, we would like to use the [SMACSS](http://smacss.com/) theory for CSS styles.

### Gulp Tasks

* `gulp watch` watches for changes for `.coffee`, `.sass`, and `.pug` files in the `./src` directory, and compiles their counterparts into `dist/`. It also runs a webserver using [BrowserSync](https://www.browsersync.io/docs/gulp), used for local development:

```sh
[BS] Access URLs:
 --------------------------------------
       Local: http://localhost:3000
    External: http://123.34.45.567:3000
 --------------------------------------
          UI: http://localhost:3001
 UI External: http://123.34.45.567:3000
 --------------------------------------
[BS] Serving files from: ./dist
```

* `gulp build` compiles the styles, scripts, and html from their `.sass`, `.coffee`, and `.pug` counterparts, accordingly.

```sh
$ ls ./dist
about.html                   index-admin.html             symptom-tracker.html
contact.html                 index.html                   terms-and-conditions.html
decision-support.html        legal.html                   what-is-prostate-cancer.html
fonts                        scripts
images                       styles
```
