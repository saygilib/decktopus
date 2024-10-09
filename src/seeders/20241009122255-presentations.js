"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert("presentations", [
      {
        id: 1,
        presentationName: "presentation1",
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 2,
        presentationName: "presentation2",
        createdBy: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        id: 3,
        presentationName: "presentation3",
        createdBy: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('presentations', null, {});
  },
};
