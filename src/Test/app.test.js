const {
  availableNotAvailable,
  getWithCapacity,
} = require("../service/table.Service");
const createError = require("http-errors");
describe("availableNotAvailable", () => {
  it("should throw an error when the table number is not found", async () => {
    // Mock the dependencies
    const _Table = {
      findOne: jest.fn().mockResolvedValue(null),
    };

    // Mock the input data
    const inputData = {
      tableNumber: "T001",
    };

    // Call the availableNotAvailable function and expect it to throw an error
    await expect(
      availableNotAvailable(inputData, _Table, createError)
    ).rejects.toThrow(
      createError(404, "Cannot Update Table With TableNumber: T001!")
    );
  });
});

describe("getWithCapacity", () => {
  it("should return tables with the specified capacity", async () => {
    // Mock the dependencies
    const _Table = {
      find: jest.fn().mockReturnThis(),
      distinct: jest.fn().mockResolvedValue([1, 2]),
      findOne: jest
        .fn()
        .mockResolvedValueOnce({
          tableNumber: 1,
          capacity: 4,
          status: "available",
        })
        .mockResolvedValueOnce({
          tableNumber: 2,
          capacity: 4,
          status: "unavailable",
        }),
    };

    // Mock the input data
    const inputData = {
      capacity: 4,
    };

    // Call the getWithCapacity function
    const result = await getWithCapacity(inputData, _Table, createError);

    // Assert the result
    expect(_Table.find).toHaveBeenCalledTimes(1);
    expect(_Table.distinct).toHaveBeenCalledTimes(1);
    expect(_Table.findOne).toHaveBeenCalledTimes(2);
    expect(_Table.findOne).toHaveBeenCalledWith(
      { tableNumber: 1 },
      { tableNumber: 1, capacity: 1, _id: 0, status: 1 }
    );
    expect(_Table.findOne).toHaveBeenCalledWith(
      { tableNumber: 2 },
      { tableNumber: 1, capacity: 1, _id: 0, status: 1 }
    );
    expect(result).toEqual([
      { tableNumber: 1, capacity: 4, status: "available" },
      { tableNumber: 2, capacity: 4, status: "unavailable" },
    ]);
  });

  it("should return an empty array when no tables are found with the specified capacity", async () => {
    // Mock the dependencies
    const _Table = {
      find: jest.fn().mockReturnThis(),
      distinct: jest.fn().mockResolvedValue([]),
    };

    // Mock the input data
    const inputData = {
      capacity: 4,
    };

    // Call the getWithCapacity function
    const result = await getWithCapacity(inputData, _Table, createError);

    // Assert the result
    expect(_Table.find).toHaveBeenCalledTimes(1);
    expect(_Table.distinct).toHaveBeenCalledTimes(1);
    expect(result).toEqual([]);
  });
});
