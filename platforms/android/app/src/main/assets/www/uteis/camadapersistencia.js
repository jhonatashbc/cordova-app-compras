"use strict";
let inicio = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        var db;
        if (window.cordova.platformId === 'browser'){
            db = window.openDatabase('compras', '1.0', 'Data', 2*1024*1024);
        }else{
            db = window.sqlitePlugin.openDatabase({name: 'compras.db', location: 'default'});
        } 
        db.transaction(function(tx) {
            tx.executeSql('CREATE TABLE IF NOT EXISTS compra (id INTEGER PRIMARY KEY, nome TEXT, data TEXT)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS itemcompra (id INTEGER PRIMARY KEY, produto TEXT, preco FLOAT, compra INTEGER)');
            tx.executeSql('CREATE TABLE IF NOT EXISTS produto (id INTEGER PRIMARY KEY, nome TEXT, preco FLOAT, codbarra TEXT)');
        }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
        }, function() {
            console.log('Banco iniciado');
        });       
    }
};
inicio.initialize();