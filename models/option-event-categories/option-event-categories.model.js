import AbstractModel from '../../src/classes/abstract-model';

class OptionEventCategories extends AbstractModel {
	getModelStructure(){
		return {
			id: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			OptionEventTypesId: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				references: {
					model: 'OptionEventTypes',
					key: 'id'
				}
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
			name:  {plural: "OptionEventCategories", singular: "OptionEventCategories"},
			freezeTableName: true,
			classMethods: {
				
			}
			
		};
	}
}

export default new OptionEventCategories();
