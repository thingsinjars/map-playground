import Gist from './gist';
import Frontend from './frontend';
import Backend from './backend';
import utils from './utils';

function adapter(server, Config) {

	const gist = Gist(Config);
    const frontend = Frontend(server, gist, utils, Config);
    const backend = Backend(server, gist, utils, Config);

    return Object.assign(frontend, backend);
}

export default adapter;