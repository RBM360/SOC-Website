const navToggle = document.querySelector(".nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });
}

document.querySelectorAll("[data-year]").forEach((node) => {
  node.textContent = new Date().getFullYear();
});

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
    .find((event) => event.date >= todayStart);
}

function formatEventDate(date) {
  const month = date.toLocaleDateString(undefined, { month: "short" });
  const weekday = date.toLocaleDateString(undefined, { weekday: "short" });
  return `${month}<br>${weekday}`;
}

document.querySelectorAll("[data-event-card]").forEach((card) => {
  const event = getNextEvent(eventSchedules[card.dataset.eventCard] || []);

  if (!event) {
    card.querySelector("[data-event-title]").textContent = "Semester schedule complete";
    card.querySelector("[data-event-description]").textContent = "Check Instagram for the latest updates.";
    card.querySelector("[data-event-day]").textContent = "--";
    card.querySelector("[data-event-date]").textContent = "Done";
    card.querySelector("[data-event-location]").textContent = "@ttu_soc";
    return;
  }

  card.querySelector("[data-event-title]").textContent = event.title;
  card.querySelector("[data-event-description]").textContent = event.description;
  card.querySelector("[data-event-day]").textContent = event.date.getDate();
  card.querySelector("[data-event-date]").innerHTML = formatEventDate(event.date);
  card.querySelector("[data-event-location]").textContent = event.location;
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
    <img alt="">
  `;
  document.body.append(dialog);

  dialog.querySelector(".flyer-dialog-close").addEventListener("click", () => dialog.close());
  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      dialog.close();
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
    dialog.showModal();
  });
});
