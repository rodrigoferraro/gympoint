/* eslint-disable no-unused-vars */
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('memberships', {
      // unique identifier for row
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
      },
      // who is the student becomes member
      student_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'students', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      // what option he'd choosen
      option_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: { model: 'options', key: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      },
      // when membership starts
      // - student can chose the best appropriated date for him
      start_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // when membership ends
      // - calculated in accordance of choosen option
      end_date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      // calculated total price in accordance of choosen option
      price: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      updated_at: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('memberships');
  },
};
