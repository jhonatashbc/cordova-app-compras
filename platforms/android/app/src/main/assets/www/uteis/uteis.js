"use strict";

// document.addEventListener("backbutton", onBackKeyDown, false);

// function onBackKeyDown(e) {
//     e.preventDefault();
//     a = window.location.toString();
//     if(a.includes('principal.html')){
//         if (confirm("Deseja realmente sair?")) {
//             navigator.app.exitApp();
//         }
//     }
// }

function navegarPrincipal() {
    window.location = "../telas/principal.html";
}

function navegarPrincipalComMensagemSucesso(mensagem) {
    window.location = "../telas/principal.html?mensagemSucesso=" + encodeURI(mensagem);
}

function mensagemErro(err) {
    exibirNotificacaoErro("Erro não previsto: " + err.message);
}

function element(id) {
    return document.getElementById(id);
}

function setFocus(id) {
    var field = document.getElementById(id);
    if (field != null) {
        field.focus();
    }
}

function configurarDataAtual(id) {
    document.getElementById(id).valueAsDate = new Date();
}

function exibirNotificacaoSucesso(str) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr.success(str, "Notificação")
}

function exibirNotificacaoAlerta(str) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr.warning(str, "Notificação")
}

function exibirNotificacaoErro(str) {
    toastr.options = {
        "closeButton": true,
        "debug": false,
        "positionClass": "toast-bottom-right",
        "onclick": null,
        "showDuration": "1000",
        "hideDuration": "1000",
        "timeOut": "5000",
        "extendedTimeOut": "2000",
        "showEasing": "swing",
        "hideEasing": "linear",
        "showMethod": "fadeIn",
        "hideMethod": "fadeOut"
    }
    toastr.error(str, "Notificação")
}

function processarMensagens() {
    let mensagemSucesso = getParameterFromURL("mensagemSucesso");
    if (mensagemSucesso != null){
        exibirNotificacaoSucesso(decodeURI(mensagemSucesso));
    }    
    let mensagemAlerta = getParameterFromURL("mensagemAlerta");
    if (mensagemAlerta != null){
        exibirNotificacaoAlerta(decodeURI(mensagemAlerta));
    }    
    let mensagemErro = getParameterFromURL("mensagemErro");
    if (mensagemErro != null){
        exibirNotificacaoErro(decodeURI(mensagemErro));
    }    
}

function getParameterFromURL(name) {
    let results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
    if (results != null) {
        return results[1] || 0; 
    } else {
        return null;
    }
}

function exibirMensagemCamposObrigatorios(){
    exibirNotificacaoAlerta("Verifique se os campos obrigatórios foram preenchidos corretamente!");
}

function formatarData(data) {
    let todayTime = new Date(data);
    let month = todayTime.getMonth() + 1;
    let day = todayTime.getUTCDate();
    let year = todayTime.getFullYear();
    return formatarDiaMes(day) + "/" + formatarDiaMes(month) + "/" + year;
}

function formatarDiaMes(n = 0) {
    return n < 10 ? "0" + n : n;
}

function formatarFloatParaValor(val) {
    var formatter = new Intl.NumberFormat('pt-BR', {
        style: 'decimal',
        currency: 'BRL',
        minimumFractionDigits: 2
    });
    return formatter.format(val);
}

function converterValorParaFloat(val){
    let a = val.replace(".","").replace(",",".");
    let b = parseFloat(a);
    return (b);
}

function goToCompras(){
    window.location = window.location = "../principal/principal.html";
}

function goToProduto(){
    window.location = window.location = "../produto/produto.html";
}

function GoBack(){
    window.history.back();
}

$(document).ready(function () {
    $("#sidebarCollapse").on("click", function () {
        $("#sidebar").toggleClass("active");
        $("#empresa").toggleClass("d-none");
        $("#tela").toggleClass("d-none");
    });
    if ($(window).width() <= 600) {
        // show menu on swipe to right
        $(document).on("swiperight", function(e) {

            if ($("#sidebar").hasClass("active")) {
                $("#sidebar").toggleClass("active");
                $("#empresa").toggleClass("d-none");
                $("#tela").toggleClass("d-none");
            }

        });
        // hide menu on swipe to left
        $(document).on("swipeleft", function(e) {

            if (!$("#sidebar").hasClass("active")) {
                $("#sidebar").toggleClass("active");
                $("#empresa").toggleClass("d-none");
                $("#tela").toggleClass("d-none");
            }
        });
    }
    $(".ui-loader")[0].style.display = "none";
});

function expandir(){
    $("#lista").toggleClass("bank-app-active");
}