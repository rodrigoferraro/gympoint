import * as Yup from 'yup';
import { startOfDay, subDays } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const student_id = parseInt(req.params.student_id, 10);

    const Checkins = await Checkin.findAll({
      where: { student_id },
      order: [['created_at', 'DESC']],
    });

    return res.json({
      Checkins,
    });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number()
        .required()
        .positive()
        .integer(),
    });

    const student_id = parseInt(req.params.student_id, 10);

    if (!(await schema.isValid({ student_id }))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({ student_id });

    if (!studentExists) {
      return res.status(400).json({ error: 'Student not found.' });
    }

    const today = startOfDay(new Date());

    const lastSevenDaysCheckins = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: {
          [Op.gt]: subDays(today, 7),
        },
      },
      order: [['created_at', 'DESC']],
    });

    if (lastSevenDaysCheckins.count >= 5) {
      return res.json({
        message: `You can have max 5 checkins within last 7 days`,
        checkinList: lastSevenDaysCheckins.rows,
        checkinCount: lastSevenDaysCheckins.count,
      });
    }

    const thisCheckin = await Checkin.create({ student_id });

    return res.json({
      thisCheckin,
      lastSevenDaysCheckins: lastSevenDaysCheckins.rows,
    });
  }
}

export default new CheckinController();
