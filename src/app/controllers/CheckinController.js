import * as Yup from 'yup';

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

    await Checkin.create({ student_id });

    const lastFiveCheckins = await Checkin.findAll({
      where: { student_id },
      limit: 5,
      order: [['created_at', 'DESC']],
    });

    return res.json({
      lastFiveCheckins,
    });
  }
}

export default new CheckinController();
