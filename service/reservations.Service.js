const Tables = require("./models/Tables");
const Reservations = require("./models/Reservations");
const Users = require("./models/Users");

async function getTablesData() {
  try {
    const tables = await Tables.find().lean();
    const populatedTables = await Promise.all(
      tables.map(async (table) => {
        const reservations = await Reservations.find({
          "tables.table": table._id,
        })
          .populate("customer", "fullname")
          .lean();

        table.reservations = reservations.map((reservation) => ({
          time: reservation.arrivalTime.toLocaleTimeString("en-US", {
            hour: "numeric",
            minute: "numeric",
          }),
          customer: reservation.customer.fullname,
        }));

        return table;
      })
    );

    const formattedTables = populatedTables.map((table) => ({
      id: table._id,
      name: `Table ${table.tableNumber}`,
      seats: table.capacity,
      description: `description ${table.tableNumber}`,
      reservations: table.reservations,
    }));

    console.log(formattedTables);
    return formattedTables;
  } catch (error) {
    console.error(error);
  }
}

getTablesData();
