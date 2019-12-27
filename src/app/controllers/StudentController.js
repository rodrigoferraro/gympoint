import Student from '../models/Student';

class StudentController {
  async store(req, res) {
    const { email } = req.body;
    const studentExists = await Student.findOne({
      where: { email },
    });

    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const { nome, idade, peso, altura } = await Student.create(req.body);

    return res.json({
      nome,
      email,
      idade,
      peso,
      altura,
    });
  }
}

export default new StudentController();
