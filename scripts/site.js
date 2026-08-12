const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  siteNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && siteNav.classList.contains("is-open")) {
      siteNav.classList.remove("is-open");
      navToggle.setAttribute("aria-expanded", "false");
      navToggle.focus();
    }
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

const weekOfWelcomeEnd = new Date("2026-08-22T23:59:59");
const socHouseAddress = "1201 Virginia Ave, Cookeville, TN";
const sycamoreAddress = "1144 Crescent Drive, Cookeville, TN";

const weekOfWelcomeEvents = [
  {
    title: "Move-in Day Walk to Ralph's Donuts",
    date: "2026-08-13",
    startTime: "19:00",
    endTime: "20:00",
    location: socHouseAddress,
    description: "Week of Welcome with SOC Campus Ministry."
  },
  {
    title: "SOC Open House",
    date: "2026-08-14",
    startTime: "18:00",
    endTime: "20:00",
    location: socHouseAddress,
    description: "Pizza and games at the SOC House."
  },
  {
    title: "Religious Fair on Campus",
    date: "2026-08-15",
    startTime: "11:00",
    endTime: "13:00",
    location: "Tennessee Tech campus",
    description: "Meet SOC during Week of Welcome."
  },
  {
    title: "Volleyball and Dirty Sodas",
    date: "2026-08-15",
    startTime: "19:00",
    endTime: "21:00",
    location: "Sycamore Church Gym, 1144 Crescent Drive, Cookeville, TN",
    description: "Week of Welcome volleyball and dirty sodas."
  },
  {
    title: "Sunday Worship",
    date: "2026-08-16",
    startTime: "09:00",
    endTime: "10:00",
    location: sycamoreAddress,
    description: "Sunday worship with Sycamore Church of Christ."
  },
  {
    title: "Sunday Bible Class",
    date: "2026-08-16",
    startTime: "10:15",
    endTime: "11:00",
    location: sycamoreAddress,
    description: "Sunday Bible class with SOC and Sycamore."
  },
  {
    title: "Sunday Evening Worship",
    date: "2026-08-16",
    startTime: "17:00",
    endTime: "18:00",
    location: sycamoreAddress,
    description: "Sunday evening worship with Sycamore Church of Christ."
  },
  {
    title: "Cane Creek Park Cookout and Disc Golf",
    date: "2026-08-17",
    startTime: "17:00",
    endTime: "19:00",
    location: "Cane Creek Park, Cookeville, TN",
    description: "Week of Welcome cookout and disc golf."
  },
  {
    title: "Campbellball",
    date: "2026-08-18",
    startTime: "18:00",
    endTime: "20:00",
    location: socHouseAddress,
    description: "Campbellball with hot dogs, popcorn, and drinks."
  },
  {
    title: "Morning Hike",
    date: "2026-08-19",
    startTime: "09:00",
    endTime: "10:30",
    location: socHouseAddress,
    description: "Week of Welcome morning hike."
  },
  {
    title: "Mix n Mingle",
    date: "2026-08-19",
    startTime: "15:00",
    endTime: "17:00",
    location: "Tennessee Tech campus",
    description: "Meet other students during Week of Welcome."
  },
  {
    title: "Bible Study",
    date: "2026-08-19",
    startTime: "18:30",
    endTime: "19:30",
    location: sycamoreAddress,
    description: "Bible study with ice cream after class."
  },
  {
    title: "First Day of Classes",
    date: "2026-08-20",
    allDay: true,
    location: "Tennessee Tech campus",
    description: "First day of classes at Tennessee Tech."
  },
  {
    title: "TTU Women's Soccer Game",
    date: "2026-08-20",
    startTime: "19:00",
    endTime: "21:00",
    location: "Tennessee Tech campus",
    description: "Week of Welcome soccer game."
  },
  {
    title: "Fresh Getaway",
    date: "2026-08-21",
    startTime: "18:00",
    endTime: "23:00",
    location: socHouseAddress,
    description: "Fresh Getaway mini-retreat for new students."
  }
];

function shouldShowWeekOfWelcome(today = new Date()) {
  return today <= weekOfWelcomeEnd;
}

