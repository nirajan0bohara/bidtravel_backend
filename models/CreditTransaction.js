module.exports = (sequelize, DataTypes) => {
  const CreditTransaction = sequelize.define('CreditTransaction', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    credits: {
      type: DataTypes.INTEGER,
      allowNull: false
    },
    type: {
      type: DataTypes.ENUM('add', 'deduct'),
      allowNull: false
    }
  }, {
    timestamps: true,
    paranoid: true
  });

  CreditTransaction.associate = (models) => {
    CreditTransaction.belongsTo(models.User, { foreignKey: 'agencyId' });
  };

  return CreditTransaction;
};