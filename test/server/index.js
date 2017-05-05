
import ScaffiCore from "../../src/index.js";

import ScaffiConfig from "../../scaffi-server.json";
import ScaffiPrivate from "../../scaffi-server.private.json";

import '../../components';
import '../../models';
import '../../routes/';
import '../../services';

ScaffiCore.initialize({
	config: ScaffiConfig,
	private: ScaffiPrivate,
	override: {
		"params": {
			"sequelize": {
				"username": "admin",
				"password": "admin"
			}
		}
	}
});


