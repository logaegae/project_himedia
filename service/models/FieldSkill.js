/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('FieldSkill', {
    fieldId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    skillId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    showOrder: {
      type: DataTypes.INTEGER(11),
      allowNull: true
    }
  }, {
    tableName: 'FieldSkill'
  });
};
