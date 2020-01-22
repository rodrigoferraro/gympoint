/*
import Student from '../models/Student';
*/
import { Op } from 'sequelize';
import * as Yup from 'yup';
import { parseISO, startOfDay, addMonths } from 'date-fns';
import Membership from '../models/Membership';
import Option from '../models/Option';
import Student from '../models/Student';

class MembershipController {
  /*
  Lista todos os alunos associados
  * */
  async index(req, res) {
    const { student_id, option_id } = req.body;
    const filter = {};

    if (student_id) {
      filter.student_id = student_id;
    }
    if (option_id) {
      filter.option_id = option_id;
    }

    const { page = 1, recs = 20 } = req.query;

    const memberships = await Membership.findAll({
      attributes: ['start_date', 'end_date', 'price'],
      where: filter,
      limit: recs,
      offset: page > 0 ? (page - 1) * recs : 0,
      order: [['student', 'nome', 'ASC']],
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['nome', 'email'],
        },
        {
          model: Option,
          as: 'option',
          attributes: ['title', 'duration', 'price'],
        },
      ],
    });

    return res.json({ memberships });
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

    let membership = await Membership.findOne({
      where: {
        student_id,
        [Op.or]: [
          {
            start_date: {
              [Op.lte]: new_start_date,
            },
            end_date: {
              [Op.gte]: new_start_date,
            },
          },
          {
            start_date: {
              [Op.lte]: new_end_date,
            },
            end_date: {
              [Op.gte]: new_end_date,
            },
          },
        ],
      },
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['nome'],
        },
      ],
    });

    if (membership) {
      return res.status(418).json({
        error: `Já existe um plano válido para ${membership.student.nome} entre ${membership.start_date_fmtd} e ${membership.end_date_fmtd}.`,
      });
    }

    const price = parseFloat(option.price * option.duration).toFixed(2);

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
    const new_start_date = startOfDay(parseISO(req.body.start_date));

    const membership = await Membership.findOne({
      where: { student_id, option_id },
    });

    if (!membership) {
      return res.status(401).json({
        error: `Membership for student ${student_id} with option ${option_id} was not found`,
      });
    }

    if (membership.start_date === new_start_date) {
      return res.status(401).json({
        message: 'Nothing to update, new start date is equal actual start date',
      });
    }

    const option = await Option.findByPk(option_id);

    const new_end_date = addMonths(new_start_date, option.duration);

    membership.start_date = new_start_date;
    membership.end_date = new_end_date;

    membership.save();

    return res.json({ membership });
  }

  /*
  Remove um plano informado
  * */
  async delete(req, res) {
    const membership = await Membership.findByPk(
      parseInt(req.params.membership_id, 10)
    );

    if (membership) {
      await Membership.destroy({ where: { id: membership.id } });

      return res.json({
        message: 'Membership successfully deleted',
        membership,
      });
    }

    return res
      .status(401)
      .json({ message: 'Could not delete membership. Not found.' });
  }
}

export default new MembershipController();
