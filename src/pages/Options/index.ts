import Options from '../Content/modules/types/options';
import './index.css';

const storedUserOptions = [
  'startDate',
  'period',
  'startHour',
  'startMinutes',
  'sidebar',
  'dash_courses',
  'due_date_headings',
];

function optionsOrDefaults(result: Options): Options {
  return {
    startDate: !result.startDate ? 1 : result.startDate,
    startHour: !result.startHour ? 15 : result.startHour,
    startMinutes: !result.startMinutes ? 0 : result.startMinutes,
    period: !(
      result.period === 'Day' ||
      result.period === 'Week' ||
      result.period === 'Month'
    )
      ? 'Week'
      : result.period,
    sidebar:
      result.sidebar !== false && result.sidebar !== true
        ? false
        : result.sidebar,
    dash_courses:
      result.dash_courses !== false && result.dash_courses !== true
        ? false
        : result.dash_courses,
    due_date_headings:
      result.dash_courses !== false && result.dash_courses !== true
        ? true
        : result.due_date_headings,
  };
}

/* Set the logo and title to the extension's web store url */
function setStoreLinks() {
  // @ts-expect-error: InstallTrigger is only in Firefox
  const isFirefox = typeof InstallTrigger !== 'undefined';
  let storeURL =
    'https://chrome.google.com/webstore/detail/tasks-for-canvas/kabafodfnabokkkddjbnkgbcbmipdlmb';
  if (isFirefox)
    storeURL =
      'https://addons.mozilla.org/en-US/firefox/addon/tasks-for-canvas';

  Array.from(document.getElementsByTagName('a')).forEach((elem) => {
    elem.href = storeURL;
  });
}

function createDropdownOption(label: string, cb: () => void): HTMLElement {
  const option = document.createElement('div');
  option.className = 'dropdown-option';
  option.textContent = label;
  option.onclick = cb;
  return option;
}

function setSelectedDropdownOption(
  label: string,
  dropdownId: string,
  selectedId: string
) {
  const selected = document.getElementById(selectedId);
  const dropdown = document.getElementById(dropdownId);
  if (selected?.firstChild) selected.firstChild.textContent = label;
  if (dropdown) dropdown.classList.add('hidden');
}

function setDropdown(
  keys: { [key: string]: number } | { [key: string]: string },
  dropdownId: string,
  selectedId: string,
  cb?: (key: string) => void,
  cmp?: (a: string, b: string) => number
) {
  const weekdayDropdown = document.getElementById(dropdownId);
  const weekdaySelected = document.getElementById(selectedId);
  if (weekdaySelected && weekdayDropdown)
    weekdaySelected.onclick = () => {
      if (!weekdayDropdown.classList.contains('hidden'))
        weekdayDropdown.classList.add('hidden');
      else weekdayDropdown.classList.remove('hidden');
    };
  let iter = Object.keys(keys);
  if (cmp) iter = iter.sort();
  iter.forEach((w) => {
    weekdayDropdown?.appendChild(
      createDropdownOption(w, () => {
        setSelectedDropdownOption(w, dropdownId, selectedId);
        if (cb) cb(w);
      })
    );
  });
}

const weekdays: { [key: string]: number } = {
  Monday: 0,
  Tuesday: 1,
  Wednesday: 2,
  Thursday: 3,
  Friday: 4,
  Saturday: 5,
  Sunday: 6,
};

const ampm: { [key: string]: number } = {
  am: 0,
  pm: 12,
};

const hours: { [key: string]: number } = {};
for (let h = 1; h <= 12; h++) {
  hours[h] = h % 12;
}

const minutes: { [key: string]: number } = {};
for (let m = 0; m < 60; m++) {
  minutes[(m < 10 ? '0' : '') + m] = m;
}

function setWeekdayDropdown() {
  setDropdown(
    weekdays,
    'weekdays-options',
    'weekday-selected',
    (key: string) => {
      chrome.storage.sync.set({
        startDate: Object.keys(weekdays).indexOf(key) + 1,
      });
    }
  );
}

function setHoursDropdown() {
  setDropdown(hours, 'hours-options', 'hours-selected', (key: string) => {
    chrome.storage.sync.set({
      startHour: hours[key] + ampm[getSelectedAmPm()],
    });
  });
}

