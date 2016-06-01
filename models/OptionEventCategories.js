module.exports = function(sequelize, DataTypes) {
	return sequelize.define('OptionEventCategories', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			autoIncrement: true,
			primaryKey: true
		},
		OptionEventTypesId: {
			type: DataTypes.INTEGER,
			allowNull: false,
			references: {
				model: 'OptionEventTypes',
				key: 'id'
			}
		},
		Name: {
			type: DataTypes.STRING(25),
			allowNull: false
		},
		IsActive: {
			type: DataTypes.BOOLEAN,
			allowNull: false,
			defaultValue: 1
		}
	}, {
		name:  {plural: "OptionEventCategories", singular: "OptionEventCategories"},
		freezeTableName: true,
		classMethods: {
			
		}
		
	})
};