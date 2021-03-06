/*
import { Op } from 'sequelize';
import { parseISO, startOfDay, addMonths } from 'date-fns';
*/
import * as Yup from 'yup';
import Queue from '../../lib/Queue';

import Help_order from '../models/Help_order';
import Student from '../models/Student';
import NotifyAnswer from '../jobs/NotifyAnswer';

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
    const { page = 1, recs = 20 } = req.query;
    const student_id = parseInt(req.params.student_id, 10);

    const student_help_orders = await Help_order.findAll({
      attributes: ['question', 'answer', 'answered_at'],
      where: { id: student_id, canceled_at: null },
      order: [['created_at', 'DESC']],
      limit: recs,
      offset: page > 0 ? (page - 1) * recs : 0,
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

  /*
  Academia responde ao pedido de auxílio.
  Email com resposta é enviado ao aluno.
  * */
  async answer(req, res) {
    const schema = Yup.object().shape({
      help_order_id: Yup.number()
        .integer()
        .required(),
      answer: Yup.string().required(),
    });

    const data = {
      help_order_id: parseInt(req.params.help_order_id, 10),
      answer: req.body.answer,
    };

    if (!(await schema.isValid(data))) {
      return res.status(400).json({ error: 'Validation fails.' });
    }

    const help_order = await Help_order.findByPk(data.help_order_id, {
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['nome', 'email'],
        },
      ],
    });

    if (!help_order) {
      return res.status(401).json({
        error: `Help order not found`,
      });
    }

    help_order.answer = data.answer;
    help_order.answered_at = new Date();
    help_order.save();

    await Queue.add(NotifyAnswer.key, {
      help_order,
    });

    return res.json({
      message: 'An email with the answer had been sent to the student',
      help_order,
    });
  }
}

export default new Help_orderController();
