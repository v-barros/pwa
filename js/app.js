/*
Variáveis Globais
*/
let pubkey = "857887736006beb0cbe489b8f4eabefd";
let quant_jogos = 29;
let contar = 0;
let movie_api_base_url = "https://api.themoviedb.org/3"
let movies = "data.json";
let data_json_file;
let data_json;
let content = document.getElementById("content");
let loadArea = document.getElementById("load-area");
let btLoad = document.getElementById("btLoadMore");
let catTitle = document.getElementById("catTitle");
let btInstall = document.getElementById("btInstall");
let filter_game = "";

/*
AJAX Carregar Jogos
*/

// if(this.readyState == 4 && this.status == 200){

//     dados_json = JSON.parse(this.responseText);        

//     if(dados_json.length > 0){

//         let conteudo_html = "";

//         for(var i = 0; i < dados_json.length; i++){

//             conteudo_html+= categoria(dados_json[i].categoria);

//             if(dados_json[i].profissional.length == 0){

//                 conteudo_html+= '<div class="row"><div class="col-12">'+alerta("Não há profissionais cadastrados para esta categoria", "warning")+'</div></div>';

//             }else{
//                 conteudo_html+= '<div class="row">';

//                 for(var j = 0; j < dados_json[i].profissional.length; j++){
                
//                     conteudo_html+= card_profissional(dados_json[i].profissional[j]);

//                 }

//                 conteudo_html+= '</div>';
//             }

//         }

//         conteudo.innerHTML = conteudo_html;

//         cache_dinamico(dados_json);

//     }else{
//         conteudo.innerHTML = alerta("Não há profissionais cadastrados na plataforma", "warning");
//     }
//}
function loadFromFile(){
    let ajax = new XMLHttpRequest();

    ajax.open("GET", movies, true);
    ajax.send();

    ajax.onreadystatechange = function (){

        if(this.readyState == 4 && this.status == 200){
            data_json_file = JSON.parse(this.responseText);
            
            if(data_json_file.length > 0){
                for(var i = 0; i < data_json_file.length; i++){
                    loadFromApi(i);
                }
            }
            
           // setTimeout(() => {
                //console.log(data_json);
               // loadArea.style.display = "block";

          //  }, 500);

        }
    }

}
function loadFromApi(i){

    let ajax = new XMLHttpRequest();
   // let temp_json = data_json.filter(d => filter_game.includes(d.id));
   // ajax.setAttribute("api_key",pubkey);
    ajax.open("GET", movie_api_base_url+"/movie/"+data_json_file[i].id+"?api_key="+pubkey, true);
    ajax.send();

    ajax.onreadystatechange = function (){

        if(this.readyState == 4 && this.status == 200){
            data_json = JSON.parse(this.responseText);

            
            setTimeout(() => {
                //console.log(data_json);
                loadArea.style.display = "block";
                printCard();

            }, 500);

        }
    }

}

loadFromFile();

/*
Imprimir Card
*/
function printCard(){    

    let html_content = "";
    content.innerHTML = html_content;

    if(data_json){
        
        loadMore();

    }else{
        html_content = msg_alert("Nenhum jogo cadastrado!", "warning");
        content.append = html_content;
    }

}

function loadMore(){

    //let temp_json =  filter_game === "" ? data_json : data_json.filter(d => filter_game.includes(d.genre));

    let html_content = "";
    let final = (contar+quant_jogos);

    // if(final > data_json_file.length){
    //     final = data_json_file.length
    //     loadArea.style.display = "none";
    // }

    //console.log(temp_json);
    
    for(let i = contar; i < final; i++ ){
        html_content+=card(data_json_file[i]);
        console.log(data_json_file[i]);
    }

    contar+=quant_jogos;
    content.innerHTML += html_content;
}

/*
Filtro de Categoria
*/

// var btCategoria = function(categoria)
// {
//     loadArea.style.display = "block";
//     contar = 0;
//     filter_game = categoria;
//     document.getElementById("catTitle").innerHTML = categoria || "Todos os Gêneros";
//     content.innerHTML = "";
//     loadMore();
// }


/*
Template Engine
*/

card = function ({id, title, year}){

   // let botao = navegacao == true ? `<div class="card-footer"><div class="d-grid gap-2"><a class="btn btn-info" target="_blank" href="1">Acessar Game</a></div></div>` : "";

  //  let thumb = navegacao == true ? thumbnail : "img/no_img.jpg";
    let thumb = "img/no_img.jpg"
    return `<div class="col-12 col-md-6 col-lg-4 d-flex align-items-stretch">
            <div class="card">
                <img src="${thumb}" class="card-img-top">
                <div class="card-body">
                    <h5 class="card-title">${title}</h5>
                   
                     <p><strong>Ano de referência: ${year}</strong></p>

                </div>
            </div>
        </div>`;
}

msg_alert = function (msg, tipo){

    return `<div class="col-12 col-md-6"><div class="alert alert-${tipo}" role="alert">${msg}</div></div>`;
}

/*
Botão de Instalação
*/

let windowInstall = null;

window.addEventListener('beforeinstallprompt', callInstallWindow);

function callInstallWindow(evt){
    windowInstall = evt;
}

let initInstall = function(){

    setTimeout(function(){
        if(windowInstall != null)
            btInstall.removeAttribute("hidden");
    }, 500);

    btInstall.addEventListener("click", function(){

        btInstall.setAttribute("hidden", true);

        windowInstall.prompt();
        
        windowInstall.userChoice.then((choice) => {

            if(choice.outcome === 'accepted'){
                console.log("Usuário instalou o app");
            }else{
                console.log("Usuário recusou instalação");
                btInstall.removeAttribute("hidden");
            }

        });

    });
}

/*
Status do Navegado
*/

let navegacao = true;

window.addEventListener("load", (event) => {
    //console.log(navigator.onLine ? "Online" : "OFFline");
    navigator.onLine ? navegacao = true : navegacao = false;
});