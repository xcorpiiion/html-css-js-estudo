"use strict";

function novoElemento(tagName, className) {
  var elemento = document.createElement(tagName);
  elemento.className = className;
  return elemento;
}

function Barreira() {
  var isBarreiraReversa = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : false;
  this.elemento = novoElemento('div', 'barreira');
  var borda = novoElemento('div', 'borda');
  var corpo = novoElemento('div', 'corpo');
  /*appendChild -> Adiciona um novo elemento ao DOM, ele cria um filho de um elemento já existente*/

  this.elemento.appendChild(isBarreiraReversa ? corpo : borda);
  this.elemento.appendChild(isBarreiraReversa ? borda : corpo);

  this.setAltura = function (altura) {
    return corpo.style.height = "".concat(altura, "px");
  };
} // const barreira = new Barreira(true);
// barreira.setAltura(200);
// document.querySelector('[wm-flappy]').appendChild(barreira.elemento)


function ParBarreiras(altura, abertura, x) {
  var _this = this;

  this.elemento = novoElemento('div', 'par-de-barreiras');
  this.superior = new Barreira(true);
  this.inferior = new Barreira(false);
  this.elemento.appendChild(this.superior.elemento);
  this.elemento.appendChild(this.inferior.elemento);

  this.sorteadAbertura = function () {
    var alturaSuperior = Math.random() * (altura - abertura);
    var alturaInferior = altura - abertura - alturaSuperior;

    _this.superior.setAltura(alturaSuperior);

    _this.inferior.setAltura(alturaInferior);
  };

  this.getX = function () {
    return parseInt(_this.elemento.style.left.split('px')[0]);
  };

  this.setX = function (x) {
    return _this.elemento.style.left = "".concat(x, "px");
  };

  this.getLargura = function () {
    return _this.elemento.clientWidth;
  };

  this.sorteadAbertura();
  this.setX(x);
} // const barreira = new ParBarreiras(700, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(barreira.elemento)


function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
  var _this2 = this;

  this.pares = [new ParBarreiras(altura, abertura, largura), new ParBarreiras(altura, abertura, largura + espaco), new ParBarreiras(altura, abertura, largura + espaco * 2), new ParBarreiras(altura, abertura, largura + espaco * 3)];
  var deslocamento = 3;

  this.animar = function () {
    _this2.pares.forEach(function (par) {
      par.setX(par.getX() - deslocamento);
      /*Quando o elemento sair da tela do jogo*/

      verificaBarreiraSaiuTela(par);
      verificaCruzouMeio(par);
    });
  };

  function verificaCruzouMeio(par) {
    var meio = largura / 2;
    var cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio;

    if (cruzouMeio) {
      notificarPonto();
    }
  }

  function verificaBarreiraSaiuTela(par) {
    if (par.getX() < -par.getLargura()) {
      par.setX(par.getX() + espaco * this.pares.length);
      par.sorteadAbertura();
    }
  }
}

function Passaro(alturaJogo) {
  var _this3 = this;

  var voando = false;
  this.elemento = novoElemento = ('img', 'passaro');
  this.elemento.src = 'imgs/passaro.png';

  this.getY = function () {
    return parseInt(_this3.elemento.style.bottom.split('px')[0]);
  };

  this.setY = function (y) {
    return _this3.elemento.style.bottom = "".concat(y, "px");
  };

  window.onkeydown = function (e) {
    return voando = true;
  };

  window.onkeyup = function (e) {
    return voando = false;
  };

  this.animar = function () {
    var novoY = _this3.getY() + (voando ? 8 : -5);
    var alturaMaxima = alturaJogo - _this3.elemento.clientHeight;

    if (novoY <= 0) {
      _this3.setY(0);
    } else if (novoY >= alturaMaxima) {
      _this3.setY(alturaMaxima);
    } else {
      _this3.setY(novoY);
    }

    _this3.setY(alturaJogo / 2);
  };

  console.log(this.elemento.src);
}

var barreiras = new Barreiras(700, 1200, 200, 400);
var passaro = new Passaro(700);
var areaJogo = document.querySelector('[wm-flappy]');
areaJogo.appendChild(passaro.elemento);
barreiras.pares.forEach(function (e) {
  return areaJogo.appendChild(e.elemento);
});
setInterval(function () {
  barreiras.animar();
  passaro.animar();
}, 20);