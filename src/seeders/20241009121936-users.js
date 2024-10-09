"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("users", [
      {
        id: 1,
        username: "test1234",
        email: "test1234@gmail.com",
        password: "1234",

        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        username: "test5678",
        email: "test5678@gmail.com",
        password: "5678",
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete("users", null, {});
  },
};
