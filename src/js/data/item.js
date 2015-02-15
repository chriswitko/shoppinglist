var Parse = require('parse').Parse;

var Item = Parse.Object.extend('Item', {}, {
  createByObject: function(obj, cb) {
    var instance = new Item(obj);
    instance.save({
      success: function(obj) {
        cb(obj);
      }
    });
  },

  create: function(pageName) {
    var instance = new Item();
    instance.set('pageName', pageName);
    instance.set('content', 'No content... *yet*.');
    instance.save();
    return instance;
  },

  getByPageName: function(pageName, defaultContent, cb) {
    var collection = new Item.Collection();
    collection.query = new Parse.Query(Item);
    collection.query.equalTo('idx', pageName);
    collection.fetch({
      success: function(obj) {
        cb(obj.models[0] || Item.create(pageName, defaultContent));
      },
      error: function(obj, err) {
        console.error('getByPageName() error', obj, err);
      }
    });
  },

  getAll: function(source, cb) {
    console.log('getAll', source);
    var collection = new Item.Collection();
    var all = [];
    collection.query = new Parse.Query(Item);
    // collection.query.skip(page * limit);//default 0
    // collection.query.limit(2);
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

Item.Collection = Parse.Collection.extend({
  model: Item,

  createContent: function(pageName) {
    this.add(Item.create(pageName));
  }
});

module.exports = Item;