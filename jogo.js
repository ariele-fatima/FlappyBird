console.log('[DevSoutinho] Flappy Bird');

let frames = 0;
const som_HIT = new Audio();
som_HIT.src = './efeitos/hit.wav';

const sprites = new Image();
sprites.src = './sprites.png';

const canvas = document.querySelector('canvas');
const contexto = canvas.getContext('2d');

let melhorPontuacao = 0;

//[Plano de Fundo]
const planoDeFundo = {
  spriteX: 390,
  spriteY: 0,
  largura: 275,
  altura: 204,
  x: 0,
  y: canvas.height - 204,
  desenha() {
    contexto.fillStyle = '#70c5ce';
    contexto.fillRect(0,0, canvas.width, canvas.height)

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      planoDeFundo.x, planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );

    contexto.drawImage(
      sprites,
      planoDeFundo.spriteX, planoDeFundo.spriteY,
      planoDeFundo.largura, planoDeFundo.altura,
      (planoDeFundo.x + planoDeFundo.largura), planoDeFundo.y,
      planoDeFundo.largura, planoDeFundo.altura,
    );
  },
};

//[Chao]
function criaChao() {
  const chao = {
    spriteX: 0,
    spriteY: 610,
    largura: 224,
    altura: 112,
    x: 0,
    y: canvas.height - 112,
    atualiza() {
      const movimentoDoChao = 1;
      const repeteEM = chao.largura / 2;
      const movimentacao = chao.x - movimentoDoChao;
      chao.x = movimentacao % repeteEM;      
    },
    desenha() {
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        chao.x, chao.y,
        chao.largura, chao.altura,
      );
  
      contexto.drawImage(
        sprites,
        chao.spriteX, chao.spriteY,
        chao.largura, chao.altura,
        (chao.x + chao.largura), chao.y,
        chao.largura, chao.altura,
      );
    },
  };
  return chao;
}


function fazColisao(flappyBird, chao) {
  const flappyBirdY = flappyBird.y + flappyBird.altura;
  const chaoY = chao.y;

  if(flappyBirdY >= chaoY) {
    return true;
  }
  return false;
}

function criaFlappyBird(){
  const flappyBird = {
    spriteX: 0,
    spriteY: 0,
    largura: 33,
    altura: 24,
    x: 10,
    y: 50,
    gravidade: 0.25, 
    velocidade: 0,
    pulo: 4.6,
    pula() {
      flappyBird.velocidade = - flappyBird.pulo;
    },
    atualiza() {
      if(fazColisao(flappyBird, globais.chao)){
        som_HIT.play();
        
        mudaParaTela(Telas.GAME_OVER);        
        return;
      }
      flappyBird.velocidade = flappyBird.velocidade + flappyBird.gravidade;
      flappyBird.y = flappyBird.y + flappyBird.velocidade;
    },
    movimentos: [
      { spriteX: 0, spriteY: 0,  },
      { spriteX: 0, spriteY: 26, },
      { spriteX: 0, spriteY: 52, }, 
    ],
    frameAtual: 0,
    atualizaOFrameAtual() {
      const intervaleDoFrames = 10;
      const passouOIntervalo = frames % intervaleDoFrames === 0;
      if(passouOIntervalo ) {
        const baseDoIncremento = 1;
        const incremento = baseDoIncremento + flappyBird.frameAtual;
        const baseRepeticao = flappyBird.movimentos.length;
        flappyBird.frameAtual = incremento % baseRepeticao;
      }
    },
    desenha() {
      flappyBird.atualizaOFrameAtual();
      const {spriteX, spriteY} = flappyBird.movimentos[flappyBird.frameAtual];

      contexto.drawImage(
        sprites,
        spriteX, spriteY, // Sprite X, Sprite Y
        flappyBird.largura, flappyBird.altura, // Tamanho do recorte na sprite
        flappyBird.x, flappyBird.y,
        flappyBird.largura, flappyBird.altura,
      );
    },
  }

  return flappyBird;
}




//[mensagemGetReady]
const mensagemGetReady = {
  sX: 134,
  sY: 0,
  w: 174,
  h: 152,
  x: (canvas.width / 2) - 174 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGetReady.sX, mensagemGetReady.sY,
      mensagemGetReady.w, mensagemGetReady.h,
      mensagemGetReady.x, mensagemGetReady.y,
      mensagemGetReady.w, mensagemGetReady.h
    );
  },
};

//[mensagemGameOver]
const mensagemGameOver = {
  sX: 134,
  sY: 153,
  w: 226,
  h: 200,
  x: (canvas.width / 2) - 226 / 2,
  y: 50,
  desenha() {
    contexto.drawImage(
      sprites,
      mensagemGameOver.sX, mensagemGameOver.sY,
      mensagemGameOver.w, mensagemGameOver.h,
      mensagemGameOver.x, mensagemGameOver.y,
      mensagemGameOver.w, mensagemGameOver.h
    );
  },
  atualiza(pontuacao, melhorPlacar){
    
    //Placar Final
    contexto.font = '30px "VT323"';
    contexto.fillStyle = 'black';
    contexto.fillText(`${pontuacao}`, canvas.width - 80, 145);
    if(pontuacao > melhorPlacar){
      melhorPontuacao = pontuacao;
    }
    contexto.fillText(`${melhorPontuacao}`, canvas.width - 80, 190);

  },
};



