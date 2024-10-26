import {
  getTimetable,
  updateTimetable,
  getTimetablewithId,
} from "./timetable.ctrl.js";

export default async function (app) {
  // * getTimetable
  app.get("/", getTimetable);

  // * updateTimetable
  app.post("/", updateTimetable);

  // * getTimetablewithId
  app.get("/:id", getTimetablewithId);
}
