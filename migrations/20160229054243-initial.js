'use strict';
var Sequelize = require('sequelize');

var user = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  username: {
    type: Sequelize.CHAR(8)
  },
  display_name: {
    type: Sequelize.STRING
  },
  avatar: {
    type: Sequelize.STRING
  },
  gitlab_user_id: {
    type: Sequelize.INTEGER
  },
  course_creator: {
    defaultValue: false,
    type: Sequelize.BOOLEAN
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE
  }
}; // user

var course = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  label: {
    allowNull: false,
    type: Sequelize.STRING,
    unique: true
  },
  name: {
    type: Sequelize.STRING
  },
  gitlab_group_id: {
    type: Sequelize.INTEGER
  },
  active: {
    allowNull: false,
    defaultValue: false,
    type: Sequelize.BOOLEAN
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE
  }
}; // course

var assignment = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  abbr: {
    type: Sequelize.STRING
  },
  description: {
    type: Sequelize.STRING
  },
  number: {
    type: Sequelize.INTEGER
  },
  min_team_size: {
    type: Sequelize.INTEGER
  },
  max_team_size: {
    type: Sequelize.INTEGER
  },
  create_teams: {
    defaultValue: 'solo',
    type: Sequelize.ENUM('manual', 'random', 'solo', 'optin')
  },
  active: {
    defaultValue: false,
    type: Sequelize.BOOLEAN
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  course_id: {
    onDelete: 'cascade',
    references: { model: 'course' },
    type: Sequelize.INTEGER
  }
}; // assignment

var team = {
  id: {
    allowNull: false,
    autoIncrement: true,
    primaryKey: true,
    type: Sequelize.INTEGER
  },
  name: {
    type: Sequelize.STRING
  },
  gitlab_project_id: {
    type: Sequelize.INTEGER
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE
  }
}; // team

var role = {
  gitlab_access_level: {
    allowNull: false,
    type: Sequelize.INTEGER
  },
  created_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  user_id: {
    allowNull: false,
    onDelete: 'cascade',
    onUpdate: 'cascade',
    primaryKey: true,
    references: { model: 'user' },
    type: Sequelize.INTEGER
  },
  course_id: {
    allowNull: false,
    onDelete: 'cascade',
    onUpdate: 'cascade',
    primaryKey: true,
    references: { model: 'course' },
    type: Sequelize.INTEGER
  }
}; // role

var user_team = {
  created_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  user_id: {
    allowNull: false,
    onDelete: 'cascade',
    onUpdate: 'cascade',
    primaryKey: true,
    references: { model: 'user' },
    type: Sequelize.INTEGER
  },
  team_id: {
    allowNull: false,
    onDelete: 'cascade',
    onUpdate: 'cascade',
    primaryKey: true,
    references: { model: 'team' },
    type: Sequelize.INTEGER
  }
}; // user_team

var assignment_team = {
  created_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  updated_at: {
    allowNull: false,
    type: Sequelize.DATE
  },
  assignment_id: {
    allowNull: false,
    onDelete: 'cascade',
    onUpdate: 'cascade',
    primaryKey: true,
    references: { model: 'assignment' },
    type: Sequelize.INTEGER
  },
  team_id: {
    allowNull: false,
    onDelete: 'cascade',
    onUpdate: 'cascade',
    primaryKey: true,
    references: { model: 'team' },
    type: Sequelize.INTEGER
  }
}; // assignment_team

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.createTable('user', user).then(function() {
      return queryInterface.createTable('course', course);
    }).then(function() {
      return queryInterface.createTable('assignment', assignment);
    }).then(function() {
      return queryInterface.createTable('team', team);
    }).then(function() {
      return queryInterface.createTable('role', role);
    }).then(function() {
      return queryInterface.createTable('user_team', user_team);
    }).then(function() {
      return queryInterface.createTable('assignment_team', assignment_team);
    });
  },

  down: function (queryInterface, Sequelize) {
    return queryInterface.dropTable('assignment_team').then(function() {
      return queryInterface.dropTable('user_team');
    }).then(function() {
      return queryInterface.dropTable('role');
    }).then(function() {
      return queryInterface.dropTable('team');
    }).then(function() {
      return queryInterface.dropTable('assignment');
    }).then(function() {
      return queryInterface.dropTable('course');
    }).then(function() {
      return queryInterface.dropTable('user');
    });
  }
};
