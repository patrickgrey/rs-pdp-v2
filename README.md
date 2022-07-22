# \_dev-template

This template is a work environment to create e-learning pages.

## Prerequisites

This template requires node v16.9.1 or greater.

## Installation

Clone the repo and in your terminal run `npm i`.

## Run & Build

In your terminal run `npm run dev`. This should provide a link to open in your browser.
Run `npm run build` to create a production ready version of the files.

## Structure

### package.json

Development scripts are contained in the `package.json` file.

### config files in root folder

Config files are all commented and exist in the root directory.

- `tailwind.config.js` Customise tailwind CSS utility settings.
- `rollup.config.js` Rollup allows js files to import other js files.
- `postcss.config.js` processes CSS to allow SASS like variables and nesting, purging of extra tailwind classes, autoprefixer and to minify the output file.
- `.env` If you want to rename the `course-source` and `course-publish` folders without the whole environment exploding catastrophically, please change the names in here.
- `eleventy.js` 11ty is the static site generator used to process HTML pages. Shortcodes are created here.

### course-source

The `course-source` folder contains all of the source files for the project content.

#### course-source: folder: \_course-intro-template

Copy this folder as a starter template for course introduction pages. Start by opening the file `_utilities/_data/metaData.json` and add the `courseCode` and the `courseTitle`. This data is used across pages, inlcuding the title of the `_course-intro-template`.

#### course-source: folder: \_web-page-template

Copy this folder as a starter template for all other pages.

#### course-source: folder: \_shared

- `_styleguide` holds all files related to the styleguide.
- `_shared.css` All template css files contain a link to this file. This file Contains a link to the styleguide. This way the \_shared file allows us to inlcude course specific files that are shared across pages (inlcuding being able to overwrite styleguide styles if needed).
- `_components` Includes local copies of all components that can be reused as js and css modules (like scroll to top).

#### course-source: folder: \_direct-access

Dynamically builds the direct access pages based on the data on the `metadata.json` file. See the features section below for more details.

#### course-source: file: root: index.html

This page contains dynamically created contents. Once you start creating new folders using the starter templates, they will start appearing. `root:index.css` contains styles specific to the index page.

### course-publish

The `course-publish` folder contains the generated files that are viewed in the browser.

### \_utilities

- `/_data/courseContents.js` is the node script that builds the HTML for the index content table.
- `/_data/metadata.json` file is used to share data like the course title across pages. It also contains all the data for the direct access pages. See the Direct Access section below for instructions on building it.
- `zip-it-and-ship-it.js` node script to zip all content folders once built.

## Features

### Content page

This will build out automaticall from new folders created in the `course-source` folder. The course title is taken from the `courseTitle` property of the `metadata.json` file.

### Tailwind

Tailwind provides a huge set of preconfigured classes that can be used instantly in your html without having to create new files in your css files while maintaining naming consistency.

### Short codes

Shortcodes can be added to an HTML file and on processing they will be expanded out into a block of HTML code with the parameters provided e.g. `{% video "xoy_6NjvdIk" %}` will expand into full video HTML with the video ID inlcuded.

### Navigation bars

ANother shortcode, `{% lmsBanner %}` is inlcuded below the `<body>` tag. This recreates the sticky navigation bar that appears in all pages once uploaded to the LMS. This allows designers to take this into account when developing. If you would rather not use it, delete the shortcode.

### Components

Components are kept locally but can be added to JS and CSS as it they are installed as a node module.

### Direct Access

Open the `metadata.json` file and fill in the fields and the direct access pages will be created automatically on build.

- If it is a trailer change the value of the attribute `dataAccessType` in head to trailer.
- If the values for `dataCourseMode` and `dataCourseProvider` need to be different set the correct ones.
- If you don't need a Registration button, set `syllabusHasRegisterButton` to `false`.
- Add an object for each page needed in the Direct Access course
  - syllabusContent types: FOLDER, WBT, VIDEO, LINK, TEST, FILE.
  - The depth property determines nesting for pages and folders.
  - Get the link URL from the LMS.
  - To disable an item, omit the link property.

# TODO

Sass should be dart sass, see:
https://github.com/nhoizey/pack11ty/blob/master/package.json

- Maybe drop SASS for tailwind? YES, no need for SASS as has mixins for media queries and can nest if asked.... https://github.com/postcss/postcss-cli
- Add tailwind - need to do purge on build next
  https://github.com/distantcam/windty/blob/main/package.jsonhttps://github.com/distantcam/windty/blob/main/package.json
  DONE
- Add snowpack NOPE
  - it's for SPAs
- https://github.com/rollup/rollup/issues/703 -
  https://www.sitepoint.com/getting-started-with-eleventy/ -
  https://www.codecookbook.dev/asset-bundling-eleventy-webpack-tailwind/
- Enable npm modules DONE with rollup
- Check rollup build DONE - Check node module import DONE
  - Check EC package import
    - broken at the moment (update versions since Gabby push) - no, issue was no npmrc - had nvmrc instead!! DONE
    - Replace with partials? Pro/con
      - If npm package, still have to rebuild pages with updates. Dependency scanning though...
- Change tailwind JIT DONE
- Move source and publish folder names to ENV VARS.
  - package.json still to do. DONE
- auto list contents of course DONE
- Check for speed at scale DONE
- Test with Gabby
  - https://shapeshed.com/writing-cross-platform-node/ DONE
- Build with zips DONE
- Find different way to use components. Shortcodes? Nah. DONE
  - Just keep components locally? In shared? Yes DONE
- Add H5P and animation DONE
- Video shortcode - needs vimeo function DONE
- Integrate flow automatically DONE
- Add variables to css for breakpoints DONE
- Nesting? Yes, G wants DONE
- Add shortcode that only returns string on dev for clix nav DONE
- text for scroll preview DONE
- Fix relative links to \_shared folder in rollup DONE
- Add page and folder icons to contents page DONE
- New icons for page types DONE
- Direct access should build from data (array of clix URLs and content types) DONE
- Direct access link show and hide. DONE
- Direct Google Analytics for direct access!! DONE
- Direct access scroll memory. DONE
- Fix bg image - image link should be in local stylesheet, not styleguide. DONE
- Use Main instead of article: https://developer.mozilla.org/en-US/docs/Web/HTML/Element/main DONE
- Write up the justification doc. DONE
- Write up all the instructions in the readme file. DONE
- BUILD IS BROKEN - shared and styleguide not inlcuded on build. Need to merge CSS!! Fixed that issue but html not updating on shared change.
- Test on safari
- Fix remote pc font issue
- Prevent CSS reloading page - need to watch only changed files. This seems to have been the issue with POSTCSS variables.
  Test nesting and variables as something is really slowing things down.
- Images shortcode
  - https://mahmoudashraf.dev/blog/how-to-optimize-and-lazyloading-images-on-eleventy/ NEEDS MORE WORK FOR DYNAMIC URLS
