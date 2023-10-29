const mongoose = require("mongoose");

const Booking = require("./models/bookings");
const Cabin = require("./models/cabins");
const Guest = require("./models/guests");
const Setting = require("./models/settings");

mongoose
  .connect("mongodb://127.0.0.1:27017/WildOasis")
  .then(() => {
    console.log("Mongoose Running");
  })
  .catch((e) => {
    console.log(e);
  });

const seedDB = async () => {
  await Guest.deleteMany({});
  // await Cabin.deleteMany({});
  await Booking.deleteMany({});
  // await Setting.deleteMany({});
  const guest = new Guest({
    fullName: "John Doe",
    email: "text@gmail.com",
  });
  await guest.save();

  // const cabin = new Cabin({
  //   name: "001",
  //   maxCapacity: 2,
  //   discount: 50,
  //   description: "This is a cabin",
  //   regularPrice: 250,
  //   image:
  //     "https://nqecmmwdoyvwwbyqcmyc.supabase.co/storage/v1/object/public/cabin-images/cabin-001.jpg",
  // });
  // await cabin.save();

  const cabin = await Cabin.findOne({name : "001"})

  const booking = new Booking({
    startDate: new Date(),
    endDate: new Date(),
    numberNights: 3,
    numberGuests: 2,
    cabinPrice: 250,
    extrasPrice: 0,
    totalPrice: 250,
    status: "pending",
    hasBreakfast: false,
    isPaid: false,
    observations: "This is a booking",
  });
  booking.guest = guest;
  booking.cabin = cabin;
  await booking.save();

  // const setting = new Setting({
  //   minBookingLength: 3,
  //   maxBookingLength: 90,
  //   maxGuestsPerBooking: 8,
  //   breakfastPrice: 15,
  // });
  // await setting.save();
};

seedDB().then(() => {
  mongoose.connection.close();
});
