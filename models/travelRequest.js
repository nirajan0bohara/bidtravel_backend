module.exports = (sequelize, DataTypes) => {
  const TravelRequest = sequelize.define('TravelRequest', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    from: {
      type: DataTypes.STRING,
      allowNull: false
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false
    },
    startDate: {
      type: DataTypes.DATEONLY,
      allowNull: false
    },
    travelers: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    preferences: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    status: {
      type: DataTypes.ENUM('open', 'closed'),
      defaultValue: 'open'
    }
  }, {
    timestamps: true,
    paranoid: true
  });

  TravelRequest.associate = (models) => {
    TravelRequest.belongsTo(models.User, { foreignKey: 'userId' });
    TravelRequest.hasMany(models.Bid, { foreignKey: 'requestId' });
  };

  return TravelRequest;
};