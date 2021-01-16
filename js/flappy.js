function novoElemento(tagName, className) {
    const elemento = document.createElement(tagName);
    elemento.className = className;
    return elemento;
}

function Barreira(isBarreiraReversa = false) {
    this.elemento = novoElemento('div', 'barreira')
    const borda = novoElemento('div', 'borda')
    const corpo = novoElemento('div', 'corpo')
    /*appendChild -> Adiciona um novo elemento ao DOM, ele cria um filho de um elemento já existente*/
    this.elemento.appendChild(isBarreiraReversa ? corpo : borda)
    this.elemento.appendChild(isBarreiraReversa ? borda : corpo)
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// const barreira = new Barreira(true);
// barreira.setAltura(200);
// document.querySelector('[wm-flappy]').appendChild(barreira.elemento)

function ParBarreiras(altura, abertura, x) {
    this.elemento = novoElemento('div', 'par-de-barreiras')

    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    this.sorteadAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura)
        const alturaInferior = altura - abertura - alturaSuperior
        this.superior.setAltura(alturaSuperior)
        this.inferior.setAltura(alturaInferior)
    }

    this.getX = () => {
        return parseInt(this.elemento.style.left.split('px')[0]);
    }
    this.setX = x => {
        return this.elemento.style.left = `${x}px`;
    }
    this.getLargura = () => {
        return this.elemento.clientWidth;
    }
    this.sorteadAbertura()
    this.setX(x)
}

// const barreira = new ParBarreiras(700, 200, 400)
// document.querySelector('[wm-flappy]').appendChild(barreira.elemento)

function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    this.pares = [new ParBarreiras(altura, abertura, largura),
    new ParBarreiras(altura, abertura, largura + espaco),
    new ParBarreiras(altura, abertura, largura + espaco * 2),
    new ParBarreiras(altura, abertura, largura + espaco * 3)]
    const deslocamento = 3
    this.animar = () => {
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)
            /*Quando o elemento sair da tela do jogo*/
            verificaBarreiraSaiuTela(par);
            verificaCruzouMeio(par);
        })
    }

    function verificaCruzouMeio(par) {
        const meio = largura / 2;
        const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio;
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
    let voando = false

    this.elemento = novoElemento = ('img', 'passaro')
    this.elemento.src = 'imgs/passaro.png'

    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    this.setY = y => this.elemento.style.bottom = `${y}px`

    window.onkeydown = e => voando = true
    window.onkeyup = e => voando = false
    
    this.animar = () => {
        const novoY = this.getY() + (voando ? 8 : -5)
        const alturaMaxima = alturaJogo - this.elemento.clientHeight
        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }

        this.setY(alturaJogo / 2)
    }
    console.log(this.elemento.src)
}

const barreiras = new Barreiras(700, 1200, 200, 400)
const passaro = new Passaro(700)
const areaJogo = document.querySelector('[wm-flappy]')

areaJogo.appendChild(passaro.elemento)
barreiras.pares.forEach(e => areaJogo.appendChild(e.elemento))
setInterval(() => {
    barreiras.animar()
    passaro.animar()
}, 20)