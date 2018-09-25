<a name="1.3.3"></a>
## [1.3.3](https://github.com/aurelia/templating-router/compare/1.3.2...1.3.3) (2018-09-25)


### Bug Fixes

* **RouterView, RouteHref:** delay element injection ([a465e6e](https://github.com/aurelia/templating-router/commit/a465e6e))



<a name="1.3.2"></a>
## [1.3.2](https://github.com/aurelia/templating-router/compare/1.3.1...1.3.2) (2018-07-03)

* Update dependencies and leverate new framework configuration APIs.

<a name="1.3.0"></a>
# [1.3.0](https://github.com/aurelia/templating-router/compare/1.2.0...1.3.0) (2018-01-15)


### Features

* **templating-router:** optional viewports ([24532ff](https://github.com/aurelia/templating-router/commit/24532ff))



<a name="1.2.0"></a>
# [1.2.0](https://github.com/aurelia/templating-router/compare/1.1.0...1.2.0) (2017-10-02)


### Bug Fixes

* **route-href:** delay route generation until after router's baseURL has been set ([606bf42](https://github.com/aurelia/templating-router/commit/606bf42)), closes [#46](https://github.com/aurelia/templating-router/issues/46)
* **templating-router:** Silence Bluebirds runaway promise warning ([62ba4e2](https://github.com/aurelia/templating-router/commit/62ba4e2))

### Features

* Use route as default property for route-href

<a name="1.1.0"></a>
# [1.1.0](https://github.com/aurelia/templating-router/compare/1.0.1...v1.1.0) (2017-02-26)


### Features

* **route:** load html only component ([112dd29](https://github.com/aurelia/templating-router/commit/112dd29))
* Update to use shared SwapStrategies from templating.


<a name="1.0.1"></a>
## [1.0.1](https://github.com/aurelia/templating-router/compare/1.0.0...v1.0.1) (2016-12-03)


### Bug Fixes

* **router-view:** deco typo, lint and missing conditional ([7de1854](https://github.com/aurelia/templating-router/commit/7de1854))



<a name="1.0.0"></a>
# [1.0.0](https://github.com/aurelia/templating-router/compare/1.0.0-rc.1.0.1...v1.0.0) (2016-07-27)



<a name="1.0.0-rc.1.0.1"></a>
# [1.0.0-rc.1.0.1](https://github.com/aurelia/templating-router/compare/1.0.0-rc.1.0.0...v1.0.0-rc.1.0.1) (2016-07-12)


### Bug Fixes

* **route-href:** return null from promises ([fd1b2fc](https://github.com/aurelia/templating-router/commit/fd1b2fc)), closes [#31](https://github.com/aurelia/templating-router/issues/31)
* **router-view:** correct relative view strategies ([3f92470](https://github.com/aurelia/templating-router/commit/3f92470))



<a name="1.0.0-rc.1.0.0"></a>
# [1.0.0-rc.1.0.0](https://github.com/aurelia/templating-router/compare/1.0.0-beta.2.0.3...v1.0.0-rc.1.0.0) (2016-06-22)



### 1.0.0-beta.1.2.1 (2016-05-10)


### 1.0.0-beta.1.2.0 (2016-03-22)

* Update to Babel 6

### 1.0.0-beta.1.1.2 (2016-03-01)


#### Bug Fixes

* **router-view:** simplify composition transaction use ([76cdc978](http://github.com/aurelia/templating-router/commit/76cdc9780c58ecc3fc8114eb80808abcfbf6f6c8))


#### Features

* **router-view:** connect to composition transaction ([b95667e0](http://github.com/aurelia/templating-router/commit/b95667e0c4d8bbc5b2d4621157ccc191891245cd))


### 1.0.0-beta.1.1.1 (2016-02-08)


### 1.0.0-beta.1.1.0 (2016-01-29)

#### Features

* **all:** update jspm meta; core-js; aurelia-dps ([e26b67e7](http://github.com/aurelia/templating-router/commit/e26b67e7ef9a4a6e66ebef8b01eb154e63ce21ba))


### 1.0.0-beta.1.0.5 (2016-01-08)


#### Bug Fixes

* **index:** AppRouter should point to the same root Router singleton as Router ([8c62f59f](http://github.com/aurelia/templating-router/commit/8c62f59f87b4e8793c62b5b951cd5589ff7904d3))
* **router-view:** properly handle the created callback during dynamic composition ([05671f46](http://github.com/aurelia/templating-router/commit/05671f4676983cfbf7c6d2d90f879c8c91667459))


### 1.0.0-beta.1.0.4 (2015-12-22)


#### Bug Fixes

* **promise-all:** Wrap Promise all args in an array ([a6dc58af](http://github.com/aurelia/templating-router/commit/a6dc58af49eadc084d49388ff75c91e0b05438f5))


### 1.0.0-beta.1.0.3 (2015-12-16)


#### Bug Fixes

* **add-nextview-first:** Add the next first on with ([d188112c](http://github.com/aurelia/templating-router/commit/d188112c67bbfd290c046ad11ce95338386024ea))
* **default-swap-order:** Set default swap order to after resolves aurelia/framework#263 ([984aeb12](http://github.com/aurelia/templating-router/commit/984aeb1260670a9202dcda0b933608a61b1daade))
* **spelling:** Miss-Spelled SwapStrategies ([9b9fb9ea](http://github.com/aurelia/templating-router/commit/9b9fb9ea1990376d7d0642a39df23eae8700de84))


## 1.0.0-beta.1.0.2 (2015-12-03)


#### Bug Fixes

* **router-view:** ensure unbind prev view ([a2197205](http://github.com/aurelia/templating-router/commit/a2197205e018f88778ac9d1afa2719429b0232db), closes [#16](http://github.com/aurelia/templating-router/issues/16))


## 1.0.0-beta.1.0.1 (2015-11-16)


### 1.0.0-beta.1 (2015-11-16)


## 0.18.0 (2015-11-10)


#### Bug Fixes

* **all:** utilize the viewModel property instead of bindingContext ([7e4590fe](http://github.com/aurelia/templating-router/commit/7e4590fe25b5899754c36881cea2a0dbd89dbc29))
* **route-href:** ensure the component is bound before processing changes ([f7612d6c](http://github.com/aurelia/templating-router/commit/f7612d6ce488b4318e6ab9c63d06eacb39de8ab7))
* **route-loader:** update to latest composition engine ([b9a8b4bb](http://github.com/aurelia/templating-router/commit/b9a8b4bb328345c57dc4c7cdcbd94236b40f7609))
* **router-view:**
  * update to latest templating resource load api ([aeb200d0](http://github.com/aurelia/templating-router/commit/aeb200d0520fbcc0f1376463bc40361b4e28f414))
  * update to use view locator ([77db54d1](http://github.com/aurelia/templating-router/commit/77db54d12325dd83bc0ed1e50b3da28f3f6794c3))
  * use the new Controller#automate api ([b0db6464](http://github.com/aurelia/templating-router/commit/b0db64649844726b507af69cbe1782fba810b5d0))
  * correctly bind controller for consistent binding order ([2f50e532](http://github.com/aurelia/templating-router/commit/2f50e5325d7f6f0b2154548b2afad8d479f99a4f))
* **swapStrategies:** handle undefined view ([b2818021](http://github.com/aurelia/templating-router/commit/b2818021d7746b1e64a39eaf03ad3d4617da4051))


#### Features

* **animation-timing:**
  * Re-apply viewInstruction controller automat ([d2d14bda](http://github.com/aurelia/templating-router/commit/d2d14bda62d1dc077a8e1d801765899ec49cd5ed))
  * Apply animationTimings to the router-view before|with|after ([5e504193](http://github.com/aurelia/templating-router/commit/5e5041933f038e6cc65b894746c372be87e47ebd))
* **default-animation-timing:** Set the default animation-timing function to 'before' ([9a2e530e](http://github.com/aurelia/templating-router/commit/9a2e530eb9c9cf0447bb713ead94a1d5841b97c5))
* **route-href:** report errors via aurelia-logging ([ac8dc0fb](http://github.com/aurelia/templating-router/commit/ac8dc0fb9ff03978f6dbe63b39b379505bd7050c))
* **swap-order:** Rename Bindable animationTiming to swapOrder ([2be906a9](http://github.com/aurelia/templating-router/commit/2be906a93636a01db2f8a1d2cdd4e5e6337d6758))
* **swap-view:** Rename Bindable Property form Animation-Timing to Swap-View ([0a849540](http://github.com/aurelia/templating-router/commit/0a8495408e6aa4c692ddd7b6634e39f949a68495))


## 0.17.0 (2015-10-13)


#### Bug Fixes

* **all:**
  * update executionContext naming to bindingContext ([451a21e1](http://github.com/aurelia/templating-router/commit/451a21e18e5ef7380d3b86f99369858e83dfa21a))
  * update to latest plugin api ([c75a8236](http://github.com/aurelia/templating-router/commit/c75a8236669733017d987a98d90ad9c20b125961))
  * update to new resource loading processing pipeline ([122f7e9d](http://github.com/aurelia/templating-router/commit/122f7e9d8f2145a3b7ae944b64f2992bf53418df))
* **build:**
  * update linting, testing and tools ([6c297c13](http://github.com/aurelia/templating-router/commit/6c297c13f2e064e606d5ba155ca2ada03a3918b1))
  * add missing bower bump ([00090a2e](http://github.com/aurelia/templating-router/commit/00090a2e4e95f2504617a9df48a380cb7b86314a))
* **index:**
  * update to latest configuration api ([19e90527](http://github.com/aurelia/templating-router/commit/19e905272049ede5d01149e4d150982ca5cdf950))
  * plugin now uses new id-base api for resources ([79bb1906](http://github.com/aurelia/templating-router/commit/79bb19065de4fe2631c5ecc8f92e3b0057d17a58))
* **package:**
  * change jspm directories ([98734f03](http://github.com/aurelia/templating-router/commit/98734f03e29dad7ad7a17ec4aeb1eff454f3359d))
  * update dependencies ([bc40d4e9](http://github.com/aurelia/templating-router/commit/bc40d4e99f72c6f50ab97d83be8bd43e7d3a0e9a))
  * update deps and fix bower semver ranges ([6c09a5e1](http://github.com/aurelia/templating-router/commit/6c09a5e16672fff67d23a578c4d3c2d4fd348ed0))
  * update dependencies ([f956c4ff](http://github.com/aurelia/templating-router/commit/f956c4ff85900c7e2c323d18b161a8ae74fa2dbb))
  * update Aurelia dependencies ([21897ecd](http://github.com/aurelia/templating-router/commit/21897ecd693d32eeea48e1a14c28821575226adb))
  * update dependencies to latest ([c8277386](http://github.com/aurelia/templating-router/commit/c827738699d940293461bb5ae0d04edf8e1bdcb1))
  * update router to latest version ([24ae8680](http://github.com/aurelia/templating-router/commit/24ae86806cc042d3f73082d6c425fd4e1b82283e))
  * update dependencies to latest versions ([9102ed05](http://github.com/aurelia/templating-router/commit/9102ed05892dc23859bc8f6129b27e87d8c30d39))
  * update templating to latest version ([c8ab2558](http://github.com/aurelia/templating-router/commit/c8ab25581f1f0e82e85083ad313efe8322f15fdf))
  * update dependencies to latest versions ([4c17dbad](http://github.com/aurelia/templating-router/commit/4c17dbada6fae62ada689b2332801d1ae01d1391))
  * update dependencies to latest versions ([6a9e8c87](http://github.com/aurelia/templating-router/commit/6a9e8c873d146ce5161c30cf2b632832b658f6b3))
  * updating dependencies to their latest versions ([c91a7d75](http://github.com/aurelia/templating-router/commit/c91a7d7523b4dc4da1fae089c436eee579000c2e))
* **route-href:** account for async router configs when generating route hrefs ([37933612](http://github.com/aurelia/templating-router/commit/379336128fb547919c5ab93ed83b9978ac128216))
* **router-view:**
  * use correct behavior instruction ([4ea57f3a](http://github.com/aurelia/templating-router/commit/4ea57f3a18509f57c973c57bef995cf3b537dcae))
  * remove reliance on swap method of slot ([9b96894c](http://github.com/aurelia/templating-router/commit/9b96894cdb532a1df2068ab7156038f43ee1afe0))
  * view swapping now unbinds after detach and returns to cache ([d9f81cca](http://github.com/aurelia/templating-router/commit/d9f81ccad1a8ca9b4732877d81d56dde06bbcaea))
  * ensure that bind callbacks execute ([07d789fc](http://github.com/aurelia/templating-router/commit/07d789fc4820498218d22c478dff73769a68d940))
  * update to latest metadata api ([9813b21a](http://github.com/aurelia/templating-router/commit/9813b21a71b8d4c301625724a9e2ec203c78ab00))
  * align with view model load api ([d3881eaf](http://github.com/aurelia/templating-router/commit/d3881eaf5411c1f7e1f209a13911913d2d47ac75))
  * ensure getComponent returns promise ([8cec29a1](http://github.com/aurelia/templating-router/commit/8cec29a17b5b896cae8aa93842216437ff88f6b0))
  * ensure that execution context is always set ([609b8ec1](http://github.com/aurelia/templating-router/commit/609b8ec170054417e58944a6dd3341c38e9fb947))
* **router-view-port:** renamed to router-view ([43760091](http://github.com/aurelia/templating-router/commit/43760091169d7dceab51f65f62abd52acbfacdae))


#### Features

* **all:**
  * update to pal ([a0a63945](http://github.com/aurelia/templating-router/commit/a0a63945421eefaed8c02f60d344409f916ea5cc))
  * new router configuration strategy ([1dd6686b](http://github.com/aurelia/templating-router/commit/1dd6686be491a5dacfe0870b67ede9806b4c0995))
  * upgrade compiler and integrate decorators ([d9d8594a](http://github.com/aurelia/templating-router/commit/d9d8594a17ebc03ad5ce9d81e6a5e4e95980d6a3))
  * make route config view and moduleId relative to router's owner ([2aec99bd](http://github.com/aurelia/templating-router/commit/2aec99bd33e125231a6aebf47f18983aac6f3fea))
* **build:** update compiler and switch to register module format ([1a0f2d6b](http://github.com/aurelia/templating-router/commit/1a0f2d6b5fe867dfecbdce4f67fa342450020e04))
* **docs:** generate api.json from .d.ts file ([6e576cfc](http://github.com/aurelia/templating-router/commit/6e576cfc603c20aa1043ba13b49ce93828e0e798))
* **route-href:** add custom attribute for generating hrefs for named routes ([e6b94ce6](http://github.com/aurelia/templating-router/commit/e6b94ce6f3e9ebdb1e3e1b625225d06fa0a23d82))
* **router:** enable plugin model ([a570e911](http://github.com/aurelia/templating-router/commit/a570e911d43b4fb92138b06b9b346ca66e13c03c))
* **router-view:**
  * updated to reflect new controller naming from templating library ([128454c3](http://github.com/aurelia/templating-router/commit/128454c3ff0c770b2a504021fddb4f50e49cf71e))
  * support syncChildren ([8a40ba7c](http://github.com/aurelia/templating-router/commit/8a40ba7c35a1cf461a81129eabfa3a4066d26db9))
  * update to new fluent metadata ([3335a303](http://github.com/aurelia/templating-router/commit/3335a3030f24c41357a28bcf4995c5a0556acbca))
  * delayed view loading ([76389e77](http://github.com/aurelia/templating-router/commit/76389e776e3db94dc916c6f878259b10a4c4b46b))
  * make router location more robust ([f38a2cb4](http://github.com/aurelia/templating-router/commit/f38a2cb40ab40679f3a25172d41db79df9988d2d))
  * enable getViewStrategy on view models ([5aea8b3e](http://github.com/aurelia/templating-router/commit/5aea8b3eb0ede9c08fe728299a95689c503b32e3))


### 0.16.1 (2015-09-05)


#### Bug Fixes

* **router-view:** use correct behavior instruction ([4ea57f3a](http://github.com/aurelia/templating-router/commit/4ea57f3a18509f57c973c57bef995cf3b537dcae))


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
