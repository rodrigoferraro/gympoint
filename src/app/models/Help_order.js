import Sequelize, { Model } from 'sequelize';

class Help_order extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER, // referência ao aluno
        question: Sequelize.TEXT, // referência ao plano que escolheu
        answer: Sequelize.TEXT, // data de início da matrícula
        answered_at: Sequelize.DATEONLY, // data de término da matrícula
      },
      {
        sequelize,
      }
    );
    return this;
  }

  static associate(models) {
    this.belongsTo(models.Student, { foreignKey: 'student_id', as: 'student' });
  }
}

export default Help_order;
