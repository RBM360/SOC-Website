import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const root = process.cwd();
const calendarDirectory = join(root, "assets", "calendars");
const semesterYear = 2026;
const socHouseAddress = "1201 Virginia Ave, Cookeville, TN";
const sycamoreAddress = "1144 Crescent Drive, Cookeville, TN";

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
  }
};

const weekOfWelcomeEvents = [
  ["Move-in Day Walk to Ralph's Donuts", "2026-08-13", "19:00", "20:00", socHouseAddress, "Week of Welcome with SOC Campus Ministry."],
  ["SOC Open House", "2026-08-14", "18:00", "20:00", socHouseAddress, "Pizza and games at the SOC House."],
  ["Religious Fair on Campus", "2026-08-15", "11:00", "13:00", "Tennessee Tech campus", "Meet SOC during Week of Welcome."],
  ["Volleyball and Dirty Sodas", "2026-08-15", "19:00", "21:00", "Sycamore Church Gym, 1144 Crescent Drive, Cookeville, TN", "Week of Welcome volleyball and dirty sodas."],
  ["Sunday Worship", "2026-08-16", "09:00", "10:00", sycamoreAddress, "Sunday worship with Sycamore Church of Christ."],
  ["Sunday Bible Class", "2026-08-16", "10:15", "11:00", sycamoreAddress, "Sunday Bible class with SOC and Sycamore."],
  ["Sunday Evening Worship", "2026-08-16", "17:00", "18:00", sycamoreAddress, "Sunday evening worship with Sycamore Church of Christ."],
  ["Cane Creek Park Cookout and Disc Golf", "2026-08-17", "17:00", "19:00", "Cane Creek Park, Cookeville, TN", "Week of Welcome cookout and disc golf."],
  ["Campbellball", "2026-08-18", "18:00", "20:00", socHouseAddress, "Campbellball with hot dogs, popcorn, and drinks."],
  ["Morning Hike", "2026-08-19", "09:00", "10:30", socHouseAddress, "Week of Welcome morning hike."],
  ["Mix n Mingle", "2026-08-19", "15:00", "17:00", "Tennessee Tech campus", "Meet other students during Week of Welcome."],
  ["Bible Study", "2026-08-19", "18:30", "19:30", sycamoreAddress, "Bible study with ice cream after class."],
  ["First Day of Classes", "2026-08-20", null, null, "Tennessee Tech campus", "First day of classes at Tennessee Tech."],
  ["TTU Women's Soccer Game", "2026-08-20", "19:00", "21:00", "Tennessee Tech campus", "Week of Welcome soccer game."],
  ["Fresh Getaway", "2026-08-21", "18:00", "23:00", socHouseAddress, "Fresh Getaway mini-retreat for new students."]
].map(([title, date, startTime, endTime, location, description]) => ({
  title,
  date,
  startTime,
  endTime,
  location,
  description,
  allDay: !startTime
}));

function decodeHtml(text = "") {
  return text
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&ldquo;|&rdquo;/g, '"')
    .replace(/&lsquo;|&rsquo;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .trim();
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

function foldCalendarLine(line) {
  const characters = Array.from(line);
  const chunks = [];

  while (characters.length > 73) {
    chunks.push(characters.splice(0, 73).join(""));
  }

  chunks.push(characters.join(""));
  return chunks.map((chunk, index) => (index === 0 ? chunk : ` ${chunk}`)).join("\r\n");
}

function slugifyFileName(text) {
  return text.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") || "soc-event";
}

function calendarFileNameForEvent(event) {
  return `${event.date}-${slugifyFileName(event.title)}.ics`;
}

function getActivityGroup(className, title, description) {
  const text = `${title} ${description}`.toLowerCase();

  if (className.includes("break") || className.includes("cancelled")) {
    return null;
  }

  if (className.includes("refuel")) {
    return "refuel";
  }

  if (className.includes("meal")) {
    return "lunch";
  }

  if (className.includes("singing")) {
    return "singing";
  }

  if (className.includes("connections")) {
    return "connections";
  }

  if (className.includes("special")) {
    return "special";
  }

  if (text.includes("wednesday")) {
    return "wednesday";
  }

  if (text.includes("sunday")) {
    return "sunday";
  }

  return null;
}

function eventFromArticle(article) {
  const className = article.match(/class="([^"]+)"/)?.[1] || "";
  const date = article.match(/<time datetime="([^"]+)"/)?.[1];
  const title = decodeHtml(article.match(/<h3>([\s\S]*?)<\/h3>/)?.[1]);
  const paragraph = decodeHtml(article.match(/<p>([\s\S]*?)<\/p>/)?.[1]);
  const group = getActivityGroup(className, title, paragraph);

  if (!date || !title || !group) {
    return null;
  }

  const defaults = activityCalendarDefaults[group];
  return {
    title,
    date,
    endDate: article.match(/data-end-date="([^"]+)"/)?.[1],
    allDay: defaults.allDay && !article.includes("data-start-time="),
    startTime: article.match(/data-start-time="([^"]+)"/)?.[1] || defaults.startTime,
    endTime: article.match(/data-end-time="([^"]+)"/)?.[1] || defaults.endTime,
    location: article.match(/data-location="([^"]+)"/)?.[1] || defaults.location,
    description: `${paragraph}. From the SOC Campus Ministry semester schedule.`
  };
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
  ].map(foldCalendarLine).join("\r\n");
}

function buildCalendar(events, name) {
  const headerLines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//SOC Campus Ministry//SOC Website//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    `X-WR-CALNAME:${escapeCalendarText(name)}`,
    "X-WR-TIMEZONE:America/Chicago"
  ].map(foldCalendarLine);

  return [
    ...headerLines,
    ...events.map(buildCalendarEvent),
    "END:VCALENDAR",
    ""
  ].join("\r\n");
}

const activitiesHtml = readFileSync(join(root, "activities.html"), "utf8");
const semesterEvents = Array.from(activitiesHtml.matchAll(/<article class="calendar-event[\s\S]*?<\/article>/g))
  .map(([article]) => eventFromArticle(article))
  .filter(Boolean);

mkdirSync(calendarDirectory, { recursive: true });

writeFileSync(
  join(calendarDirectory, "soc-fall-semester-calendar-2026.ics"),
  buildCalendar(semesterEvents, "SOC Fall Semester Calendar 2026")
);

writeFileSync(
  join(calendarDirectory, "soc-week-of-welcome-2026.ics"),
  buildCalendar(weekOfWelcomeEvents, "SOC Week of Welcome 2026")
);

const weekOfWelcomeEventsByDate = new Map();

for (const event of weekOfWelcomeEvents) {
  weekOfWelcomeEventsByDate.set(event.date, [
    ...(weekOfWelcomeEventsByDate.get(event.date) || []),
    event
  ]);
}

for (const [date, events] of weekOfWelcomeEventsByDate) {
  writeFileSync(
    join(calendarDirectory, `soc-week-of-welcome-2026-${date}.ics`),
    buildCalendar(events, `SOC Week of Welcome ${date}`)
  );
}

for (const event of [...semesterEvents, ...weekOfWelcomeEvents]) {
  writeFileSync(
    join(calendarDirectory, calendarFileNameForEvent(event)),
    buildCalendar([event], event.title)
  );
}

console.log(`Wrote ${semesterEvents.length + weekOfWelcomeEvents.length + 2} calendar files.`);
