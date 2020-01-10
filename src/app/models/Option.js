import Sequelize, { Model } from 'sequelize';

class Option extends Model {
  static init(sequelize) {
    super.init(
      {
        title: Sequelize.STRING,
        duration: Sequelize.INTEGER,
        price: Sequelize.DECIMAL(6, 2),
      },
      {
        sequelize,
      }
    );
    return this;
  }
}

export default Option;