function padCalendarNumber(value) {
  return String(value).padStart(2, "0");
}

function formatCalendarDate(date, time) {
  const [year, month, day] = date.split("-");

  if (!time) {
    return `${year}${month}${day}`;
  }

  const [hour, minute] = time.split(":");
  return `${year}${month}${day}T${hour}${minute}00`;
}

function getNextCalendarDate(date) {
  const nextDate = new Date(`${date}T00:00:00`);
  nextDate.setDate(nextDate.getDate() + 1);
  return [
    nextDate.getFullYear(),
    padCalendarNumber(nextDate.getMonth() + 1),
    padCalendarNumber(nextDate.getDate())
  ].join("");
}

function escapeCalendarText(text = "") {
  return String(text)
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/,/g, "\\,")
    .replace(/;/g, "\\;");
}

function slugifyFileName(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "soc-event";
}

function calendarFileNameForEvent(event) {
  return `${event.date}-${slugifyFileName(event.title)}.ics`;
}

function staticCalendarPath(fileName) {
  return `assets/calendars/${fileName}`;
}

function openStaticCalendar(fileName) {
  window.location.href = staticCalendarPath(fileName);
}

function httpsCalendarUrl(fileName) {
  return new URL(staticCalendarPath(fileName), window.location.href).href;
}

function webcalCalendarUrl(fileName) {
  return httpsCalendarUrl(fileName).replace(/^https?:/, "webcal:");
}

function googleCalendarSubscribeUrl(fileName) {
  return `https://calendar.google.com/calendar/render?cid=${encodeURIComponent(webcalCalendarUrl(fileName))}`;
}

function outlookCalendarSubscribeUrl(fileName, calendarName) {
  const params = new URLSearchParams({
    url: httpsCalendarUrl(fileName),
    name: calendarName
  });
  return `https://outlook.live.com/calendar/0/addcalendar?${params.toString()}`;
}

function getCalendarSubscribeDialog() {
  let dialog = document.querySelector("#calendar-subscribe-dialog");

  if (dialog) {
    return dialog;
  }

  dialog = document.createElement("dialog");
  dialog.id = "calendar-subscribe-dialog";
  dialog.className = "subscribe-dialog";
  dialog.innerHTML = `
    <div class="subscribe-dialog-panel">
      <button class="subscribe-dialog-close" type="button" aria-label="Close calendar subscribe options">×</button>
      <h2 data-subscribe-title>Subscribe to the calendar</h2>
      <p>
        Pick your calendar app. New and updated events on the website will
        automatically show up once you subscribe.
      </p>
      <div class="subscribe-options">
        <a class="calendar-download" data-subscribe-apple href="#">Apple Calendar</a>
        <a class="calendar-download" data-subscribe-google href="#" target="_blank" rel="noopener noreferrer">Google Calendar</a>
        <a class="calendar-download" data-subscribe-outlook href="#" target="_blank" rel="noopener noreferrer">Outlook</a>
        <a class="calendar-download" data-subscribe-download href="#">Download .ics file</a>
      </div>
    </div>
  `;
  document.body.append(dialog);

  dialog.querySelector(".subscribe-dialog-close").addEventListener("click", () => closeDialog(dialog));
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  });

  return dialog;
}

function openCalendarSubscribeDialog(fileName, calendarName) {
  const dialog = getCalendarSubscribeDialog();

  dialog.querySelector("[data-subscribe-title]").textContent = `Subscribe to ${calendarName}`;
  dialog.querySelector("[data-subscribe-apple]").href = webcalCalendarUrl(fileName);
  dialog.querySelector("[data-subscribe-google]").href = googleCalendarSubscribeUrl(fileName);
  dialog.querySelector("[data-subscribe-outlook]").href = outlookCalendarSubscribeUrl(fileName, calendarName);

  const downloadLink = dialog.querySelector("[data-subscribe-download]");
  downloadLink.href = httpsCalendarUrl(fileName);
  downloadLink.download = `${slugifyFileName(calendarName)}.ics`;

  openDialog(dialog);
}

