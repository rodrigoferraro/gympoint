import Sequelize, { Model } from 'sequelize';

class Membership extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER, // referência ao aluno
        option_id: Sequelize.INTEGER, // referência ao plano que escolheu
        start_date: Sequelize.DATE, // data de início da matrícula
        end_date: Sequelize.DATE, // data de término da matrícula
        price: Sequelize.DECIMAL(6, 2), // preço total calculado no momento da matrícula
        created_at: Sequelize.DATE,
        updated_at: Sequelize.DATE,
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
    this.belongsTo(models.Option, { foreignKey: 'option_id', as: 'option' });
  }
}

export default Membership;
