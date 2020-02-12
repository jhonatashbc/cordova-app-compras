let compra = {
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },
    receivedEvent: function(id) {
        carregarDados();
    }
};
compra.initialize();

class Compra{
    constructor(id, nome, data){
        this.id = id;
        this.nome = nome;
        this.data = data;
    }
}

function carregarDados(){
    let codigo = getParameterFromURL("id");
    let daoCompra = new PersistenciaCompras();
    element('data').valueAsDate = new Date();
    if(codigo != null && codigo != undefined){
        daoCompra.pesquisarPorID(codigo, function (compra){
            element('id').value = compra.id;
            element('nome').value = compra.nome;
            element('data').value = compra.data;
        })
    }
}

function salvar(){
    try{
        if(validarDados()){
            let compra = criarBean();
            let daoCompra = new PersistenciaCompras();
            daoCompra.merge(compra);
            window.history.back();
        }else{
            exibirMensagemCamposObrigatorios();
        }
    }catch(e){
        mensagemErro(error);
    }
}

function criarBean(){
    let compra = new Compra();
    compra.id = element('id').value == '' ? null : element('id').value ;
    compra.nome = element('nome').value;
    compra.data = element('data').value;
    return compra;
}

function validarDados(){
    let nome =  element('nome').value;
    let data = element('data').value;
    return !(nome == "" || data == "");
}

function limparDados(){
    element('nome').value = '';
    element('data').valueAsDate = new Date();
}
    
function mostrar(data){
    console.log(data);
}