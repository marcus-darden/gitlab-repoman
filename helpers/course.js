const models = require('../models');

const helpers = module.exports = {};

function getCourseObject(form) {
  // Get Form Data
  const obj = { name: form.name };

  // Clean course number
  const dept = form.department.toLowerCase().replace(' ', '');
  let number = form.number.toLowerCase().replace(' ', '');
  if (form.section.length) {
    number = `${number}-${form.section.toLowerCase().replace(' ', '')}`;
  }

  // Clean semester
  let semester = form.semester.toLowerCase();
  if (semester.indexOf('f') > -1) {
    semester = 'fall';
  }
  else if (semester.indexOf('w') > -1) {
    semester = 'winter';
  }
  else if (semester.indexOf('/') > -1) {
    semester = 'spring_summer';
  }
  else if (semester.indexOf('p') > -1) {
    semester = 'spring';
  }
  else if (semester.indexOf('u') > -1) {
    semester = 'summer';
  }
  else {
    semester = '';
  }

  // Add year
  if (semester.length) {
    semester = `${semester}-${form.year.toLowerCase().replace(' ', '')}`;
  }
  else {
    semester = form.year.toLowerCase().replace(' ', '');
  }

  // Construct label
  obj.label = `${dept}-${number}-${semester}`;

  return obj;
}

helpers.addUsers = function addUsers(courseLabel, users, gitlab_access_level) {
  return models.Course.findOne({
    where: { label: courseLabel },
  }).then(_course => _course.addUsers(users, { gitlab_access_level }));
};

helpers.create = function create(userId, form) {
  const courseOb = getCourseObject(form);

  return models.User.findById(userId).then(
    _user => _user.createCourse(courseOb, { gitlab_access_level: 50 })
  );
};

helpers.deleteCourse = function deleteCourse(courseLabel) {
  return models.Course.destroy({
    where: { label: courseLabel },
  });
};

helpers.get = function get(courseLabel) {
  return models.Course.findOne({
    where: { label: courseLabel },
  });
};

helpers.getCoursesTaken = function getCoursesTaken(userId) {
  return models.Course.findAll({
    include: [{
      model: models.User,
      where: { id: userId },
      through: { where: { gitlab_access_level: 30 } },
    }],
  });
};

helpers.getCoursesTaught = function getCoursesTaught(userId) {
  return models.Course.findAll({
    include: [{
      model: models.User,
      where: { id: userId },
      through: { where: { gitlab_access_level: [40, 50] } },
    }],
  });
  // return models.User.findById(userId)
  //   .then(_user => _user.getCourses({ gitlab_access_level: [40, 50] }));
};

helpers.isStaff = function isStaff(username, courseLabel) {
  return models.Course.count({
    where: { label: courseLabel },
    include: [{
      model: models.User,
      where: { username },
      through: { where: { gitlab_access_level: [40, 50] } },
    }],
  }).then(_count => Promise.resolve(Boolean(_count)));
};

helpers.removeUser = function removeUser(courseLabel, username) {
  return Promise.all([
    models.Course.findOne({ where: { label: courseLabel } }),
    models.User.findOne({ where: { username } }),
  ]).spread((_course, _user) => _course.removeUser(_user));
};

helpers.update = function update(courseLabel, form) {
  const courseOb = getCourseObject(form);

  return models.Course.findOne({ where: { label: courseLabel } })
    .then(_course => _course.update(courseOb));
};
