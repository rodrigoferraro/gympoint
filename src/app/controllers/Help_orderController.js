/*
import { Op } from 'sequelize';
import { parseISO, startOfDay, addMonths } from 'date-fns';
*/
import * as Yup from 'yup';
import Help_order from '../models/Help_order';
import Student from '../models/Student';

class Help_orderController {
  /*
  Lista todos os pedidos de auxílio sem resposta
  * */
  async unanswered(req, res) {
    const { page = 1, recs = 20 } = req.query;

    const opened_help_orders = await Help_order.findAll({
      attributes: ['question', 'answer', 'answered_at'],
      where: { answered_at: null },
      order: [
        ['created_at', 'DESC'],
        ['student', 'nome', 'ASC'],
      ],
      limit: recs,
      offset: page > 0 ? (page - 1) * recs : 0,
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['nome', 'email'],
        },
      ],
    });

    return res.json({ opened_help_orders });
  }

  /**
   * Lista todos os pedidos de auxílio do aluno informado
   */
  async index(req, res) {
    const student_id = parseInt(req.params.student_id, 10);

    const student_help_orders = await Help_order.findAll({
      attributes: ['question', 'answer', 'answered_at'],
      where: { id: student_id },
      order: [['created_at', 'DESC']],
    });

    res.json({ student_help_orders });
  }

  /*
  Cria uma solicitação de auxílio para o aluno informado
  * */
  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      question: Yup.string().required(),
    });

    const student_id = parseInt(req.params.student_id, 10);

    const data = {
      student_id,
      question: req.body.question,
    };

    if (!(await schema.isValid(data))) {
      return res
        .status(400)
        .json({ error: 'Validation fails. You need to make a question.' });
    }

    const help_order = await Help_order.create(data);

    return res.json({ help_order });
  }

  /*
  Atualiza a solicitação de auxílio informada para o aluno informado
  ==> basicamente pode atualizar somente a pergunta
  * */
  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .integer()
        .required(),
      question: Yup.string().required(),
    });

    const student_id = parseInt(req.params.student_id, 10);

    const data = {
      student_id,
      question: req.body.question,
    };

    if (!(await schema.isValid(data))) {
      return res
        .status(400)
        .json({ error: 'Validation fails. You need to make a question.' });
    }

    const help_order = await Help_order.findOne({
      where: { student_id },
    });

    if (!help_order) {
      return res.status(401).json({
        error: `Help order for student ${student_id} was not found`,
      });
    }

    help_order.question = data.question;
    help_order.save();

    return res.json({ help_order });
  }
}

export default new Help_orderController();
