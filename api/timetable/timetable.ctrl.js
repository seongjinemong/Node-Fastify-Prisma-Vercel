import prisma from "../lib/db.js";

// * Get all timetable of user
async function getTimetable(req, res) {
  // Check if user is authenticated
  if (!req.session.authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  // Find user by email
  let user;

  try {
    user = await prisma.user.findUnique({
      where: { email: req.session.user },
    });
  } catch (error) {
    return res.status(500).type("json").send("Can't find user");
  }

  let timetable;
  try {
    timetable = await prisma.calendar.findMany({
      where: { authorId: user.id },
    });
  } catch (error) {
    return res.status(500).type("json").send("No timetable found");
  }

  return res.status(200).type("json").send(timetable[0]);
}

// * Update timetable of user
async function updateTimetable(req, res) {
  // Check if user is authenticated
  if (!req.session.authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const { timetable } = req.body;
  const email = req.session.user;
  let user;

  // Find user by email
  try {
    user = await prisma.user.findUnique({
      where: { email },
    });
  } catch (error) {
    return res.status(500).type("json").send("Can't find user");
  }

  // find calendar by authorId
  let calendar;
  try {
    calendar = await prisma.calendar.findMany({ where: { authorId: user.id } });
  } catch (error) {
    return res.status(500).type("json").send("Can't find calendar");
  }

  // if calendar is not exist, create new calendar
  if (calendar.length === 0) {
    try {
      calendar = await prisma.calendar.create({
        data: { data: timetable, authorId: user.id, year: 0, month: 0 },
      });
    } catch (error) {
      return res.status(500).type("json").send("Can't create calendar");
    }
  } else {
    try {
      calendar = await prisma.calendar.update({
        where: { id: calendar[0].id },
        data: { data: timetable },
      });
    } catch (error) {
      return res.status(500).type("json").send("Can't update calendar");
    }
  }

  return res.status(200).type("json").send(calendar);
}

// * Get timetable of user
async function getTimetablewithUserId(req, res) {
  // Check if user is authenticated
  if (!req.session.authenticated) {
    return res.status(401).type("json").send("Unauthorized");
  }

  const { id } = req.params;
  const user_email = req.session.user;

  // Check if user is a friend of the user with the specified id
  let isFriend;
  try {
    isFriend = await prisma.user.findFirst({
      where: {
        email: user_email,
        friends: {
          some: { id: parseInt(id) },
        },
      },
    });
  } catch (error) {
    return res.status(500).type("json").send("Error checking friendship");
  }

  if (!isFriend) {
    return res
      .status(401)
      .type("json")
      .send("You are not friend with this user");
  }

  // get timetable of id
  let timetable;
  try {
    timetable = await prisma.calendar.findMany({
      where: { authorId: parseInt(id) },
    });
  } catch (error) {
    return res
      .status(500)
      .type("json")
      .send("Can't find timetable of this user");
  }

  return res.status(200).type("json").send(timetable[0]);
}

export { getTimetable, updateTimetable, getTimetablewithUserId };
