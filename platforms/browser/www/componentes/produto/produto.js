"use strict";

let produto = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        criarTable();
        carregarDados();
    }
};
produto.initialize();

class Produto{
    constructor(codigo, nome, preco, codBarra){
        this.codigo = codigo;
        this.nome = nome;
        this.preco = preco;
        this.codBarra = codBarra;
    }
}

function carregarDados(){
    let codigo = getParameterFromURL("id");
    let cod = getParameterFromURL("codbarra");
    if(cod != '' || cod != undefined){
        element('codbarras').value = cod;
    }
    pesquisarTodos();
}

function gravar() {
    try {
        if (validarDados()) {
            cadastrarProduto();
            pesquisarTodos();
            limparTela();
        } else {
            exibirMensagemCamposObrigatorios();
        }
    } catch (error) {
        mensagemErro(error);
    }
}

function cadastrarProduto() {
    let dao = new PersistenciaProduto();
    let nome = element("nome").value;
    let preco = element("preco").value;
    let codBarra = element("codbarras").value;
    let produto = new Produto(null, nome, preco, codBarra);
    dao.merge(produto);
}

function validarDados() {
    let nome = element("nome").value;
    let preco = element("preco").value;
    let codBarra = element("codbarras").value;
    return !(nome == "" || codBarra == "" || preco == "");
}

function pesquisarTodos(){
    let dao = new PersistenciaProduto();
    dao.pesquisarTodos(function(dados){
            if(dados != null && dados != undefined){
                mostrarDados(dados);
            }
        });
    }

function criarTable(){
    $('#corpo').DataTable({   
        "initComplete": function (settings, json) {
            $('#corpo_wrapper').find('label').each(function () {
                             $(this).parent().append($(this).children());
            });
            $('#corpo_filter').find('input').attr('placeholder', 'Pesquisar');
            $('#corpo_filter').find('input').removeClass('form-control-sm');
            $('#corpo_wrapper .dataTables_filter').addClass('md-form');
            $('#corpo_wrapper .dataTables_filter').find('label').remove();
            $('#corpo_info').remove();
                                    
          },          
          "columns": [          
              { "data": "nome" },
              { "data": "codbarra" },
              { "data": "preco", 
                "render": function ( data, type, row ) {
                    return 'R$'+ data.toFixed(2).replace('.', ',').toString();
                }
            
              },
              {
                "className": 'details-control',
                "orderable": false,
                "data": null,
                "defaultContent": '',
                "render": function () {
                    return '<i class="far fa-trash-alt icone" aria-hidden="true"></i>';
                },
                width:"15px"
            },
        ],
        "language": {
            "emptyTable": "Nenhum produto cadastrado"
          },
        paging: false,
        scrolly: false,
        ordering: false,
      }); 
}

    function mostrarDados(objetos) {
        try {
            let dao = new PersistenciaProduto();
            var table = $('#corpo').DataTable();
            if (objetos != null && objetos != undefined && objetos.length != 0) {                                  
                let funcaoExcluir = function (itemcodigo) {
                    if (confirm("Confirma a exclusão?")) {
                        dao.excluir(itemcodigo);
                        pesquisarTodos();
                        exibirNotificacaoSucesso("Excluído com sucesso!");
                    }
                };
                               
                table.clear();
                table.rows.add(objetos).draw();
                
                $('#corpo tbody').off();

                $('#corpo tbody').on('click', 'td.details-control', function () {
                    var tr = $(this).closest('tr');
                    var row = table.row(tr);
                    let d = row.data();
                    funcaoExcluir(d.id);    
                  });
            }else{
                table.clear();
                table.rows.add(objetos).draw();
                $('#corpo tbody').off();
            }
        } catch (error) {
            mensagemErro(error);
        }
    }

    function limparTela(){
        element("id").value = '';
        element("nome").value = '';
        element("preco").value = '';
        element("codbarras").value = '';
    }


function run(){
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (result.cancelled != true) {
                element('codbarras').value = result.text;
            }
        },
        function (error) {
            mensagemErro("Falha no escaneamento: " + error);
        }
     );
}

function prepararAlteracao(id){
    window.location = '../produto/produto.html?id='+id;
}

function GoBack(){
    window.history.back();
}

function GoToMain(){
    window.location = "../principal/principal.html";
}
