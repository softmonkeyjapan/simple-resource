(function () {
  'use strict'

  describe('SimpleResource.SimpleResource', function () {
    var SimpleResource,
        Klass,
        instance

    beforeEach(module('SimpleResource'))
    beforeEach(inject(function ($injector) {
      SimpleResource = $injector.get('SimpleResource')
      Klass = new SimpleResource({ url: '/me', namespace: 'user' })
    }))

    it('is defined', function () {
      expect(SimpleResource).toBeDefined()
    })

    describe('#all', function () {
      beforeEach(function () {
        Klass.query = jasmine.createSpy('query')
      })

      it('uses the `query` method from $resource', function () {
        Klass.all()
        expect(Klass.query).toHaveBeenCalled()
      })
    })

    describe('#find', function () {
      beforeEach(function () {
        Klass.get = jasmine.createSpy('get')
      })

      it('uses the `get` method from $resource', function () {
        Klass.find(1)
        expect(Klass.get).toHaveBeenCalledWith({ id: 1 }, undefined)

        Klass.find({ id: 1 })
        expect(Klass.get).toHaveBeenCalledWith({ id: 1 }, undefined)
      })
    })

    describe('#instanceMethods', function () {
      beforeEach(function () {
        Klass = new SimpleResource({ url: '/me', namespace: 'user' }).instanceMethods({
          fullname: function () {
            return 'John Doe'
          }
        })
        instance = new Klass()
      })

      it('attaches methods to instance prototype', function () {
        expect(instance.fullname()).toEqual('John Doe')
      })

      describe('unknown method', function () {
        it('throws an error', function () {
          expect(function () {
            instance.activate()
          }).toThrow()
        })
      })
    })

    describe('.save', function () {
      beforeEach(function () {
        instance = new Klass()
        instance.$create = jasmine.createSpy('$create')
        instance.$update = jasmine.createSpy('$update')
      })

      describe('does not have an id', function () {
        it('uses the `$create` method from $resource', function () {
          instance.save()
          expect(instance.$create).toHaveBeenCalled()
        })
      })

      describe('has an id', function () {
        it('uses the `$update` method from $resource', function () {
          instance.id = 10
          instance.save()
          expect(instance.$update).toHaveBeenCalled()
        })
      })
    })

    describe('.delete', function () {
      beforeEach(function () {
        instance = new Klass()
        instance.$destroy = jasmine.createSpy('$destroy')
      })

      describe('has an id', function () {
        it('uses the `$destroy` method from $resource', function () {
          instance.id = 10
          instance.delete()
          expect(instance.$destroy).toHaveBeenCalled()
        })
      })

      describe('does not have an id', function () {
        it('throws an error', function () {
          expect(function () {
            instance.delete()
          }).toThrow()
        })
      })
    })
  })
})()
