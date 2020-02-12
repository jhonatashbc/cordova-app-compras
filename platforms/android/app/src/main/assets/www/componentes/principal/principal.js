let principal = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        pesquisarTodos();
    }
};
principal.initialize();

function pesquisarTodos(){
    let daoCompra = new PersistenciaCompras();
    daoCompra.pesquisarTodos(function(dados){
            if(dados != null && dados != undefined){
                // let env = parseCompra(dados);
                mostrarDados(dados);
            }
        });
    }

function parseCompra(dados){
    let compras = [];
    dados.forEach(e => {
        compra = [];
        compra.push(e.id);
        compra.push(e.nome);
        compra.push(e.data);
        compras.push(compra);
    });
    return compras;
}

function mostrarDados(objetos) {
    try {
        let daoCompra = new PersistenciaCompras();
        let daoItem = new PersistenciaItemCompra();
        let corpo = document.getElementById("corpo");
        corpo.innerHTML = "";
        let item;
        if (objetos != null) {
            for (item of objetos) {
                let itemcodigo = item.id;

                daoItem.pesquisarTodos(itemcodigo, function (itens) {
                    if(Array.from(itens).length != 0){
                        let total = 0;
                        Array.from(itens).forEach(function(e){total+= parseFloat(e.preco)});
                        element(itemcodigo+"qtd").innerHTML = Array.from(itens).length;
                        element(itemcodigo+"total").innerHTML = "R$"+total.toFixed(2).replace('.', ',').toString();
                    }else{
                        let total = 0;
                        element(itemcodigo+"qtd").innerHTML = "0";
                        element(itemcodigo+"total").innerHTML = "R$"+total.toFixed(2).replace('.', ',').toString();
                    }
                })


                let funcaoCompra = function () {
                    entrarCompra(itemcodigo);
                };
                let funcaoAlterar = function () {
                    prepararAlteracao(itemcodigo);
                };
                let funcaoExcluir = function () {
                    if (confirm("Confirma a exclusão?")) {
                       daoCompra.excluir(itemcodigo);
                        pesquisarTodos();
                        exibirNotificacaoSucesso("Excluído com sucesso!");
                    }
                };

                let h6Card2 = criarElemento('h6', [], 'font-weight-bold mb-1 icone');
                h6Card2.textContent = item.nome;
                let pCard2 = criarElemento('p', [], 'mb-0');
                pCard2.textContent = formatarData(item.data);
                let card2 = criarElemento('div', [], 'card-body pt-0');
                card2.appendChild(h6Card2);
                card2.appendChild(pCard2);
                card2.onclick = funcaoAlterar;

                let divhr = criarElemento('div',[],'divhr');

                let p1 = criarElemento('p', [{"nome":"id", "valor":itemcodigo+"qtd"}], 'mb-0 h5');
                p1.textContent = "0";
                let p2 = criarElemento('p', [{"nome":"id", "valor":itemcodigo+"total"}], 'mb-0 hour');
                p2.textContent = 'R$0,00';
                let div2 = criarElemento('div', [], 'd-flex justify-content-between');
                div2.appendChild(p1);
                div2.appendChild(p2);

                let i = criarElemento('i', [], 'fas fa-shopping-cart fa-2x pb-3 icone');
                let span2 = criarElemento('span');
                span2.appendChild(i);
                span2.onclick = funcaoCompra;
                let iExcluir = criarElemento('i', [], 'far fa-trash-alt fa-2x pb-3 icone-excluir');
                let span = criarElemento('span');
                span.appendChild(iExcluir);
                span.onclick = funcaoExcluir;
                let divIcones = criarElemento('div', [], 'd-flex justify-content-between');
                divIcones.appendChild(span2);
                divIcones.appendChild(span);

                let div1 = criarElemento('div', [], 'card-body pb-0');
                div1.appendChild(divIcones);
                div1.appendChild(div2);         

                let div0 = criarElemento('div', [], 'card bg-principal shadow lighten-2');
                div0.appendChild(div1);
                div0.appendChild(divhr);
                div0.appendChild(card2);

                let divPrincipal = criarElemento('div', [], 'col-6 p-1');
                divPrincipal.appendChild(div0);              
                                
                corpo.appendChild(divPrincipal);
            }
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

function prepararAlteracao(id){
    window.location = '../cadastrarCompra/cadastrarCompra.html?id='+id;
}

function cadastrarCompra(){
    window.location = '../cadastrarCompra/cadastrarCompra.html';
}

function entrarCompra(id){
    window.location = '../compras/compras.html?id='+id;
}

function goToHome(){
    window.location = './principal.html';
}
    
function mostrar(data){
    console.log(data);
}