/*
 * Copyright (C) 2020 Infinite Automation Systems Inc. All rights reserved.
 */

const moduleConfig = require('@infinite-automation/mango-module-tools');

module.exports = moduleConfig().then((config) => {
    config.module.rules.push({
        test: /\.raw\.js$/,
        use: [
            {
                loader: 'raw-loader'
            }
        ]
    });

    return config;
});
