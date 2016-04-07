module.exports = {
  extends: 'airbnb',
  plugins: [
    'react'
  ],
  globals: {
    '$': 1,
  },
  rules: {
    'brace-style': [
      'error',
      'stroustrup'
    ],
    'new-cap': [
      'error',
      {
        capIsNewExceptions: [
          'express.Router',
          'CHAR',
          'ENUM',
        ],
      },
    ],
  },
};
