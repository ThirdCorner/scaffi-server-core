import AbstractModel from '../../src/classes/abstract-model';

class OptionEventCauses extends AbstractModel {
	getModelStructure(){
		return {
			id: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				autoIncrement: true,
				primaryKey: true
			},
			OptionEventCategoriesId: {
				type: this.getDataTypes().INTEGER,
				allowNull: false,
				references: {
					model: 'OptionEventCategories',
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
			name:  {plural: "OptionEventCauses", singular: "OptionEventCauses"},
			freezeTableName: true,
			classMethods: {
				
			}
			
		};
	}
}

export default new OptionEventCauses();

