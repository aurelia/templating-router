// @ts-check
const rollup = require('rollup');
/** @type {(options: import('@rollup/plugin-typescript').RollupTypescriptOptions) => import('rollup').Plugin} */
// @ts-ignore
const typescript = require('@rollup/plugin-typescript');
const rimraf = require('rimraf');
const { name: LIB_NAME } = require('../../package.json');
const externalLibs = [
  'aurelia-router',
  'aurelia-pal',
  'aurelia-logging',
  'aurelia-framework',
  'aurelia-metadata',
  'aurelia-path',
  'aurelia-templating',
  'aurelia-dependency-injection',
  'aurelia-binding'
];

clean().then(build).then(generateDts);

/**
 * @type {() => Promise<Error | null>}
 */
function clean() {
  console.log('\n==============\nCleaning dist folder...\n==============');
  return new Promise(resolve => {
    rimraf('dist', (error) => {
      if (error) {
        throw error;
      }
      resolve(void 0);
    });
  });
}

function generateDts() {
  console.log('\n==============\nGenerating dts bundle...\n==============');
  return new Promise(resolve => {
    const ChildProcess = require('child_process');
    ChildProcess.exec('npm run build:dts', (err, stdout, stderr) => {
      if (err || stderr) {
        console.log('Generating dts error:');
        console.log(stderr);
      } else {
        console.log('Generated dts bundle successfully');
        console.log(stdout);
      }
      resolve();
    });
  });
};

function build() {
  console.log('\n==============\nBuidling...\n==============');
  return Promise.all([
    {
      input: `src/${LIB_NAME}.ts`,
      output: [
        { file: `dist/es2015/${LIB_NAME}.js`, format: 'es', sourcemap: true }
      ],
      external: externalLibs,
      plugins: [
        typescript({
          target: 'es2015',
          removeComments: true
        }),
      ]
    },
    {
      input: `src/${LIB_NAME}.ts`,
      output: [
        { file: `dist/commonjs/${LIB_NAME}.js`, format: 'cjs', sourcemap: true },
        { file: `dist/amd/${LIB_NAME}.js`, format: 'amd', amd: { id: LIB_NAME }, sourcemap: true },
        { file: `dist/native-modules/${LIB_NAME}.js`, format: 'es', sourcemap: true }
      ],
      external: externalLibs,
      plugins: [
        typescript({
          target: 'es5',
          removeComments: true
        }),
      ]
    }
  ].map(cfg => {
    return rollup
      .rollup(cfg)
      .then(bundle => Promise.all(cfg.output.map(o => bundle.write(o))));
  }));
};

