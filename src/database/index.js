import Sequelize from 'sequelize';

import User from '../app/models/User';
import Student from '../app/models/Student';
import Option from '../app/models/Option';
import Membership from '../app/models/Membership';
import Checkin from '../app/models/Checkin';
import Help_order from '../app/models/Help_order';

import databaseConfig from '../config/database';

const models = [User, Student, Option, Membership, Checkin, Help_order];

class Database {
  constructor() {
    this.init();
  }

  init() {
    this.connection = new Sequelize(databaseConfig);
    models.map(model => model.init(this.connection));
    models.map(
      model => model.associate && model.associate(this.connection.models)
    );
  }
}

export default new Database();
