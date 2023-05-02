'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.bulkInsert('Roles', [{
      name: 'Admin',
      description: 'The application administrator role.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Manager',
      description: 'The team manager role.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Volunteer',
      description: 'The team volunteer role.',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    ], {});

  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Roles', {
      name: {
        [Sequelize.Op.in]: ['Admin', 'Team Manager', 'Volunteer']
      }
    }, {});
  }
};
