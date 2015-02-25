var Parse = require('parse').Parse;

var Wish = Parse.Object.extend('Wish', {}, {
  createByObject: function(obj, cb) {
    var instance = new Wish(obj);
    instance.save({
      success: function(obj) {
        console.log('final wish', obj);
        cb(obj);
      }
    });
  },

  create: function(pageName) {
    var instance = new Wish();
    instance.set('pageName', pageName);
    instance.set('content', 'No content... *yet*.');
    instance.save();
    return instance;
  },

  getByPageName: function(pageName, cb) {
    var collection = new Wish.Collection();
    collection.query = new Parse.Query(Wish);
    collection.query.equalTo('objectId', pageName);
    collection.fetch({
      success: function(obj) {
        cb(obj.models[0]);// || Wish.create(pageName, defaultContent)
      },
      error: function(obj, err) {
        console.error('getByPageName() error', obj, err);
      }
    });
  },

  getAll: function(source, page, limit, user, cb) {
    if(!limit) limit = 50;
    if(!page) page = 1;
    var collection = new Wish.Collection();
    var all = [];
    collection.query = new Parse.Query(Wish);
    collection.query.skip((page - 1) * limit);//default 0
    collection.query.limit(limit);
    collection.query.descending("createdAt");
    if(user) collection.query.equalTo("user", user);
    collection.fetch({
      success: function(obj) {
        var its = obj.models.map(function(item){
          return item;
        })
        cb(obj);
      },
      error: function(obj, err) {
        console.error('getAll() error', obj, err);
      }
    });
  },

  getFaved: function(source, page, limit, user, cb) {
    if(!limit) limit = 50;
    if(!page) page = 1;
    var collection = new Wish.Collection();
    var all = [];
    collection.query = new Parse.Query(Wish);
    collection.query.skip((page - 1) * limit);//default 0
    collection.query.limit(limit);
    if(user) collection.query.equalTo("user", user);
    collection.query.equalTo("isFaved", true);
    collection.fetch({
      success: function(obj) {
        var its = obj.models.map(function(item){
          return item;
        })
        cb(obj);
      },
      error: function(obj, err) {
        console.error('getFaved() error', obj, err);
      }
    });
  }

});

Wish.Collection = Parse.Collection.extend({
  model: Wish,

  createContent: function(pageName) {
    this.add(Wish.create(pageName));
  }
});

module.exports = Wish;