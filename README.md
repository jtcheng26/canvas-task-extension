# Tasks Browser Extension for Canvas Instructure
[![ko-fi](https://ko-fi.com/img/githubbutton_sm.svg)](https://ko-fi.com/R6R8FV70G)

Ever had trouble finding your weekly assignments? Wish you had a nice progress bar to motivate you to complete everything?

No? Well either way, the **Tasks Browser Extension for Canvas** is here to help!

## Download
[![Download for Chrome](https://img.shields.io/badge/Download_for-Chrome-4c8bf5?style=for-the-badge&logo=Googlechrome)](https://chrome.google.com/webstore/detail/tasks-for-canvas/kabafodfnabokkkddjbnkgbcbmipdlmb)
[![Download for Firefox](https://img.shields.io/badge/Download_for-Firefox-ff9400?style=for-the-badge&logo=Firefoxbrowser&logoColor=White)](https://addons.mozilla.org/en-US/firefox/addon/tasks-for-canvas)<br>
Edge, Opera, and Vivaldi are compatible with the Chrome version.
## Features

### Stay on Track

Colorful task items ensure that you'll never miss an assignment again.

![](screenshots/Screenshot1.png)

### Track Your Progress

Visual progress bars for each of your courses show how far you are in completing your assignments this week.

![](screenshots/Screenshot2.png)

### Make It Your Own

Task items and progress bars correspond with your chosen dashboard colors and positions.

![](screenshots/Screenshot3.png)

### Notes

- The sidebar only works in Card View and Recent Activity.
- Only courses that have assignments will appear in the chart.
  - Alternatively, you can choose to show all dashboard courses in the options page.
    - To change your dashboard courses, go to **Courses** in the left sidebar, go to **All Courses** and star the classes that you want on your dashboard.
- The **Unfinished** assignments list will show all assignments from the dashboard courses that are both unsubmitted and ungraded or have a grade of 0.

## Installing and Running for Development

### Procedures:

1. Check if your [Node.js](https://nodejs.org/) version is >= **10.13**.
2. Clone this repository.
3. Run `npm install` to install the dependencies.
4. Run `npm start`
5. Load the extension on Chrome following:
   1. Access `chrome://extensions/`
   2. Check `Developer mode`
   3. Click on `Load unpacked extension`
   4. Select the `build` folder.
6. Happy hacking.

Built with [Chrome Extension Boilerplate with React 17 and Webpack 5](https://github.com/lxieyang/chrome-extension-boilerplate-react.git)
