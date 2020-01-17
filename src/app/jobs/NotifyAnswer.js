import { format, parseISO } from 'date-fns';
import pt from 'date-fns/locale/pt';
import Mail from '../../lib/Mail';

class NotifyAnswer {
  get key() {
    return 'NotifyAnswer';
  }

  async handle({ data }) {
    const { help_order } = data;

    await Mail.sendMail({
      to: `${help_order.student.nome} <${help_order.student.email}>`,
      subject: 'Resposta ao seu pedido de auxílio',
      template: 'notify_answered',
      context: {
        student: help_order.student.nome,
        question: help_order.question,
        answer: help_order.answer,
        answered_at: format(
          parseISO(help_order.answered_at),
          "dd'/'MM'/'yyyy H:mm",
          {
            locale: pt,
          }
        ),
      },
    });
  }
}

export default new NotifyAnswer();
