'use strict';

const models = require('../models');

module.exports = {
  up: (queryInterface) =>
    queryInterface.bulkInsert('user', [
      {
        id: 1,
        username: 'mmdarden',
        display_name: 'Marcus M. Darden',
        // avatar: 'https://secure.gravatar.com/avatar/dbe5c9e77024c50d85c4a44408ada532?s=80&d=identicon',
        // gitlab_user_id: 9,
        course_creator: false,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]).then(() =>
      queryInterface.bulkInsert('course', [
        {
          id: 1,
          label: 'eecs-281-winter-2016',
          name: 'Data Structures & Algorithms',
          // gitlab_group_id: ,
          active: false,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
    ).then(() =>
      queryInterface.bulkInsert('role', [
        {
          user_id: 1,
          course_id: 1,
          gitlab_access_level: 50,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ])
    ),
  down: (queryInterface) =>
    Promise.all([
      queryInterface.bulkDelete('role', null, {}, models.Role),
      queryInterface.bulkDelete('course', null, {}, models.Course),
      queryInterface.bulkDelete('user', null, {}, models.User),
    ]),
};
