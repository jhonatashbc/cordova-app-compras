let persistenciaItemCompra = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        if (window.cordova.platformId === 'browser'){
            db = window.openDatabase('compras', '1.0', 'Data', 2*1024*1024);
        }else{
            db = window.sqlitePlugin.openDatabase({name: 'compras.db', location: 'default'});
        }        
    }
};
persistenciaItemCompra.initialize();

class PersistenciaItemCompra {
    constructor(){}
    
    merge(itemCompra = {}){
        db.transaction(function(tx) {                
            if(itemCompra.id == null || itemCompra.id == undefined){
                tx.executeSql('INSERT INTO itemcompra VALUES (?,?,?,?)', [null, itemCompra.produto, itemCompra.preco, itemCompra.compra]);
            }
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Populated database OK');
          });
    }

    excluir(id){
        db.transaction(function(tx) {                
            if(id != null && id != undefined){
                tx.executeSql('DELETE FROM itemcompra where id = ?', [id]);
            }else{                
                return;
            }
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Populated database OK');
          });
    }

    pesquisarTodos(compra, exec){
        let itemCompras = [];
         db.transaction(function(tx) {          
            tx.executeSql('SELECT * FROM itemcompra where compra = ?', [compra], function(tx, rs) {                        
              if (window.cordova.platformId === 'browser'){
                itemCompras = Array.from(rs.rows);
              }else{
                for(let i =0; i < rs.rows.length; i++){
                  itemCompras.push(rs.rows.item(i));
                }
              }    
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
            });          
            
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Select OK');
            exec(itemCompras);
          });
    }

    pesquisarPorID(id, exec){
        let itemCompra;
         db.transaction(function(tx) {          
            tx.executeSql('SELECT * FROM itemcompra where id = ?', [id], function(tx, rs) {                        
              if (window.cordova.platformId === 'browser'){
                itemCompra = rs.rows[0];
              } else{
                itemCompra = rs.rows.item(0);
              }    
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
            });          
            
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Select OK');
            exec(itemCompra);
          });
    }

    executeSql(sql){
        db.transaction(function(tx) {          
            tx.executeSql(sql, [], function(tx, rs) {                        
               console.log(rs);
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
            });          
            
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Populated database OK');
          });
    }


}