function buildCalendarEvent(event, index = 0) {
  const timestamp = new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const uid = `${slugifyFileName(event.title)}-${event.date}-${index}@soc-tennessee-tech`;
  const dateLines = event.allDay
    ? [
        `DTSTART;VALUE=DATE:${formatCalendarDate(event.date)}`,
        `DTEND;VALUE=DATE:${getNextCalendarDate(event.endDate || event.date)}`
      ]
    : [
        `DTSTART;TZID=America/Chicago:${formatCalendarDate(event.date, event.startTime)}`,
        `DTEND;TZID=America/Chicago:${formatCalendarDate(event.date, event.endTime)}`
      ];

  return [
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${timestamp}`,
    `LAST-MODIFIED:${timestamp}`,
    "SEQUENCE:0",
    `SUMMARY:${escapeCalendarText(event.title)}`,
    ...dateLines,
    `LOCATION:${escapeCalendarText(event.location)}`,
    `DESCRIPTION:${escapeCalendarText(event.description || "SOC Campus Ministry event.")}`,
    "END:VEVENT"
  ].join("\r\n");
}

function shouldOpenCalendarFileDirectly() {
  return /android|ipad|iphone|ipod/i.test(navigator.userAgent || "");
}

function downloadCalendar(events, fileName) {
  if (!events.length) {
    return;
  }

  const calendarBody = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SOC Campus Ministry//SOC Website//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeCalendarText(fileName)}`,
    "X-WR-TIMEZONE:America/Chicago",
    ...events.map(buildCalendarEvent),
    "END:VCALENDAR"
  ].join("\r\n");
  const blob = new Blob([calendarBody], { type: "text/calendar;charset=utf-8" });
  const objectUrl = URL.createObjectURL(blob);

  if (shouldOpenCalendarFileDirectly()) {
    window.setTimeout(() => URL.revokeObjectURL(objectUrl), 60000);
    window.location.href = objectUrl;
    return;
  }

  const link = document.createElement("a");
  link.href = objectUrl;
  link.download = `${slugifyFileName(fileName)}.ics`;
  document.body.append(link);
  link.click();
  link.remove();
  window.setTimeout(() => URL.revokeObjectURL(objectUrl), 0);
}

function openDialog(dialog) {
  if (typeof dialog.showModal === "function") {
    dialog.showModal();
    return;
  }

  dialog.setAttribute("open", "");
}

function closeDialog(dialog) {
  if (typeof dialog.close === "function") {
    dialog.close();
    return;
  }

  dialog.removeAttribute("open");
  dialog.dispatchEvent(new Event("close"));
}

function eventsForDate(events, date) {
  return events.filter((event) => event.date === date);
}

