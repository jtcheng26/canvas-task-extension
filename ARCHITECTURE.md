# Architecture

This document describes the high-level architecture of Tasks for Canvas.
If you want to familiarize yourself with the code base, you are just in the right place!

Template borrowed from [rust-analyzer](https://github.com/rust-lang/rust-analyzer/blob/d7c99931d05e3723d878bea5dc26766791fa4e69/docs/dev/architecture.md)

## Bird's Eye View

On the highest level, Tasks for Canvas is a browser extension that runs primarily through a [content script](https://developer.chrome.com/docs/extensions/develop/concepts/content-scripts) where code will run in the user's Canvas website, make [API requests](https://canvas.instructure.com/doc/api/live) on behalf of the user, and display that data in a more convenient to-do list UI.

More specifically, the extension:

1) Executes a small amount of code on any website the user is on to detect that the website is Canvas.
2) Executes more code to detect the HTML component for the existing Canvas sidebar (or creates one if in List View).
3) Injects a root React component into the sidebar and shows a loading state.
4) Fetches data from all necessary API routes and converts it to a general format used in React state.
5) Renders the UI from that data.
6) Handles further user interaction/CRUD by first updating the local state, then propagating changes to the API or local storage.

(4) and (6) are where most errors could happen and where they are hardest to resolve.


## Code Map

This section talks briefly about various important directories and data structures.
Pay attention to the **Architecture Invariant** sections.
They often talk about things which are deliberately absent in the source code.

### `src/assets`

All image/icon assets which are copied directly to the build package.

### `src/pages`

- `src/pages/Background`
- `src/pages/Content`
- `src/pages/Options`
- `src/pages/Popup`

This is where each individual interface of the extension is separated. Each directory is a self-contained module and any Javascript dependencies between them will be duplicated in the final package (i.e. Content and Options each have their own copy of React).
Accordingly, they should be completely independent, the only thing they can share are any `assets` in `src/assets`. `Background`, `Options`, and `Popup` are pretty straightforward.

#### `src/pages/Content`
##### `src/pages/Content/entry`  
Contains all code that detects Canvas and injects React into the DOM.
##### `src/pages/Content/modules`

- `src/pages/Content/modules/components`  
  All the React components used in the sidebar. `App.tsx` is the root component.
- `src/pages/Content/modules/constants`  
  Constants, defaults, links, colors used throughout the content script.
- `src/pages/Content/modules/contexts`  
  React Contexts used.
- `src/pages/Content/modules/hooks`
  All data fetching hooks and utilities used in the content script. Also includes unit tests for hooks.
- `src/pages/Content/modules/icons`  
  SVG icons used, stored as React components and JSX snippets.
- `src/pages/Content/modules/tests`
  All integration tests and test data for the extension. Read more about testing below.
- `src/pages/Content/modules/types`  
  All core data types reused throughout the content script. One-off types for props, etc. should be stored directly in that file.
- `src/pages/Content/modules/utils`  
  Other utility functions used throughout the content script.


### `src/manifest-[browser].json`
Stores the browser extension manifest for Chrome and Firefox, respectively. Manifest v3 is used in Chrome, Firefox uses v2 but will be migrated to v3 in the future.

## Development Toolchain

This sections talks about the tools used to build and test the extension.

### Code generation

`utils/build.js`, `utils/webserver.js`, and `webpack.config.js` are used to build the extension and run the hot-reload dev server. These come from the [web extension template](https://github.com/lxieyang/chrome-extension-boilerplate-react) I used.  
  
`env.js` contains global environment variables that can be accessed through `process.env`. `DEMO` can be set to True to show sample data in place of making actual API requests for testing purposes.

### Testing

Unit tests for individual functions are kept adjacent to the file in a `.unit.test.ts` file. Most unit tests are just for data fetching/processing. Unit tests for React components are intentionally left out since individual components are expected to change more frequently.

The `src/pages/Content/modules/tests` directory stores end-to-end integration tests where real and generated test data is fed from a mocked API, ran through the entire content script code, rendered in React through `@testing-library/react`, and verified that no errors occurred.

UI testing is done through `storybook`. Individual components may have a `stories` directory that stores that configuration.

