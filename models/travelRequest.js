module.exports = (sequelize, DataTypes) => {
  const TravelRequest = sequelize.define('TravelRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'Users',
        key: 'id'
      }
    },
    from: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'From location cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'From location must be between 2 and 255 characters'
        }
      }
    },
    destination: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: {
          msg: 'Destination cannot be empty'
        },
        len: {
          args: [2, 255],
          msg: 'Destination must be between 2 and 255 characters'
        }
      }
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: {
        isDate: {
          msg: 'Start date must be a valid date'
        },
        isAfter: {
          args: new Date().toISOString().split('T')[0],
          msg: 'Start date must be in the future'
        }
      }
    },
    travelers: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        isInt: {
          msg: 'Travelers must be an integer'
        },
        min: {
          args: [1],
          msg: 'Number of travelers must be at least 1'
        },
        max: {
          args: [50],
          msg: 'Number of travelers cannot exceed 50'
        }
      }
    },
    preferences: {
      type: DataTypes.TEXT,
      allowNull: true,
      validate: {
        len: {
          args: [0, 1000],
          msg: 'Preferences cannot exceed 1000 characters'
        }
      }
    },
    status: {
      type: DataTypes.ENUM('open', 'closed', 'in_progress'),
      defaultValue: 'open',
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true, // Enables soft deletes
    indexes: [
      {
        fields: ['userId']
      },
      {
        fields: ['status']
      },
      {
        fields: ['startDate']
      },
      {
        fields: ['createdAt']
      }
    ]
  });

  TravelRequest.associate = (models) => {
    TravelRequest.belongsTo(models.User, { 
      foreignKey: 'userId',
      as: 'User'
    });
    TravelRequest.hasMany(models.Bid, { 
      foreignKey: 'requestId',
      as: 'Bids'
    });
  };

  return TravelRequest;
};