function getSelectedHours() {
  return document.getElementById('hours-selected')?.textContent?.trim() || '0';
}

function setMinutesDropdown() {
  setDropdown(
    minutes,
    'minutes-options',
    'minutes-selected',
    (key: string) => {
      chrome.storage.sync.set({
        startMinutes: minutes[key],
      });
    },
    (a, b) => parseInt(a) - parseInt(b)
  );
}

function setAmPmDropdown() {
  setDropdown(ampm, 'ampm-options', 'ampm-selected', (key: string) => {
    // set option
    chrome.storage.sync.set({
      startHour: hours[getSelectedHours()] + ampm[key],
    });
  });
}

function getSelectedAmPm() {
  return document.getElementById('ampm-selected')?.textContent?.trim() || 'am';
}

const periods: { [key: string]: string } = {
  day: 'Day',
  week: 'Week',
  month: 'Month',
};

function setSelectedPeriod(key: string) {
  const selected = document.getElementById(key);
  Object.keys(periods).forEach((p) => {
    document.getElementById(p)?.classList.remove('selected-period');
  });
  if (selected) {
    selected.classList.add('selected-period');
    const weekday = document.getElementById('weekday-dropdown');
    if (key !== 'week') weekday?.classList.add('hidden');
    else weekday?.classList.remove('hidden');
    const label = document.getElementById('start-label');
    if (label) {
      label.textContent = periods[key] + ' start';
    }
  }
}

function setPeriods() {
  Object.keys(periods).forEach((p) => {
    const pd = document.getElementById(p);
    if (pd)
      pd.onclick = () => {
        setSelectedPeriod(p);
        chrome.storage.sync.set({ period: periods[p] });
      };
  });
}

const booleanOptions: { [key: string]: string } = {
  'default-sidebar': 'sidebar',
  'active-rings': 'dash_courses',
  'due-date-headings': 'due_date_headings',
};

function setBooleanOption(key: string, checked: boolean) {
  const updatedKey: { [key: string]: boolean } = {};
  updatedKey[key] =
    key === 'dash_courses' || key === 'sidebar' ? !checked : checked;
  chrome.storage.sync.set(updatedKey);
}

function toggleClass(className: string, elem: HTMLElement) {
  if (elem.classList.contains(className)) elem.classList.remove(className);
  else elem.classList.add(className);
}

function setCheckbox(key: string, checked: boolean) {
  if (checked) document.getElementById(key)?.classList.add('checked');
  else document.getElementById(key)?.classList.remove('checked');
}

function setBooleanOptions() {
  Object.keys(booleanOptions).forEach((b) => {
    const checkbox = document.getElementById(b);
    if (checkbox) {
      checkbox.onclick = () => {
        toggleClass('checked', checkbox);
        setBooleanOption(
          booleanOptions[b],
          checkbox.classList.contains('checked')
        );
      };
    }
  });
}

setStoreLinks();
setWeekdayDropdown();
setHoursDropdown();
setMinutesDropdown();
setAmPmDropdown();
setPeriods();
setBooleanOptions();

chrome.storage.sync.get(storedUserOptions, (items) => {
  const options = optionsOrDefaults(items as Options);
  setSelectedPeriod(options.period.toLowerCase());
  setCheckbox('default-sidebar', !options.sidebar);
  setCheckbox('active-rings', !options.dash_courses);
  setCheckbox('due-date-headings', options.due_date_headings);
  setSelectedDropdownOption(
    Object.keys(weekdays)[options.startDate - 1],
    'weekdays-options',
    'weekday-selected'
  );
  if (options.startHour >= 12) {
    setSelectedDropdownOption(
      '' + (((options.startHour - 1) % 12) + 1),
      'hours-options',
      'hours-selected'
    );
    setSelectedDropdownOption('pm', 'ampm-options', 'ampm-selected');
  } else {
    setSelectedDropdownOption(
      '' + options.startHour,
      'hours-options',
      'hours-selected'
    );
    setSelectedDropdownOption('am', 'ampm-options', 'ampm-selected');
  }
  setSelectedDropdownOption(
    (options.startMinutes < 10 ? '0' : '') + options.startMinutes,
    'minutes-options',
    'minutes-selected'
  );
});
