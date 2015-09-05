## 0.16.0 (2015-09-05)


#### Bug Fixes

* **all:** update executionContext naming to bindingContext ([451a21e1](http://github.com/aurelia/templating-router/commit/451a21e18e5ef7380d3b86f99369858e83dfa21a))
* **build:** update linting, testing and tools ([6c297c13](http://github.com/aurelia/templating-router/commit/6c297c13f2e064e606d5ba155ca2ada03a3918b1))
* **router-view:**
  * remove reliance on swap method of slot ([9b96894c](http://github.com/aurelia/templating-router/commit/9b96894cdb532a1df2068ab7156038f43ee1afe0))
  * view swapping now unbinds after detach and returns to cache ([d9f81cca](http://github.com/aurelia/templating-router/commit/d9f81ccad1a8ca9b4732877d81d56dde06bbcaea))


#### Features

* **docs:** generate api.json from .d.ts file ([6e576cfc](http://github.com/aurelia/templating-router/commit/6e576cfc603c20aa1043ba13b49ce93828e0e798))


## 0.15.0 (2015-08-14)


#### Bug Fixes

* **index:** update to latest configuration api ([19e90527](http://github.com/aurelia/templating-router/commit/19e905272049ede5d01149e4d150982ca5cdf950))
* **route-href:** account for async router configs when generating route hrefs ([37933612](http://github.com/aurelia/templating-router/commit/379336128fb547919c5ab93ed83b9978ac128216))


### 0.14.1 (2015-07-29)

* improve output file name

## 0.14.0 (2015-07-02)


## 0.13.0 (2015-06-08)


#### Features

* **router-view:** support syncChildren ([8a40ba7c](http://github.com/aurelia/templating-router/commit/8a40ba7c35a1cf461a81129eabfa3a4066d26db9))


## 0.12.0 (2015-05-01)


#### Bug Fixes

* **all:** update to latest plugin api ([c75a8236](http://github.com/aurelia/templating-router/commit/c75a8236669733017d987a98d90ad9c20b125961))


#### Features

* **all:** new router configuration strategy ([1dd6686b](http://github.com/aurelia/templating-router/commit/1dd6686be491a5dacfe0870b67ede9806b4c0995))
* **route-href:** add custom attribute for generating hrefs for named routes ([e6b94ce6](http://github.com/aurelia/templating-router/commit/e6b94ce6f3e9ebdb1e3e1b625225d06fa0a23d82))


## 0.11.0 (2015-04-09)


#### Features

* **all:** upgrade compiler and integrate decorators ([d9d8594a](http://github.com/aurelia/templating-router/commit/d9d8594a17ebc03ad5ce9d81e6a5e4e95980d6a3))


## 0.10.0 (2015-03-25)


#### Bug Fixes

* **all:** update to new resource loading processing pipeline ([122f7e9d](http://github.com/aurelia/templating-router/commit/122f7e9d8f2145a3b7ae944b64f2992bf53418df))
* **index:** plugin now uses new id-base api for resources ([79bb1906](http://github.com/aurelia/templating-router/commit/79bb19065de4fe2631c5ecc8f92e3b0057d17a58))


### 0.9.4 (2015-02-28)


#### Bug Fixes

* **package:** change jspm directories ([98734f03](http://github.com/aurelia/templating-router/commit/98734f03e29dad7ad7a17ec4aeb1eff454f3359d))


### 0.9.3 (2015-02-28)


#### Bug Fixes

* **build:** add missing bower bump ([00090a2e](http://github.com/aurelia/templating-router/commit/00090a2e4e95f2504617a9df48a380cb7b86314a))
* **package:** update dependencies ([bc40d4e9](http://github.com/aurelia/templating-router/commit/bc40d4e99f72c6f50ab97d83be8bd43e7d3a0e9a))


### 0.9.2 (2015-01-24)


#### Bug Fixes

* **package:** update deps and fix bower semver ranges ([6c09a5e1](http://github.com/aurelia/templating-router/commit/6c09a5e16672fff67d23a578c4d3c2d4fd348ed0))


### 0.9.1 (2015-01-24)


#### Bug Fixes

* **router-view:** ensure that bind callbacks execute ([07d789fc](http://github.com/aurelia/templating-router/commit/07d789fc4820498218d22c478dff73769a68d940))


## 0.9.0 (2015-01-22)


#### Bug Fixes

* **package:** update dependencies ([f956c4ff](http://github.com/aurelia/templating-router/commit/f956c4ff85900c7e2c323d18b161a8ae74fa2dbb))
* **router-view:** update to latest metadata api ([9813b21a](http://github.com/aurelia/templating-router/commit/9813b21a71b8d4c301625724a9e2ec203c78ab00))


#### Features

* **router-view:** update to new fluent metadata ([3335a303](http://github.com/aurelia/templating-router/commit/3335a3030f24c41357a28bcf4995c5a0556acbca))


## 0.8.0 (2015-01-12)


#### Bug Fixes

* **package:** update Aurelia dependencies ([21897ecd](http://github.com/aurelia/templating-router/commit/21897ecd693d32eeea48e1a14c28821575226adb))


## 0.7.0 (2015-01-07)


#### Bug Fixes

* **package:** update dependencies to latest ([c8277386](http://github.com/aurelia/templating-router/commit/c827738699d940293461bb5ae0d04edf8e1bdcb1))


#### Features

* **all:** make route config view and moduleId relative to router's owner ([2aec99bd](http://github.com/aurelia/templating-router/commit/2aec99bd33e125231a6aebf47f18983aac6f3fea))
* **router-view:** delayed view loading ([76389e77](http://github.com/aurelia/templating-router/commit/76389e776e3db94dc916c6f878259b10a4c4b46b))


## 0.6.0 (2015-01-06)


#### Bug Fixes

* **router-view:** align with view model load api ([d3881eaf](http://github.com/aurelia/templating-router/commit/d3881eaf5411c1f7e1f209a13911913d2d47ac75))


#### Features

* **build:** update compiler and switch to register module format ([1a0f2d6b](http://github.com/aurelia/templating-router/commit/1a0f2d6b5fe867dfecbdce4f67fa342450020e04))
* **router:** enable plugin model ([a570e911](http://github.com/aurelia/templating-router/commit/a570e911d43b4fb92138b06b9b346ca66e13c03c))
* **router-view:** make router location more robust ([f38a2cb4](http://github.com/aurelia/templating-router/commit/f38a2cb40ab40679f3a25172d41db79df9988d2d))


### 0.5.2 (2014-12-22)


#### Bug Fixes

* **package:** update router to latest version ([24ae8680](http://github.com/aurelia/templating-router/commit/24ae86806cc042d3f73082d6c425fd4e1b82283e))


### 0.5.1 (2014-12-22)


#### Bug Fixes

* **router-view:** ensure getComponent returns promise ([8cec29a1](http://github.com/aurelia/templating-router/commit/8cec29a17b5b896cae8aa93842216437ff88f6b0))


## 0.5.0 (2014-12-22)


#### Bug Fixes

* **package:** update dependencies to latest versions ([9102ed05](http://github.com/aurelia/templating-router/commit/9102ed05892dc23859bc8f6129b27e87d8c30d39))
* **router-view:** ensure that execution context is always set ([609b8ec1](http://github.com/aurelia/templating-router/commit/609b8ec170054417e58944a6dd3341c38e9fb947))


#### Features

* **router-view:** enable getViewStrategy on view models ([5aea8b3e](http://github.com/aurelia/templating-router/commit/5aea8b3eb0ede9c08fe728299a95689c503b32e3))


### 0.4.1 (2014-12-18)


#### Bug Fixes

* **package:** update templating to latest version ([c8ab2558](http://github.com/aurelia/templating-router/commit/c8ab25581f1f0e82e85083ad313efe8322f15fdf))


## 0.4.0 (2014-12-17)


#### Bug Fixes

* **package:** update dependencies to latest versions ([4c17dbad](http://github.com/aurelia/templating-router/commit/4c17dbada6fae62ada689b2332801d1ae01d1391))


## 0.3.0 (2014-12-12)


#### Bug Fixes

* **package:** update dependencies to latest versions ([6a9e8c87](http://github.com/aurelia/templating-router/commit/6a9e8c873d146ce5161c30cf2b632832b658f6b3))
* **router-view-port:** renamed to router-view ([43760091](http://github.com/aurelia/templating-router/commit/43760091169d7dceab51f65f62abd52acbfacdae))


## 0.2.0 (2014-12-11)


#### Bug Fixes

* **package:** updating dependencies to their latest versions ([c91a7d75](http://github.com/aurelia/templating-router/commit/c91a7d7523b4dc4da1fae089c436eee579000c2e))
