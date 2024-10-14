"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("users", {
      id: {
        field: "id",
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      username: {
        field: "username",
        type: Sequelize.STRING,
      },
      email: {
        field: "email",
        type: Sequelize.STRING,
      },
      password: {
        field: "password",
        type: Sequelize.STRING,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
    await queryInterface.createTable("presentations", {
      id: {
        field: "id",
        primaryKey: true,
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
      },
      presentationName: {
        field: "presentationName",
        type: Sequelize.STRING,
      },
      createdBy: {
        field: "createdBy",
        type: Sequelize.INTEGER,
        references: {
          model: "users",
          key: "id",
        },
      },
      thumbnail: {
        field: "thumbnail",
        type: Sequelize.STRING,
      },

      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropAllTables();
  },
};
