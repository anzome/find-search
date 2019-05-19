import copy from 'rollup-plugin-copy'

export default {
    input: 'src/script.js',
    output: {
        file: 'build/plugin.js',
        format: 'iife'
    },
    plugins: [
        copy({
            targets: [
                'src/images',
                'src/third_apps',
                'src/manifest.json',
                'src/tracking.js'
            ],
            outputFolder: 'build'
        })
    ]
}
