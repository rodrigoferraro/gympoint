import * as Yup from 'yup';
import { Op } from 'sequelize';

import Option from '../models/Option';
import Membership from '../models/Membership';

class OptionController {
  /*
  Lista todos os planos existentes
  * */
  async index(req, res) {
    const { page = 1, recs = 20 } = req.query;

    const options = await Option.findAll({
      where: {},
      order: ['duration'],
      attributes: ['id', 'title', 'duration', 'price'],
      limit: recs,
      offset: page > 0 ? (page - 1) * recs : 0,
    });

    return res.json(options);
  }

  /*
  Armazena um plano para se tornar membro da academia
  * */
  async store(req, res) {
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
  }

  /*
  Armazena um plano para se tornar membro da academia
  * */
  async update(req, res) {
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
  }

  /*
  Remove um plano informado
  * */
  async delete(req, res) {
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
  }
}

export default new OptionController();
