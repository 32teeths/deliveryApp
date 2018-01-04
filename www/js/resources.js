(function() {

  function ManageResource(FirebaseResource) {
    return {
      'get': function(key) {
        return FirebaseResource.get(key);
      }
    };
  }

  function FirebaseResource($firebaseArray) {

    var self = this;

    self.ref = firebase.database().ref().child('app');
    // self.ref = new Firebase('https://sagar.firebaseio.com/app');

    return {
      'get': function(arg) {
        return $firebaseArray(self.ref.child(arg));
      },
      'route': function(arg) {
        return self.ref.child(arg);
      },
      'query': function(field) {
        var q = self.ref.child('menu').orderByChild("dish_category").equalTo(field);
        return $firebaseArray(q);
      }
    };
  }

  function DishResource(FirebaseResource, $firebaseObject) {
    return {
      'getRecord': function(key) {
        return $firebaseObject(FirebaseResource.route('menu').child(key));
      }
    };
  }

  function OrderResource(ManageResource, AuthService, $firebaseArray, $firebaseObject, FirebaseResource, $localStorage, $state, $q) {

    var self = this;
    var url = FirebaseResource.route('orders');

    return {
      'confirm': function(order, auth) {

        var deferred = $q.defer();

        var key;

        console.log(auth)
        if (AuthService.getAuth()) {
          self.order = {
            // order_time:
            items: order.basket,
            phone: order.phone,
            time: +new Date(),
            address: order.selected_address,
            delivery_type: order.delivery_type,
            total: order.total,
            user: auth.uid,
            status: 'Your order is being prcessed',
            order_status: 0
          };

          console.log(self.order);
          // add order to admin db
          ManageResource.get('orders').$add(self.order).then(function(snap) {
            console.log(snap.key);
            key = snap.key;


            // add order to user db
            var list = $firebaseArray(FirebaseResource.route('accounts').child(auth.uid).child('orders'));
            list.$add(key).then(function(snap) {
              console.log("saved to user db", snap);

              console.log("clear basket ");
              $localStorage.clearObject('basket');

              deferred.resolve(snap);


            });


          }, function(error){
            console.log(error);
          });


        } else {
          console.log("You have to sign in");
        }

        return deferred.promise;

      },
      'listByUser': function(uid) {
        var today = new Date();
        var yesterday = today;
        yesterday = yesterday.setDate(today.getDate() - 1)
        var u = url.orderByChild('user').startAt(uid).endAt(uid);
        return $firebaseArray(u);
      },
      'getById': function(order_id) {
        return $firebaseObject(FirebaseResource.route('orders').child(order_id));
      },
    };
  }

  function BasketResource(FirebaseResource, $firebaseArray) {
    return {
      'set': function(key) {
        return $firebaseArray(FirebaseResource.route('basket').child(key));
      }
    };
  }


  function ListMenuResource(FirebaseResource, $firebaseArray) {
    var url = FirebaseResource.route('menu');
    return {
      'byField': function(field) {
        var u = url.orderByChild('dish_category').equalTo(field);
        return $firebaseArray(u);
      }
    };
  }


  angular.module('app.services')
    .factory('ListMenuResource', ListMenuResource)
    .factory('FirebaseResource', FirebaseResource)
    .factory('BasketResource', BasketResource)
    .factory('DishResource', DishResource)
    .factory('ManageResource', ManageResource)
    .factory('OrderResource', OrderResource)

})();
