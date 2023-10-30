const mongoose = require("mongoose");
const { isPast, isFuture, isToday , differenceInDays , parseISO} = require("date-fns");

const Booking = require("../models/bookings");
const Cabin = require("../models/cabins");
const Guest = require("../models/guests");
const Setting = require("../models/settings");

const cabins = require("./data/cabins");
const guests = require("./data/guests");
const bookings = require("./data/bookings");

mongoose
  .connect("mongodb://127.0.0.1:27017/WildOasis")
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

const subtractDates = (dateStr1, dateStr2) =>
  differenceInDays(parseISO(String(dateStr1)), parseISO(String(dateStr2)))

const seedDB = async () => {
  // await Guest.deleteMany({});
  // await Cabin.deleteMany({});
  // await Setting.deleteMany({});
  await Booking.deleteMany({});

  // await Cabin.insertMany(cabins);
  // await Guest.insertMany(guests);

  bookings.forEach(async (booking) => {
    const guest = (await Guest.aggregate([{ $sample: { size: 1 } }]))[0];
    const cabin = (await Cabin.aggregate([{ $sample: { size: 1 } }]))[0];

    const numNights = subtractDates(booking.endDate, booking.startDate);
    const cabinPrice = numNights * (cabin.regularPrice - cabin.discount);
    const extrasPrice = booking.hasBreakfast
      ? numNights * 15 * booking.numGuests
      : 0; // hardcoded breakfast price
    const totalPrice = cabinPrice + extrasPrice;

    let status;
    if (
      isPast(new Date(booking.endDate)) &&
      !isToday(new Date(booking.endDate))
    )
      status = "checked-out";
    if (
      isFuture(new Date(booking.startDate)) ||
      isToday(new Date(booking.startDate))
    )
      status = "unconfirmed";
    if (
      (isFuture(new Date(booking.endDate)) ||
        isToday(new Date(booking.endDate))) &&
      isPast(new Date(booking.startDate)) &&
      !isToday(new Date(booking.startDate))
    )
      status = "checked-in";
    const newBooking = new Booking(booking);
    newBooking.guest = guest;
    newBooking.cabin = cabin;
    newBooking.status = status;
    newBooking.totalPrice = totalPrice;
    newBooking.cabinPrice = cabinPrice;
    newBooking.extrasPrice = extrasPrice;
    newBooking.numNights = numNights;
    await newBooking.save();
  });
}

seedDB()
// .then(() => {
//   mongoose.connection.close();
// });