function getWeekOfWelcomeDialog() {
  let dialog = document.querySelector("#week-of-welcome-dialog");

  if (dialog) {
    return dialog;
  }

  dialog = document.createElement("dialog");
  dialog.id = "week-of-welcome-dialog";
  dialog.className = "wow-dialog";
  dialog.innerHTML = `
    <div class="wow-dialog-panel">
      <button class="wow-dialog-close" type="button" aria-label="Close Week of Welcome popup">×</button>
      <div class="wow-dialog-copy">
        <p class="eyebrow">August 13-21</p>
        <h2>Week of Welcome 2026</h2>
        <p>
          SOC's Week of Welcome is loaded with events that introduce new students
          to the ministry, help them get plugged in, and give them a place to meet
          other students early in the semester.
        </p>
        <p>
          The week wraps up with Fresh Getaway, a five-hour mini-retreat where new
          students spend quality time together and play interactive games designed
          to help friendships form quickly.
        </p>
        <button class="calendar-download wow-calendar-all" type="button" data-wow-calendar-all>Open Week of Welcome calendar</button>
        <div class="wow-schedule" aria-label="Week of Welcome itinerary">
          <article><strong>Aug 13</strong><span>Move-in Day, 7 PM walk to Ralph's Donuts</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-13">Add date</button></article>
          <article><strong>Aug 14</strong><span>6 PM SOC Open House with pizza and games</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-14">Add date</button></article>
          <article><strong>Aug 15</strong><span>11 AM-1 PM Religious Fair on campus, 7 PM volleyball and dirty sodas at Sycamore Church Gym</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-15">Add date</button></article>
          <article><strong>Aug 16</strong><span>9 AM worship, 10:15 Bible class, 5 PM worship</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-16">Add date</button></article>
          <article><strong>Aug 17</strong><span>5 PM Cane Creek Park cookout and disc golf</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-17">Add date</button></article>
          <article><strong>Aug 18</strong><span>6 PM Campbellball, hot dogs, popcorn, and drinks</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-18">Add date</button></article>
          <article><strong>Aug 19</strong><span>9 AM morning hike, 3-5 PM Mix n Mingle, 6:30 Bible study, ice cream after class</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-19">Add date</button></article>
          <article><strong>Aug 20</strong><span>First day of classes, 7 PM TTU women's soccer game</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-20">Add date</button></article>
          <article><strong>Aug 21</strong><span>6 PM Fresh Getaway</span><button class="calendar-download" type="button" data-wow-calendar-date="2026-08-21">Add date</button></article>
        </div>
      </div>
      <div class="wow-dialog-art">
        <img loading="lazy" decoding="async" src="assets/flyers/Week of welcome graphic.png" alt="Week of Welcome 2026 itinerary graphic">
      </div>
    </div>
  `;
  document.body.append(dialog);

  dialog.querySelector(".wow-dialog-close").addEventListener("click", () => closeDialog(dialog));
  dialog.querySelector("[data-wow-calendar-all]").addEventListener("click", () => {
    openCalendarSubscribeDialog("soc-week-of-welcome-2026.ics", "SOC Week of Welcome 2026");
  });
  dialog.querySelectorAll("[data-wow-calendar-date]").forEach((button) => {
    button.addEventListener("click", () => {
      if (shouldOpenCalendarFileDirectly()) {
        openStaticCalendar(`soc-week-of-welcome-2026-${button.dataset.wowCalendarDate}.ics`);
        return;
      }

      const events = eventsForDate(weekOfWelcomeEvents, button.dataset.wowCalendarDate);
      downloadCalendar(events, `SOC Week of Welcome ${button.dataset.wowCalendarDate}`);
    });
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  });

  return dialog;
}

if (shouldShowWeekOfWelcome()) {
  const weekOfWelcomeButton = document.createElement("button");
  weekOfWelcomeButton.className = "wow-launcher";
  weekOfWelcomeButton.type = "button";
  weekOfWelcomeButton.innerHTML = `
    <span>Week of Welcome</span>
    <strong>View schedule</strong>
  `;
  weekOfWelcomeButton.addEventListener("click", () => {
    openDialog(getWeekOfWelcomeDialog());
  });
  document.body.append(weekOfWelcomeButton);
}

