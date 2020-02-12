let persistenciaProduto = {
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
}; persistenciaProduto.initialize();

class PersistenciaProduto {
    constructor(){}
    
    merge(produto = {}){
        db.transaction(function(tx) {                
            if(produto.id == null || produto.id == undefined){
                tx.executeSql('INSERT INTO produto VALUES (?,?,?,?)', [null, produto.nome, produto.preco, produto.codBarra]);
            }else{
                tx.executeSql("UPDATE produto set nome = ?, data = ? where id = ?", [produto.nome, produto.preco, produto.codBarra, produto.id],
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
                tx.executeSql('DELETE FROM produto where id = ?', [id]);
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
        let produtos = [];
         db.transaction(function(tx) {          
            tx.executeSql('SELECT * FROM produto', [], function(tx, rs) {                        
              if (window.cordova.platformId === 'browser'){
                produtos = Array.from(rs.rows);
              }else{
                for(let i =0; i < rs.rows.length; i++){
                  produtos.push(rs.rows.item(i));
                }
              }    
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
            });          
            
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Select OK');
            exec(produtos);
          });
    }

    pesquisarPorID(id, exec){
        let produto;
         db.transaction(function(tx) {          
            tx.executeSql('SELECT * FROM produto where id = ?', [id], function(tx, rs) {                        
              if (window.cordova.platformId === 'browser'){
                produto = rs.rows[0];
              } else{
                produto = rs.rows.item(0);
              }    
            }, function(error) {
                console.log('SELECT SQL statement ERROR: ' + error.message);
            });          
            
          }, function(error) {
            console.log('Transaction ERROR: ' + error.message);
          }, function() {
            console.log('Select OK');
            exec(produto);
          });
    }

    pesquisarPorCodBarra(cod, exec){
      let produto;
       db.transaction(function(tx) {          
          tx.executeSql('SELECT * FROM produto where codbarra = ?', [cod], function(tx, rs) {                        
            if (window.cordova.platformId === 'browser'){
              produto = rs.rows[0];
            } else{
              produto = rs.rows.item(0);
            }    
          }, function(error) {
              console.log('SELECT SQL statement ERROR: ' + error.message);
          });          
          
        }, function(error) {
          console.log('Transaction ERROR: ' + error.message);
        }, function() {
          console.log('Select OK');
          exec(produto);
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