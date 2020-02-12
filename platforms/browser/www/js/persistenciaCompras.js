let persistenciaCompra = {
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
persistenciaCompra.initialize();

class PersistenciaCompras {
    constructor(){}
    
    merge(compra = {}){
        db.transaction(function(tx) {                
            if(compra.id == null || compra.id == undefined){
                tx.executeSql('INSERT INTO compra VALUES (?,?,?)', [null, compra.nome, compra.data]);
            }else{
                tx.executeSql("UPDATE compra set nome = ?, data = ? where id = ?", [compra.nome, compra.data, compra.id],
                //On Success
                function(tx, result) {  
                    
                },
                //On Error
                function(error) {
                  exibirNotificacaoErro("Erro: "+erro);
                });
                
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
                tx.executeSql('DELETE FROM compra where id = ?', [id],
                //On Success
                function(tx, result) {  
                   tx.executeSql('delete from itemcompra where compra = ?', [id]);
                },
                //On Error
                function(error) {
                  exibirNotificacaoErro("Erro: "+erro);
                });

            }else{                
                return;
            }
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Populated database OK');
          });
    }

    pesquisarTodos(exec){
        let compras = [];
         db.transaction(function(tx) {          
            tx.executeSql('SELECT * FROM compra', [], function(tx, rs) { 
              if (window.cordova.platformId === 'browser'){
                compras = Array.from(rs.rows);
              }else{
                for(let i =0; i < rs.rows.length; i++){
                  compras.push(rs.rows.item(i));
                }
              }    
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
            });          
            
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Select OK');
            // element('teste').innerHTML = JSON.stringify(compras);
            exec(compras);
          });
    }

    pesquisarPorID(id, exec){
        let compra;
         db.transaction(function(tx) {          
            tx.executeSql('SELECT * FROM compra where id = ?', [id], function(tx, rs) {
              if (window.cordova.platformId === 'browser'){
                compra = rs.rows[0];
              } else{
                compra = rs.rows.item(0);
              }                       
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
            });          
            
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Select OK');
            exec(compra);
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