/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CourseMember', {
    courseId: {
      type: DataTypes.INTEGER(11),
      allowNull: false,
      primaryKey: true
    },
    userId: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    registDate: {
      type: DataTypes.DATE,
      allowNull: true
    },
    registType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    reviewYn: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'CourseMember'
  });
};
