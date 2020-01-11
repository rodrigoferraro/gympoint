/*
import * as Yup from 'yup';

import Student from '../models/Student';
*/
import { Op } from 'sequelize';
import { parseISO, startOfDay, addMonths } from 'date-fns';
import Membership from '../models/Membership';
import Option from '../models/Option';

class MembershipController {
  /*
  Lista todos os alunos associados
  * */
  async index(req, res) {
    /*
    const { page = 1, recs = 20 } = req.query;

    const memberships = await Membership.findAll({
      where: {},
      order: ['duration'],
      attributes: ['id', 'title', 'duration', 'price'],
      limit: recs,
      offset: page > 0 ? (page - 1) * recs : 0,
    });

    return res.json(memberships);
*/
    return res.json({ message: 'Membership Index' });
  }

  /*
  Cria uma associação entre Aluno e Planos
  * */
  async store(req, res) {
    const student_id = parseInt(req.params.student_id, 10);
    const option_id = parseInt(req.params.option_id, 10);

    const option = await Option.findByPk(option_id);

    const start_date = startOfDay(parseISO(req.body.start_date));
    const end_date = addMonths(start_date, option.duration);

    const today = startOfDay(new Date());

    const date_overlap = await Membership.findOne({
      where: {
        student_id,
        start_date: {
          [Op.lt]: today,
        },
        end_date: {
          [Op.and]: {
            [Op.gt]: today,
            [Op.gt]: start_date,
          },
        },
      },
    });

    if (date_overlap) {
      return res.Status(401).json({
        message: `Student already member with option ${date_overlap.option_id} until ${date_overlap.end_date}`,
      });
    }

    // const price = parseFloat(option.price * option.duration).toFixed(2);

    let membership = null;

    try {
      membership = await Membership.create({
        student_id: 2,
        option_id: 6,
        start_date,
        end_date,
        price: 234.0,
      });
    } catch (error) {
      console.log(error);
    }

    return res.json({ membership });

    /*
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails. All fields required.' });
    }

    const { duration } = req.body;
    const durationExists = await Option.findOne({
      where: { duration },
    });

    if (durationExists) {
      return res
        .status(400)
        .json({ error: 'An option with same duration already exists.' });
    }

    const { title, price } = await Option.create(req.body);

    return res.json({
      title,
      duration,
      price,
    });
*/
    return res.json({ message: 'Membership Store' });
  }

  /*
  Atualiza uma associação entre Aluno e Plano
  * */
  async update(req, res) {
    /*
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res
        .status(400)
        .json({ error: 'Validation fails. All fields required.' });
    }

    const option = await Option.findByPk(req.params.id);

    const newDuration = req.body.duration || option.duration;

    if (newDuration !== option.duration) {
      const newDurationExists = await Option.findOne({
        where: { newDuration },
      });

      if (newDurationExists) {
        return res.status(400).json({
          error:
            "Duration cannot be modified. It's allowed modify just Title and Price",
        });
      }
    }

    const { id, title, price } = await option.update(req.body);

    return res.json({
      id,
      title,
      duration: newDuration,
      price,
    });
*/
    return res.json({ message: 'Membership Update' });
  }

  /*
  Remove um plano informado
  * */
  async delete(req, res) {
    /*
    const option = await Option.findByPk(req.params.id);
    const today = new Date();

    if (option) {
      const memberWithOption = await Membership.findOne({
        where: {
          option_id: option.id,
          end_date: {
            [Op.gt]: today,
          },
        },
      });

      if (memberWithOption) {
        return res.json({
          error:
            'You may not delete an option if there is any valid membership still associated with it.',
        });
      }
    }

    Option.destroy({ where: { id: option.id } });

    return res.json({ message: 'Option successfully deleted', option });
*/
    return res.json({ message: 'Membership Delete' });
  }
}

export default new MembershipController();
