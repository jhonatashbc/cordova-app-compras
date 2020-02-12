"use strict";

let itemCompra = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        carregarDados();
    }
};
itemCompra.initialize();

class ItemCompra{
    constructor(codigo, produto, preco, compra){
        this.codigo = codigo;
        this.produto = produto;
        this.preco = preco;
        this.compra = compra;
    }
}

function carregarDados(){
    let codigo = getParameterFromURL("id");
    let daoCompra = new PersistenciaCompras();
    if(codigo != null && codigo != undefined){
        daoCompra.pesquisarPorID(codigo, function (compra){
            element('ncompra').textContent = compra.id;
            element('compranome').textContent = compra.nome;
        })
    }
    limparTela();
    pesquisarTodos(codigo);
}

function gravar() {
    try {
        if (validarDados()) {
            cadastrarProduto();
            pesquisarTodos(element('ncompra').textContent);
            limparTela();
        } else {
            exibirMensagemCamposObrigatorios();
        }
    } catch (error) {
        mensagemErro(error);
    }
}

function cadastrarProduto() {
    let dao = new PersistenciaItemCompra();
    let produto = element("produto").value;
    let preco = element("preco").value;
    let quantidade = parseInt(element("quantidade").value);
    let compra = element('ncompra').textContent;
    for (let i = 1; i <= quantidade; i++) {
        let itemCompra = new ItemCompra(null, produto, preco, compra);
        dao.merge(itemCompra);
    }
}

function validarDados() {
    let produto = element("produto").value;
    let quantidade = element("quantidade").value;
    let preco = element("preco").value;
    return !(produto == "" || quantidade == "" || preco == "");
}

function pesquisarTodos(id){
    let daoCompra = new PersistenciaItemCompra();
    daoCompra.pesquisarTodos(id,function(dados){
            if(dados != null && dados != undefined){
                mostrarDados(dados);
            }
        });
    }

    function mostrarDados(objetos) {
        try {
            let daoCompra = new PersistenciaItemCompra();
            let corpo = document.getElementById("itens");
            corpo.innerHTML = "Nenhum item cadastrado";
            element('total').innerHTML = "0,00";
            let item;
            if (objetos != null && objetos != undefined && objetos.length != 0) {
                corpo.innerHTML = "";
                for (item of objetos) {
                    let itemcodigo = item.id;                    
                    let funcaoExcluir = function () {
                        if (confirm("Confirma a exclusão?")) {
                           daoCompra.excluir(itemcodigo);
                           let id = element('ncompra').textContent
                            pesquisarTodos(id);
                            exibirNotificacaoSucesso("Excluído com sucesso!");
                        }
                    };
                    
                    let p1 = criarElemento('p', [], 'small font-weight-bold mb-0');
                    p1.textContent = item.produto;
                    let p2 = criarElemento('p', [], 'small font-weight-bold mb-0');
                    p2.textContent = item.preco.toFixed(2).replace('.', ',').toString()
                    let div1 = criarElemento('div', [], 'd-flex flex-column');

                    let iconeProduto = criarElemento('i', [{"nome": "aria-hidden", "valor": "true"}], 'fas fa-tag mr-4 classic-blue p-3 white-text rounded-circle');

                    let p3 = criarElemento('p', [], 'mb-0');

                    let div2 = criarElemento('div', [], 'd-flex justify-content-start align-items-center');

                    let iconeExcluir = criarElemento('i', [], 'far fa-trash-alt red-text p-4');
                    let p4 = criarElemento('p');

                    let div3 = criarElemento('div', [], 'list-group-item d-flex justify-content-between align-items-center border-0 px-0 fundo');

                    div1.appendChild(p1);
                    div1.appendChild(p2);

                    p4.appendChild(iconeExcluir);
                    p4.onclick = funcaoExcluir;
                    p3.appendChild(iconeProduto);

                    div2.appendChild(p3);
                    div2.appendChild(div1);

                    div3.appendChild(div2);
                    div3.appendChild(p4);
                    
                    corpo.appendChild(div3);
                }
                if(Array.from(objetos).length != 0){
                    let total = 0;
                    Array.from(objetos).forEach(function(e){total+= parseFloat(e.preco)});
                    element('total').innerHTML = total.toFixed(2).replace('.', ',').toString();
                }else{
                    let total = 0;
                    element('total').innerHTML = total.toFixed(2).replace('.', ',').toString();
                }
            }else{
                let total = 0;
                element('total').innerHTML = total.toFixed(2).replace('.', ',').toString();
            }
        } catch (error) {
            mensagemErro(error);
        }
    }

    function criarElemento(tag = "", atributos = [], classes = "", conteudo = "") {
        let elem = document.createElement(tag);
        atributos.forEach(e => {
            elem.setAttribute(e.nome, e.valor);
        });
        elem.classList = classes;
        elem.innerHTML = conteudo;
        return elem;
    }

    function limparTela(){
        element("produto").value = '';
        element("preco").value = '0.00';
        element("quantidade").value = '1';
    }


function run(){
    cordova.plugins.barcodeScanner.scan(
        function (result) {
            if (result.cancelled != true) {
                let daoProduto = new PersistenciaProduto();
                let p = daoProduto.pesquisarPorCodBarra(result.text, function(produto){
                    if(produto != undefined && produto != null){
                        element("produto").value = produto.nome;
                        element("preco").value = produto.preco;
                    }else{
                        window.location = "../produto/produto.html?codbarra="+result.text;
                    }
                })
            }
        },
        function (error) {
            mensagemErro("Falha no escaneamento: " + error);
        }
     );
}

function GoBack(){
    window.history.back();
}

function GoToMain(){
    window.location = "../principal/principal.html";
}
