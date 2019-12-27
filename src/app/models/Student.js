import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        nome: Sequelize.STRING,
        email: Sequelize.STRING,
        idade: Sequelize.INTEGER,
        peso: Sequelize.DECIMAL(5, 2),
        altura: Sequelize.DECIMAL(5, 2),
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Student;
