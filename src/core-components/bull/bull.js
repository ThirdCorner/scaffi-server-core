'use strict';

import AbstractComponent from '../../extendables/abstract-component';
import BullQueue from 'bull';
import _ from 'lodash';

class Bull extends AbstractComponent {
	setup(redis) {

		var BullInterface = {
			create(args){
				if(!args.queueName) throw new Error("You must pass a queueName into bull.create");

				var queue = BullQueue(args.queueName);
				return queue;
			},
			getDataByQueue(qName, type, cb){
				var returnData = [];
				qName = "bull:" + qName;
				var key = qName + ":" + type;
				redis.lrange(key, 0, -1, (error, ids)=>{
					if(!_.isArray(ids)) {
						cb([]);
						return;
					}
					var count = ids.length;
					if(!count) {
						cb([]);
						return;
					}
					ids.forEach( (id)=>{
						var jobKey = `${qName}:${id}`;
						redis.hgetall(jobKey, (error, data)=>{
							if(!error) {
								returnData.push({
									id: id,
									data: data.data || {}
								})
							}
							
							count--;
							if(count < 1) {
								cb(returnData);
							}
						});
					});

				});
			}
		};

		
		this.set(BullInterface);
	}
	
}

export default Bull;