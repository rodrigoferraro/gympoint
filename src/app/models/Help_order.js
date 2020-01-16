import Sequelize, { Model } from 'sequelize';

class Help_order extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER, // referência ao aluno
        question: Sequelize.TEXT, // pedido de auxílio
        answer: Sequelize.TEXT, // resposta ao pedido
        answered_at: Sequelize.DATEONLY, // data da resposta
        canceled_at:
          Sequelize.DATE /** data de exclusão, caso tenha sido respondida 
                 (fica um histórico para a academia, mas o aluno não vê mais). 
          Caso não tenha sido respondida, ocorre a real exclusão do registro
        */,
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