function criaCanos() {
  const canos = {
    largura: 52,
    altura: 400,
    chao: {
      spriteX: 0,
      spriteY: 169,
    },
    ceu: {
      spriteX: 52,
      spriteY: 169,
    },
    espaco: 80,
    desenha() {      
      canos.pares.forEach(function(par) {
        const yRandom = par.y;
        const espacamentoEntroCanos = 90;
  
        const canoCeuX = par.x;
        const canoCeuY = yRandom;
        // [Cano do Céu]
        contexto.drawImage(
          sprites,
          canos.ceu.spriteX, canos.ceu.spriteY,
          canos.largura, canos.altura,
          canoCeuX, canoCeuY,
          canos.largura, canos.altura,
        )
  
        // [Cano do Chão]
        const canoChaoX = par.x;
        const canoChaoY = canos.altura + espacamentoEntroCanos + yRandom;
        contexto.drawImage(
          sprites,
          canos.chao.spriteX, canos.chao.spriteY,
          canos.largura, canos.altura,
          canoChaoX, canoChaoY,
          canos.largura, canos.altura,
        )

        par.canoCeu = {
          x: canoCeuX,
          y: canos.altura + canoCeuY
        }
        par.canoChao = {
          x: canoChaoX,
          y: canoChaoY  
        }
      })
    },
    temColisaoComOFlappyBird(par){
      const cabecaDoFlappy = globais.flappyBird.y;
      const peDoFlappy = globais.flappyBird.y + globais.flappyBird.altura;

      if((globais.flappyBird.x + globais.flappyBird.largura) >= par.x){
        if(cabecaDoFlappy <= par.canoCeu.y){
          return true;
        }
        if(peDoFlappy >= par.canoChao.y){
          return true;
        }
      }
      return false;
    },
    pares: [],
    atualiza() {
      const passou100Frames = frames % 100 === 0;
      if(passou100Frames){
        canos.pares.push({          
          x: canvas.width,
          y: -150 * (Math.random() + 1),
        });
      }

      canos.pares.forEach(function(par){
        par.x = par.x - 2;

        if(canos.temColisaoComOFlappyBird(par)){
          som_HIT.play();
          mudaParaTela(Telas.GAME_OVER);
        }

        if(par.x  + canos.largura <= 0){
          canos.pares.shift();
        } 
      });

    }
  }
  return canos;
}

function criarPlacar(){
  const placar = {
    pontuacao: 0,
    desenha(){
      contexto.font = '35px "VT323"';
      contexto.textAlign = 'right';
      contexto.fillStyle = 'white';
      contexto.fillText(`${placar.pontuacao}`, canvas.width - 10, 35);
      placar.pontuacao
    },
    atualiza(){
      const intervaloDeFrames = 20;
      const passouOIntervalo = frames % intervaloDeFrames === 0;

      if(passouOIntervalo){
        placar.pontuacao = placar.pontuacao + 1;
      }
    }
  }
  return placar;
}


//[Medalha]
function criarMedalha() {
  const medalha = {
    spriteX: 0,
    spriteY: 78,
    largura: 44,
    altura: 44,
    x: 73,
    y: 137,
    pontuacaoFeita(pontuacao) { 
      if(pontuacao >= 3 & pontuacao <= 5){
        medalha.spriteX = 48
      } 
      if(pontuacao >= 6  & pontuacao <= 8){
        medalha.spriteY = 124
      }
      if(pontuacao >= 9){
        medalha.spriteX = 48,
        medalha.spriteY = 124
      }
    },
    desenha(pontuacao) {
      medalha.pontuacaoFeita(pontuacao);
      contexto.drawImage(
        sprites,
        medalha.spriteX, medalha.spriteY,
        medalha.largura, medalha.altura,
        medalha.x, medalha.y,
        medalha.largura, medalha.altura,
      );
    }
  }
  return medalha;
}


//[Telas]
const globais = {};
let telaAtiva = {};
function mudaParaTela(novaTela) {
  telaAtiva = novaTela;
  if(telaAtiva.inicializa) {
    telaAtiva.inicializa();
  }
}

const Telas = {
  INICIO: {
    inicializa() {
      globais.flappyBird = criaFlappyBird();
      globais.chao = criaChao();
      globais.canos = criaCanos();

    },
    desenha() {
      planoDeFundo.desenha();
      globais.flappyBird.desenha();
      globais.chao.desenha();
      mensagemGetReady.desenha();
    }, 
    click () {
      mudaParaTela(Telas.JOGO);
    },
    atualiza() {
      globais.chao.atualiza();
    }
  }
};

Telas.JOGO = {
  inicializa(){
    globais.placar = criarPlacar();
  },
  desenha() {
    planoDeFundo.desenha();
    globais.canos.desenha();
    globais.chao.desenha();
    globais.flappyBird.desenha();
    globais.placar.desenha();
  },
  click () {
    globais.flappyBird.pula();
  },
  atualiza (){
    globais.canos.atualiza();
    globais.chao.atualiza();
    globais.flappyBird.atualiza();
    globais.placar.atualiza();
  }
}


Telas.GAME_OVER = {
  inicializa(){
    globais.medalha = criarMedalha();
  },
  desenha(){    
    mensagemGameOver.desenha();
    globais.medalha.desenha(globais.placar.pontuacao);
  },
  atualiza(){
    mensagemGameOver.atualiza(globais.placar.pontuacao, melhorPontuacao);
  },
  click(){
    mudaParaTela(Telas.INICIO)
  }
}

function loop() {
    
  telaAtiva.desenha();
  telaAtiva.atualiza();

  frames = frames + 1;
  requestAnimationFrame(loop);
}

window.addEventListener('click', function() {
  if(telaAtiva.click) {
    telaAtiva.click();
  }
});

mudaParaTela(Telas.INICIO);
loop();