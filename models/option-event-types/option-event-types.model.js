import AbstractModel from '../../src/classes/abstract-model';

class OptionEventTypes extends AbstractModel {
	getModelStructure(){
		return {
			id: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			Name: {
				type: this.getDataTypes().STRING(25),
				allowNull: false
			},
			IsActive: {
				type: this.getDataTypes().BOOLEAN,
				allowNull: false,
				defaultValue: 1
			}
		};
	}
	getModelOptions(){
		return {
			name:  {plural: "OptionEventTypes", singular: "OptionEventTypes"},
			freezeTableName: true,
			classMethods: {
				// associate: function(models){
				// 	this.hasMany(models.OptionEventCategories, { onDelete: 'cascade', hooks: true });
				// }
			}
			
			
		};
	}
}

export default new OptionEventTypes();
