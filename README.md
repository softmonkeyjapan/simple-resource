SimpleResource
==============

[![CircleCI](https://circleci.com/gh/wamland-team/simple-resource.svg?style=shield&circle-token=620045f0f5415b519c4a9b1d4ca98200f18b4acc)](https://circleci.com/gh/wamland-team/simple-resource)

SimpleResource aims to provide a simple way to connect your Angular application to a RESTful backend API.

# Quick setup

1. Start by defining your API domain by injecting `SimpleResourceSettingsProvider` in a `angular.config` block:

  ```js
  angular
    .module('MySuperApp', [])
    .config(function (SimpleResourceSettingsProvider) {
      SimpleResourceSettingsProvider.configure({
        apiUrl: 'https://api.domain.com' // use globally accross your application
      })
    })
  ```

2. Define a service that will act as a **Model** for your resource:

  ```js
  angular
    .module('MySuperApp')
    .service('User', function (SimpleResource) {
      return new SimpleResource('user').instanceMethods({
        /**
         * Attach fullname() on any instance of user.
         *
         * @return {String}
         */
        fullname: function () {
          return [this.lastname, this.firstname].join(' ')
        }
      })
    })
  ```

3. Inject this service whenever you need to retrieve data from your API:

  ```js
  angular
    .module('MySuperApp')
    .controller('UsersController', function (User) {
      var vm = this

      // GET /users
      User.all(function (users) {
        // do something
        // For example, display the first user's fullname
        console.log(users[0].fullname())
      })

      // Get /users/10
      User.find(10, function (user) {
        user.username = 'chuck.norris'
        user.save() // PATCH /users/10
      })

      var user = new User({ username: 'bruce.lee' })
      user.save()   // POST /users
      user.delete() // DELETE /users/100
    })
  ```

# SimpleResource API

SimpleResource has been built to be simple and easy to implement and use. It's API remain very simple on purpose. If you are familiar with Angular `$resource`, then you know already how to use it.

## Constructor

SimpleResource constructor take only one argument that can either be a `String` or an `Object`.

### As object

```js
angular
  .module('MySuperApp')
  .service('User', function (SimpleResource) {
    return new SimpleResource({
      baseUrl:   'https://api.domain2.com',
      namespace: 'user',
      params:    { id: '@id' },
      url:       '/users/:id',
    })
  })
```

**baseUrl**

Allows you to override the global `apiUrl` defined in the `angular.config` block (see the Quick setup section). It gives you the flexibility to connect to multiple backend API.

**namespace**

Allows you to define a namespace for your resource. If you are using the `SimplePaginator` service to handle your pagination, your pagination values will be wrapped under this namespace.
Also, if your API is build using Ruby on Rails, `POST` and `PUT|PATCH` requests will be by default wrapped under this namespace. For example, if your namespace is `blog`, then data send will look like:

```json
{
  "blog": {
    "title": "Blog title",
    "description": "Blog description"
  }
}
```

Please note that it is possible to avoid this behavior by defining a `transformRequest` method on `SimpleResourceSettingsProvider.configure` (see the configuration section) and change the way data are sent to the server.

**params**

Default values for `url` parameters. As SimpleResource is based on Angular $resource (paramDefaults), you are welcome to take a look at the offical documentation at https://docs.angularjs.org/api/ngResource/service/$resource

**url**

A parameterized URL template with parameters prefixed by `:`` as in `/user/:username`. As SimpleResource is based on Angular $resource (paramDefaults), you are welcome to take a look at the offical documentation at https://docs.angularjs.org/api/ngResource/service/$resource

### As string

```js
angular
  .module('MySuperApp')
  .service('User', function (SimpleResource) {
    return new SimpleResource('user')
  })
```

When you instanciate using a string, you need to specify the singular name of your resource. If you deal with `posts` for a blog, then you need to use `post` for example.

This will try to generate an object-like configuration that looks like this:

```js
{
  namespace: 'user',
  params:    { id: '@id', action: '@action' },
  url:       '/users/:id/:action'
}
```

Note that using a `string` for the constructor will use the global `apiUrl` defined in the `angular.config` block.


# Todos

- [ ] SimpleResource methods
- [ ] SimpleResource configuration
- [ ] SimplePaginator API
- [ ] SimplePaginator configuration
