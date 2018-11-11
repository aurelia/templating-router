## List of scenarios and their details for real world apps simulations

1. App with single `<router-view/>`, no layout, and few child routes

2. App with two `<router-view>` using different names and few child routes
  - [x] with normal landing URL
  - [x] with not matching landing URL
    - [x] check for timeout
  - [ ] with not matching landing URL, with mapUnknownRoutes()
    - [x] with normal RouteConfig
    - [x] with navInstruction callback
    - [ ] with moduleId