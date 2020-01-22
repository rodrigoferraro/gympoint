import Sequelize, { Model } from 'sequelize';
import { format } from 'date-fns';
import pt from 'date-fns/locale/pt';

class Membership extends Model {
  static init(sequelize) {
    super.init(
      {
        student_id: Sequelize.INTEGER, // referência ao aluno
        option_id: Sequelize.INTEGER, // referência ao plano que escolheu
        start_date: Sequelize.DATE, // data de início da matrícula
        end_date: Sequelize.DATE, // data de término da matrícula
        price: Sequelize.DECIMAL(6, 2), // preço total calculado no momento da matrícula
        start_date_fmtd: {
          type: Sequelize.VIRTUAL,
          get() {
            return format(this.start_date, "dd'/'MM'/'yyyy", {
              locale: pt,
            });
          },
        },
        end_date_fmtd: {
          type: Sequelize.VIRTUAL,
          get() {
            return format(this.end_date, "dd'/'MM'/'yyyy", {
              locale: pt,
            });
          },
        },
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
