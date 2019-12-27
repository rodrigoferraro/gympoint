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

  async update(req, res) {
    const student = await Student.findByPk(req.params.id);

    const email = req.body.email || student.email;

    if (email !== student.email) {
      const newEmailExists = await Student.findOne({
        where: { email },
      });

      if (newEmailExists) {
        return res.status(400).json({
          error: `Email already assigned to ${newEmailExists.nome}`,
        });
      }
    }

    const { id, nome, idade, peso, altura } = await student.update(req.body);

    return res.json({
      id,
      nome,
      email,
      idade,
      peso,
      altura,
    });
  }
}

export default new StudentController();
