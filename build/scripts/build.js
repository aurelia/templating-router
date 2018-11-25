const rollup = require('rollup');
const typescript = require('rollup-plugin-typescript2');
const rimraf = require('rimraf');
const { name: LIB_NAME } = require('../../package.json');
const cacheRoot = '.rollupcache';
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
      resolve();
    });
  });
}

function generateDts() {
  console.log('\n==============\nGenerating dts bundle...\n==============');
  return new Promise(resolve => {
    const ChildProcess = require('child_process');
    ChildProcess.exec('npm run bundle-dts', (err, stdout, stderr) => {
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
      input: 'src/index.ts',
      output: [
        { file: `dist/es2015/${LIB_NAME}.js`, format: 'es' }
      ],
      external: externalLibs,
      plugins: [
        typescript({
          tsconfigOverride: {
            compilerOptions: {
              target: 'es2015'
            }
          },
          cacheRoot: cacheRoot
        }),
      ]
    },
    {
      input: 'src/index.ts',
      output: [
        { file: `dist/commonjs/${LIB_NAME}.js`, format: 'cjs' },
        { file: `dist/amd/${LIB_NAME}.js`, format: 'amd', amd: { id: LIB_NAME } },
        { file: `dist/native-${LIB_NAME}/index.js`, format: 'es' }
      ],
      external: externalLibs,
      plugins: [
        typescript({
          useTsconfigDeclarationDir: true,
          tsconfigOverride: {
            compilerOptions: {
              target: 'es5'
            }
          },
          cacheRoot: cacheRoot
        }),
      ]
    }
  ].map(cfg => {
    return rollup
      .rollup(cfg)
      .then(bundle => Promise.all(cfg.output.map(o => bundle.write(o))));
  }));
};

