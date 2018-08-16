/**
 * Ce module charge dynamiquement toutes les modules de routes du dossier routes
 */
'use strict';

const fs   = require('fs');
const path = require('path');

module.exports = function (app) {
    fs.readdirSync('./src/routes/').forEach(function (file) {
        if (file === path.basename(__filename) || path.extname(file) !== '.js') {
            return;
        }

        require('./' + file)(app);

    });
};
