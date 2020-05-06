class Despesa{
  constructor(ano, mes, dia, tipo, descricao, valor){
    this.ano = ano;
    this.mes = mes;
    this.dia = dia;
    this.tipo = tipo;
    this.descricao = descricao;
    this.valor = valor;
  }
  validarDados(){
    for(let i in this){
      if(this[i] == undefined || this[i]=='' || this[i] == null){
        return false;
      }
    }
    return true;
  }
}

class BD{
  constructor(){
    let id = localStorage.getItem('id');
    if(id === null){
      localStorage.setItem('id', 0);
    }
  }
  getProximoId(){
    let proximoId = localStorage.getItem('id');
    return parseInt(proximoId) + 1;
  }
  gravar(d){
    let id = this.getProximoId();
    localStorage.setItem(id,JSON.stringify(d));
    localStorage.setItem('id', id); //atualiza para o proximo id
  }
  recuperarRegistros(){
    let despesas = Array();
    let id = localStorage.getItem('id');
    for (let i = 1; i <= id; i++) {
      let despesa = JSON.parse(localStorage.getItem(i));
      
      if(despesa === null){
        continue;//pula pra o proxiimo
      }
      despesa.id = i;
      despesas.push(despesa);
    }

    return despesas;
  }

  pesquisar(despesa){
   let despesasFiltradas = Array();
   despesasFiltradas = this.recuperarRegistros();
   //ano
   if(despesa.ano != ''){
    despesasFiltradas = despesasFiltradas.filter(d => d.ano == despesa.ano);
   }
   //mes
   if(despesa.mes != ''){
    despesasFiltradas = despesasFiltradas.filter(d => d.mes == despesa.mes);
   }
   //dia
   if(despesa.dia != ''){
    despesasFiltradas = despesasFiltradas.filter(d => d.dia == despesa.dia);
   }
   //tipo
   if(despesa.tipo != ''){
    despesasFiltradas = despesasFiltradas.filter(d => d.tipo == despesa.tipo);
   }
   //valor
   if(despesa.descricao != ''){
    despesasFiltradas = despesasFiltradas.filter(d => d.descricao == despesa.descricao);
   }
   //descrição
   if(despesa.valor != ''){
    despesasFiltradas = despesasFiltradas.filter(d => d.valor == despesa.valor);
   }

   return despesasFiltradas;

  }

  remover(id){
    try{
      localStorage.removeItem(id);
      return true;
    }catch(error){
      return false;
    }
  }
}

let bd = new BD()

function cadatrarDespesa(){
  let ano = document.getElementById('ano');
  let mes = document.getElementById('mes');
  let dia = document.getElementById('dia');
  let tipo = document.getElementById('tipo');
  let descricao = document.getElementById('descricao');
  let valor = document.getElementById('valor');

  let despesa = new Despesa(
    ano.value,
    mes.value,
    dia.value,
    tipo.value,
    descricao.value,
    valor.value
  );

  if(despesa.validarDados()){
    bd.gravar(despesa);
    document.getElementById('modal_titulo').innerHTML = 'Sucesso!';
    document.getElementById('modal_titulo').className = 'text-success';
    document.getElementById('modal_msg').innerHTML = 'Registro inserido com sucesso!';
    document.getElementById('modal_btn').innerHTML = 'Ok!';
    document.getElementById('modal_btn').className = 'btn btn-success';
    $('#modalDespesa').modal('show');
    ano.value = '' 
		mes.value = ''
		dia.value = ''
		tipo.value = ''
		descricao.value = ''
		valor.value = ''
  }else{
    document.getElementById('modal_titulo').innerHTML = 'Erro!';
    document.getElementById('modal_titulo').className = 'text-danger';
    document.getElementById('modal_msg').innerHTML = 'Verifique os dados informados nos campos e tente novamente!';
    document.getElementById('modal_btn').innerHTML = 'Corrigir';
    document.getElementById('modal_btn').className = 'btn btn-danger';
    $('#modalDespesa').modal('show');
  }
}

function carregaListaDespesa(despesas = Array(), filtro = false){

  if(despesas.length == 0 && filtro == false){
    despesas = bd.recuperarRegistros();
  }
  //drlrcionao otbody
  let listaDespesas = document.getElementById('listaDespesas');
  listaDespesas.innerHTML = '';
  despesas.forEach(function(d){
    //criando linha (tr)
    let linha = listaDespesas.insertRow();
    //inseriri valor | criar (td)
    linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`;
    switch (d.tipo) {
      case '1':
        linha.insertCell(1).innerHTML = 'Alimentação'
        break;
      case '2':
        linha.insertCell(1).innerHTML = 'Educação';
        break;
      case '3':
        linha.insertCell(1).innerHTML = 'Lazer';
        break;
      case '4':
        linha.insertCell(1).innerHTML = 'Saude';
        break;
      case '5':
        linha.insertCell(1).innerHTML = 'Transporte';
        break;
      default:
        linha.insertCell(1).innerHTML = 'Null';
        break;
    }
    linha.insertCell(2).innerHTML = d.descricao;
    linha.insertCell(3).innerHTML = d.valor;

    let btn = document.createElement("button");
    btn.className = 'btn btn-sm btn-danger';
    btn.innerHTML = '<i class="fas fa-times"></i>';
    btn.id = `despesa${d.id}`;
    btn.onclick = function(){
      let id = this.id.replace('despesa','');
      if(bd.remover(id)){
        document.getElementById('modal_titulo').innerHTML = 'Sucesso!';
        document.getElementById('modal_titulo').className = 'text-success';
        document.getElementById('modal_msg').innerHTML = `Registro: ${this.id}, excluido com sucesso!`;
        document.getElementById('modal_btn').innerHTML = 'Ok!';
        document.getElementById('modal_btn').className = 'btn btn-success';
        $('#modalDespesa').modal('show');
        window.location.reload();
      }else{
        document.getElementById('modal_titulo').innerHTML = 'Erro!';
        document.getElementById('modal_titulo').className = 'text-danger';
        document.getElementById('modal_msg').innerHTML = `Erro ao excluir o registro: &bnsp; ${this.id},<br>Recarregue a página e tente novamente!`;
        document.getElementById('modal_btn').innerHTML = 'Corrigir';
        document.getElementById('modal_btn').className = 'btn btn-danger';
        $('#modalDespesa').modal('show');
      }
    }
    linha.className = 'text-center';
    linha.insertCell(4).append(btn);

  });
}

function pesquisarSDespesa(){
  let dia = document.getElementById('dia').value;
  let mes = document.getElementById('mes').value;
  let ano = document.getElementById('ano').value;
  let tipo = document.getElementById('tipo').value;
  let descricao = document.getElementById('descricao').value;
  let valor = document.getElementById('valor').value;

  let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor);
  let despesas = bd.pesquisar(despesa);

  this.carregaListaDespesa(despesas, true);
}

var data = new Date();
numDia = data.getDate();
numMes = data.getMonth() +1;
numAno = data.getFullYear();
numDiasMes = new Date(numAno, numMes, 0).getDate();

function carregaAno(){
  
  for(let i=5;i>=0; i--){
    let ano = document.getElementById("ano");

    let opt0 = document.createElement("option");
    opt0.value = data.getFullYear() + i;
    opt0.text = data.getFullYear() + i;
    ano.add(opt0, ano.options[0]);
  }
}

function carregaDia(){
  for(let i=numDiasMes;i >= numDia; i--){
    let dia = document.getElementById("dia");
    let opt0 = document.createElement("option");
    opt0.value = parseFloat(i);
    opt0.text = i;
    dia.add(opt0, dia.options[0]);
  }
}

