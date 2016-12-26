/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Skill', {
    skillId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    skillName: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fileUUID: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'Skill'
  });
};
