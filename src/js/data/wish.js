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

  getByPageName: function(pageName, defaultContent, cb) {
    var collection = new Wish.Collection();
    collection.query = new Parse.Query(Wish);
    collection.query.equalTo('idx', pageName);
    collection.fetch({
      success: function(obj) {
        cb(obj.models[0] || Wish.create(pageName, defaultContent));
      },
      error: function(obj, err) {
        console.error('getByPageName() error', obj, err);
      }
    });
  },

  getAll: function(source, cb) {
    console.log('getAll', source);
    var collection = new Wish.Collection();
    var all = [];
    collection.query = new Parse.Query(Wish);
    collection.fetch({
      success: function(obj) {
        cb(obj);
      },
      error: function(obj, err) {
        console.error('getAll() error', obj, err);
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