module.exports = function(di, server) {
    return new Promise((resolve) => {
        let signals = {
            'SIGINT': 2,
            'SIGTERM': 15,
        };

        let connections = {};


        server.on('connection', function(connection) {
            let key = connection.remoteAddress + ':' + connection.remotePort;

            connections[key] = connection;

            connection.on('close', function() {
                delete connections[key];
            });
        });

        function shutdown(signal, value) {
            let promises = [];

            promises.push(new Promise((resolve, reject) => {
                di.logger.info('stopping mongodb client');

                if (di.db && di.db.mongo) {
                    di.db.mongo.close(true, function(error) {
                        if (error) {
                            di.logger.error(error);
                            process.exit(1);
                        }

                        di.logger.info('mongodb client stopped');

                        resolve();
                    });
                } else {
                    resolve();
                }
            }));

            promises.push(new Promise((resolve, reject) => {
                di.logger.info('stopping http server');

                server.close(function() {
                    di.logger.info('http server stopped by ' + signal);
                    resolve();
                });

                server.getConnections(function(error, count) {
                    di.logger.info(`http server: destroy ${count} connections`);

                    Object.keys(connections).forEach((key) => {
                        connections[key].destroy();
                    });
                });
            }));

            Promise.all(promises)
                .then(() => {
                    di.logger.info('shutdown complete');
                    process.exit(128 + value);
                })
                .catch((error) => {
                    di.logger.error(error);
                    process.exit(128 + value);
                });
        }


        Object.keys(signals).forEach(function(signal) {
            process.on(signal, function() {
                di.logger.info(`CATCH SIGNAL ${signal}`);
                shutdown(signal, signals[signal]);
            });
        });

        resolve(server);
    });
};
