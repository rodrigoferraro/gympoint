/*
import Student from '../models/Student';
import { Op } from 'sequelize';
*/
import * as Yup from 'yup';
import { parseISO, startOfDay, addMonths } from 'date-fns';
import Membership from '../models/Membership';
import Option from '../models/Option';

class MembershipController {
  /*
  Lista todos os alunos associados
  * */
  async index(req, res) {
    return res.json({ message: 'Membership Index' });
  }

  /*
  Cria uma associação entre Aluno e Planos
  * */
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.string().required(),
      option_id: Yup.string().required(),
      start_date: Yup.string().required(),
    });

    const data = {
      student_id: req.params.student_id,
      option_id: req.params.option_id,
      start_date: req.body.start_date,
    };

    if (!(await schema.isValid(data))) {
      return res
        .status(400)
        .json({ error: 'Validation fails. All fields required.' });
    }

    const student_id = parseInt(req.params.student_id, 10);
    const option_id = parseInt(req.params.option_id, 10);

    const option = await Option.findByPk(option_id);

    const new_start_date = startOfDay(parseISO(req.body.start_date));
    const new_end_date = addMonths(new_start_date, option.duration);

    const price = parseFloat(option.price * option.duration).toFixed(2);

    let membership = null;

    try {
      membership = await Membership.create({
        student_id,
        option_id,
        start_date: new_start_date,
        end_date: new_end_date,
        price,
      });
    } catch (error) {
      console.log(error);
    }

    return res.json({ membership });
  }

  /*
  Atualiza uma associação entre Aluno e Plano
  * */
  async update(req, res) {
    return res.json({ message: 'Membership Update' });
  }

  /*
  Remove um plano informado
  * */
  async delete(req, res) {
    return res.json({ message: 'Membership Delete' });
  }
}

export default new MembershipController();
