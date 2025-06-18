module.exports = (sequelize, DataTypes) => {
  const Bid = sequelize.define('Bid', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    price: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false
    },
    packageDetails: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    status: {
      type: DataTypes.ENUM('pending', 'accepted', 'unselected'),
      defaultValue: 'pending'
    }
  }, {
    timestamps: true,
    paranoid: true
  });

  Bid.associate = (models) => {
    Bid.belongsTo(models.TravelRequest, { foreignKey: 'requestId' });
    Bid.belongsTo(models.User, { foreignKey: 'agencyId' });
  };

  return Bid;
};