const semesterYear = 2026;
const eventSchedules = {
  wednesday: [
    ["08-19", "Welcome Back", "Wednesday Bible Classes", "Sycamore Church of Christ"],
    ["08-26", "Just Getting Started", "Wednesday Bible Classes", "Sycamore Church of Christ"],
    ["09-02", "Enemies of the Heart", "Series runs September 2-30", "Sycamore Church of Christ"],
    ["10-07", "Fruit of Our Lips", "Wednesday Bible Classes", "Sycamore Church of Christ"],
    ["10-21", "Relationship Goals from Song of Solomon", "Series runs October 21-November 18", "Sycamore Church of Christ"],
    ["11-25", "Thanksgiving", "Wednesday Bible Classes", "Sycamore Church of Christ"],
    ["12-02", "Finishing Strong", "Series runs December 2-9", "Sycamore Church of Christ"]
  ],
  refuel: [
    ["08-24", "Devo and Nerf Wars", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["08-31", "Devo and Camp Games", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["09-14", "Road Trip: In-N-Out Burger Lebanon", "Refuel Monday Fellowship, 7:00 PM", "Lebanon, TN"],
    ["09-21", "Group Discussion Breakouts", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["09-28", "The Cross and Chick-fil-A", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["10-05", "Devo and Speed-Friending", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["10-12", "Devo and Battleship", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["10-19", "Guys Cornhole Girls", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["10-26", "Mentoring “How to Adult” Night", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["11-02", "Group Discussion Breakouts", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["11-09", "Commercial Night", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["11-16", "Devo and Draw That", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["11-23", "Raking Leaves and Chick-fil-A", "Refuel Monday Fellowship, 7:00 PM", "SOC House"],
    ["11-30", "Friendsgiving Meal", "Refuel Monday Fellowship, 7:00 PM", "SOC House"]
  ],
  sunday: [
    ["08-16", "A New Beginning", "Sunday Bible Class", "Sycamore Church of Christ"],
    ["08-23", "Who Are You?", "Sunday Bible Class", "Sycamore Church of Christ"],
    ["08-30", "Broken Promises", "Sunday Bible Class", "Sycamore Church of Christ"],
    ["09-06", "Labor Day", "Sunday Bible Class", "Sycamore Church of Christ"],
    ["09-13", "Wisdom Books", "Series runs September 13-27", "Sycamore Church of Christ"],
    ["10-04", "Fall Retreat", "Sunday Bible Class", "Sycamore Church of Christ"],
    ["10-11", "Middle of Nowhere", "Sunday Bible Class", "Sycamore Church of Christ"],
    ["10-18", "Fall Break", "Sunday Bible Class note", "Sycamore Church of Christ"],
    ["10-25", "Seven Churches in Asia Minor", "Series runs October 25-November 22", "Sycamore Church of Christ"],
    ["11-29", "Thanksgiving", "Sunday Bible Class", "Sycamore Church of Christ"],
    ["12-06", "How to Study", "Series runs December 6-27", "Sycamore Church of Christ"]
  ],
  lunch: [
    ["08-25", "Mexican Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["09-01", "BBQ Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["09-08", "Italian Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["09-15", "Breakfast Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["09-22", "Chicken and Sides Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["09-29", "Mexican Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["10-06", "Italian Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["10-13", "Breakfast Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["10-20", "Chicken and Sides Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["10-27", "BBQ Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["11-03", "No Meal: Election Day", "Tuesday Lunch cancelled", "SOC House"],
    ["11-10", "Mexican Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["11-17", "Thanksgiving Meal", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"],
    ["11-24", "No Meal: Thanksgiving Week", "Tuesday Lunch cancelled", "SOC House"],
    ["12-01", "Italian Lunch", "Tuesday Lunch, 11:00 AM-1:00 PM", "SOC House"]
  ]
};

function localDateFromSlug(dateSlug) {
  return new Date(`${semesterYear}-${dateSlug}T00:00:00`);
}

function getNextEvent(events, today = new Date()) {
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return events
    .map(([dateSlug, title, description, location]) => ({
      date: localDateFromSlug(dateSlug),
      title,
      description,
      location
    }))
    .sort((firstEvent, secondEvent) => firstEvent.date - secondEvent.date)
    .find((event) => event.date >= todayStart);
}

function formatEventDate(date) {
  const month = date.toLocaleDateString(undefined, { month: "short" });
  const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  return `${month}<br>${weekday}`;
}

const activityCalendarDefaults = {
  lunch: {
    startTime: "11:00",
    endTime: "13:00",
    location: socHouseAddress,
    prefix: "Tuesday Lunch"
  },
  refuel: {
    startTime: "19:00",
    endTime: "21:00",
    location: socHouseAddress,
    prefix: "Refuel Monday"
  },
  sunday: {
    startTime: "10:15",
    endTime: "11:00",
    location: sycamoreAddress,
    prefix: "Sunday Bible Class"
  },
  wednesday: {
    startTime: "18:30",
    endTime: "19:30",
    location: sycamoreAddress,
    prefix: "Wednesday Bible Classes"
  },
  singing: {
    startTime: "19:45",
    endTime: "20:15",
    location: sycamoreAddress,
    prefix: "Singing After Class"
  },
  connections: {
    startTime: "18:00",
    endTime: "19:00",
    location: sycamoreAddress,
    prefix: "Connections"
  },
  special: {
    allDay: true,
    location: socHouseAddress,
    prefix: "SOC Event"
  },
  note: {
    allDay: true,
    location: "",
    prefix: "SOC Calendar Note"
  }
};

function fullDateFromSlug(dateSlug) {
  return `${semesterYear}-${dateSlug}`;
}

function getActivityGroupFromCalendarEvent(calendarEvent) {
  const eventText = calendarEvent.textContent.toLowerCase();

  if (calendarEvent.classList.contains("break") || calendarEvent.classList.contains("cancelled")) {
    return "note";
  }

  if (calendarEvent.classList.contains("refuel")) {
    return "refuel";
  }

  if (calendarEvent.classList.contains("meal")) {
    return "lunch";
  }

  if (calendarEvent.classList.contains("singing")) {
    return "singing";
  }

  if (calendarEvent.classList.contains("connections")) {
    return "connections";
  }

  if (calendarEvent.classList.contains("special")) {
    return "special";
  }

  if (eventText.includes("wednesday")) {
    return "wednesday";
  }

  if (eventText.includes("sunday")) {
    return "sunday";
  }

  return null;
}

function normalizeActivityTitle(title, group) {
  const prefix = activityCalendarDefaults[group]?.prefix;

  if (!prefix || title.toLowerCase().startsWith(prefix.toLowerCase())) {
    return title;
  }

  return `${prefix}: ${title}`;
}

function calendarEventFromScheduleItem(item, group) {
  const [dateSlug, title, description, location] = item;
  const defaults = activityCalendarDefaults[group];
  return {
    title: normalizeActivityTitle(title, group),
    date: fullDateFromSlug(dateSlug),
    startTime: defaults.startTime,
    endTime: defaults.endTime,
    location: location || defaults.location,
    description: `${description}. From the SOC Campus Ministry semester schedule.`
  };
}

function calendarEventsForGroup(group) {
  return (eventSchedules[group] || [])
    .filter(([, title, description]) => {
      const eventText = `${title} ${description}`.toLowerCase();
      return !eventText.includes("no meal") && !eventText.includes("cancelled") && !eventText.includes("fall break");
    })
    .map((item) => calendarEventFromScheduleItem(item, group));
}

function calendarEventFromCard(calendarEvent) {
  const group = getActivityGroupFromCalendarEvent(calendarEvent);

  if (!group) {
    return null;
  }

  const defaults = activityCalendarDefaults[group];
  const title = calendarEvent.querySelector("h3")?.textContent || defaults.prefix;
  const description = calendarEvent.querySelector("p")?.textContent || defaults.prefix;
  const date = calendarEvent.querySelector("time")?.getAttribute("datetime");

  if (!date) {
    return null;
  }

  return {
    title,
    date,
    endDate: calendarEvent.dataset.endDate,
    allDay: defaults.allDay && !calendarEvent.dataset.startTime,
    startTime: calendarEvent.dataset.startTime || defaults.startTime,
    endTime: calendarEvent.dataset.endTime || defaults.endTime,
    location: calendarEvent.dataset.location || defaults.location,
    description: `${description}. From the SOC Campus Ministry semester schedule.`
  };
}

function allCalendarEventsFromPage() {
  const eventKeys = new Set();

  return Array.from(document.querySelectorAll(".semester-calendar .calendar-event"))
    .filter((calendarEvent) => !calendarEvent.classList.contains("break") && !calendarEvent.classList.contains("cancelled"))
    .map(calendarEventFromCard)
    .filter(Boolean)
    .filter((event) => {
      const key = `${event.date}-${event.title}`;

      if (eventKeys.has(key)) {
        return false;
      }

      eventKeys.add(key);
      return true;
    })
    .sort((firstEvent, secondEvent) => {
      const firstDate = `${firstEvent.date}T${firstEvent.startTime || "00:00"}`;
      const secondDate = `${secondEvent.date}T${secondEvent.startTime || "00:00"}`;
      return firstDate.localeCompare(secondDate);
    });
}

document.querySelectorAll("[data-event-card]").forEach((card) => {
  const event = getNextEvent(eventSchedules[card.dataset.eventCard] || []);
  const titleNode = card.querySelector("[data-event-title]");
  const descriptionNode = card.querySelector("[data-event-description]");
  const dayNode = card.querySelector("[data-event-day]");
  const dateNode = card.querySelector("[data-event-date]");
  const locationNode = card.querySelector("[data-event-location]");

  if (!titleNode || !descriptionNode || !dayNode || !dateNode || !locationNode) {
    return;
  }

  if (!event) {
    titleNode.textContent = "Semester schedule complete";
    descriptionNode.textContent = "Check Instagram for the latest updates.";
    dayNode.textContent = "--";
    dateNode.textContent = "Done";
    locationNode.textContent = "@ttu_soc";
    return;
  }

  titleNode.textContent = event.title;
  descriptionNode.textContent = event.description;
  dayNode.textContent = event.date.getDate();
  dateNode.innerHTML = formatEventDate(event.date);
  locationNode.textContent = event.location;
});

document.querySelectorAll("[data-calendar-group]").forEach((button) => {
  button.addEventListener("click", () => {
    const group = button.dataset.calendarGroup;
    const defaults = activityCalendarDefaults[group];

    if (!defaults) {
      return;
    }

    downloadCalendar(calendarEventsForGroup(group), `SOC ${defaults.prefix} 2026`);
  });
});

document.querySelectorAll("[data-calendar-all]").forEach((button) => {
  button.addEventListener("click", () => {
    openCalendarSubscribeDialog("soc-fall-semester-calendar-2026.ics", "SOC Fall Semester Calendar 2026");
  });
});

function getFlyerDialog() {
  let dialog = document.querySelector("#flyer-dialog");

  if (dialog) {
    return dialog;
  }

  dialog = document.createElement("dialog");
  dialog.id = "flyer-dialog";
  dialog.className = "flyer-dialog";
  dialog.innerHTML = `
    <button class="flyer-dialog-close" type="button" aria-label="Close flyer">×</button>
    <img decoding="async" alt="">
  `;
  document.body.append(dialog);

  dialog.querySelector(".flyer-dialog-close").addEventListener("click", () => closeDialog(dialog));
  dialog.addEventListener("close", () => {
    const image = dialog.querySelector("img");
    image.removeAttribute("src");
    image.alt = "";
  });
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closeDialog(dialog);
    }
  });

  return dialog;
}

document.querySelectorAll(".flyer-zoom").forEach((button) => {
  button.addEventListener("click", () => {
    const dialog = getFlyerDialog();
    const image = dialog.querySelector("img");
    image.src = button.dataset.fullSrc;
    image.alt = button.dataset.fullAlt || "Event flyer";
    openDialog(dialog);
  });
});

const calendarFlyers = {
  lunch: {
    src: "assets/flyers/Lunch Menu.jpg",
    alt: "Tuesday 11 AM to 1 PM lunch menu flyer"
  },
  refuel: {
    src: "assets/flyers/Refuel Monday.jpg",
    alt: "Refuel Monday Fellowship schedule flyer"
  },
  sunday: {
    src: "assets/flyers/Sunday Bible Class.jpg",
    alt: "Sunday Bible Class schedule flyer"
  },
  wednesday: {
    src: "assets/flyers/Wednesday Bible Classes.jpg",
    alt: "Wednesday Bible Classes schedule flyer"
  },
  fall: {
    src: "assets/flyers/socfall26.png",
    alt: "SOC Fall Calendar 2026"
  }
};

function getCalendarFlyer(calendarEvent) {
  const eventText = calendarEvent.textContent.toLowerCase();

  if (calendarEvent.classList.contains("break") || calendarEvent.classList.contains("cancelled")) {
    return null;
  }

  if (calendarEvent.classList.contains("refuel")) {
    return calendarFlyers.refuel;
  }

  if (calendarEvent.classList.contains("meal")) {
    return calendarFlyers.lunch;
  }

  if (
    calendarEvent.classList.contains("singing") ||
    calendarEvent.classList.contains("connections") ||
    calendarEvent.classList.contains("special")
  ) {
    return calendarFlyers.fall;
  }

  if (eventText.includes("wednesday")) {
    return calendarFlyers.wednesday;
  }

  if (eventText.includes("sunday")) {
    return calendarFlyers.sunday;
  }

  return null;
}

function openCalendarFlyer(calendarEvent) {
  const flyer = getCalendarFlyer(calendarEvent);

  if (!flyer) {
    return;
  }

  const dialog = getFlyerDialog();
  const image = dialog.querySelector("img");
  image.src = flyer.src;
  image.alt = flyer.alt;
  openDialog(dialog);
}

function localDateFromIso(date) {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day);
}

function isPastCalendarEvent(calendarEvent, today = new Date()) {
  const eventDate = calendarEvent.dataset.endDate || calendarEvent.querySelector("time")?.getAttribute("datetime");

  if (!eventDate) {
    return false;
  }

  const eventEnd = localDateFromIso(eventDate);
  const todayStart = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return eventEnd < todayStart;
}

function movePastCalendarEvents() {
  const calendar = document.querySelector(".semester-calendar");

  if (!calendar) {
    return;
  }

  const pastEvents = Array.from(calendar.querySelectorAll(".calendar-event")).filter((calendarEvent) => isPastCalendarEvent(calendarEvent));

  if (!pastEvents.length) {
    return;
  }

  const pastEventsPanel = document.createElement("details");
  pastEventsPanel.className = "past-events";
  pastEventsPanel.innerHTML = `
    <summary>
      <span>Past Events</span>
      <small>${pastEvents.length} previous ${pastEvents.length === 1 ? "event" : "events"}</small>
    </summary>
    <div class="past-events-groups"></div>
  `;

  const groupsContainer = pastEventsPanel.querySelector(".past-events-groups");
  const pastGroups = new Map();

  pastEvents.forEach((calendarEvent) => {
    const month = calendarEvent.closest(".calendar-month");
    const monthName = month?.querySelector("h2")?.textContent || "Past Events";

    if (!pastGroups.has(monthName)) {
      const group = document.createElement("section");
      group.className = "past-events-month";
      group.innerHTML = `<h3>${monthName}</h3><div class="past-events-list"></div>`;
      pastGroups.set(monthName, group);
      groupsContainer.append(group);
    }

    calendarEvent.classList.add("is-past");
    pastGroups.get(monthName).querySelector(".past-events-list").append(calendarEvent);
  });

  calendar.prepend(pastEventsPanel);

  calendar.querySelectorAll(".calendar-month").forEach((month) => {
    if (!month.querySelector(".calendar-list .calendar-event")) {
      month.hidden = true;
    }
  });
}

movePastCalendarEvents();

document.querySelectorAll(".calendar-event").forEach((calendarEvent) => {
  const flyer = getCalendarFlyer(calendarEvent);
  const calendarEventDetails = calendarEventFromCard(calendarEvent);
  const canAddSingleDate = !calendarEvent.classList.contains("break") && !calendarEvent.classList.contains("cancelled");

  if (!flyer && !calendarEventDetails) {
    return;
  }

  const eventTitle = calendarEvent.querySelector("h3")?.textContent || "calendar event";
  if (flyer) {
    calendarEvent.tabIndex = 0;
    calendarEvent.setAttribute("role", "button");
    calendarEvent.setAttribute("aria-label", `Open flyer for ${eventTitle}`);

    calendarEvent.addEventListener("click", () => openCalendarFlyer(calendarEvent));
    calendarEvent.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        openCalendarFlyer(calendarEvent);
      }
    });
  }

  if (calendarEventDetails && canAddSingleDate) {
    const addButton = document.createElement("button");
    addButton.className = "calendar-download calendar-event-download";
    addButton.type = "button";
    addButton.textContent = "Add date";
    addButton.setAttribute("aria-label", `Add ${eventTitle} to calendar`);
    addButton.addEventListener("click", (event) => {
      event.stopPropagation();

      if (shouldOpenCalendarFileDirectly()) {
        openStaticCalendar(calendarFileNameForEvent(calendarEventDetails));
        return;
      }

      downloadCalendar([calendarEventDetails], `SOC ${eventTitle}`);
    });
    addButton.addEventListener("keydown", (event) => {
      event.stopPropagation();
    });
    calendarEvent.querySelector("div")?.append(addButton);
  }
});
