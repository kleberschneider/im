
window.onload = function() {

  var messagesEl = document.querySelector('.messages');
  var typingSpeed = 70;
  var loadingText = '<b>•</b><b>•</b><b>•</b>';
  var messageIndex = 0;

  var getCurrentTime = function() {
    var date = new Date();
    var hours =  date.getHours();
    var minutes =  date.getMinutes();
    var current = hours + (minutes * .01);
    if (current >= 1 && current < 5) return 'Está tarde... vai dormir! kkk';
    if (current >= 5 && current < 12) return 'Um bom dia por aí!';
    if (current >= 12 && current < 18) return 'Uma boa tarde por aí!';
    if (current >= 18 || current < 3) return 'Uma boa noite por aí!';
  }


  var messages = [
    'Olá, stalker! 👋🏼',
    'Cê me encontrou, Kleber Schneider aqui! 🙋🏻',
    'Eu projeto e codifico coisas na web.',
    'Por exemplo, posso construir:',
    'lojas virtuais, portfolios, aplicações web...',
    'Achei que você precisasse saber disso. 🙈',
    'Enfim...',
    'Sabia que ontem mesmo estava olhando seu perfil?',
    'Gostei muito das fotos!!! 👏🏼👏🏼',
    'Mas parece que falta algo ali!',
    'Por que não mostra para seus amigos o que faz?',
    'Isso mesmo, um portfolio bem bonito e e-mail personalizado!',
    'Aproveite o espaço - e o tempo consumido! - 🤘🏼',
    'Mostre que você se leva a sério e se coloque na vitrine! :)',
    'Se quiser falar mais sobre isso, <a href="mailto:via.instagram@pm.me?subject=CRIAÇÃO%20PORTFOLIO%20-%20PROFISSIONAL%20&body=Hey,%20Kleber!%20:)%0D%0A%0D%0AAchei%20bacana%20a%20idéia%20de%20ter%20meu%20portfolio%20interativo,%20profissional%20e%20personalizado,%20assim%20como%20ter%20um%20email@profissional(.)com.%0D%0A%0D%0AMas%20antes,%20eu%20quero%20dizer%20o%20que%20preciso:%0D%0A%0D%0A%0D%0A%0D%0A">estou sempre online</a>! 😉',
    'Acho que já falei demais! hahah',
    'Se quiser apenas me stalkear, <a href="http://kleberschneider.com" target="_blank">aqui é o lugar certo</a>!',
    getCurrentTime(),
    '👀 Até mais!! 👋🏼'
  ]

  var getFontSize = function() {
    return parseInt(getComputedStyle(document.body).getPropertyValue('font-size'));
  }

  var pxToRem = function(px) {
    return px / getFontSize() + 'rem';
  }

  var createBubbleElements = function(message, position) {
    var bubbleEl = document.createElement('div');
    var messageEl = document.createElement('span');
    var loadingEl = document.createElement('span');
    bubbleEl.classList.add('bubble');
    bubbleEl.classList.add('is-loading');
    bubbleEl.classList.add('cornered');
    bubbleEl.classList.add(position === 'right' ? 'right' : 'left');
    messageEl.classList.add('message');
    loadingEl.classList.add('loading');
    messageEl.innerHTML = message;
    loadingEl.innerHTML = loadingText;
    bubbleEl.appendChild(loadingEl);
    bubbleEl.appendChild(messageEl);
    bubbleEl.style.opacity = 0;
    return {
      bubble: bubbleEl,
      message: messageEl,
      loading: loadingEl
    }
  }

  var getDimentions = function(elements) {
    return dimensions = {
      loading: {
        w: '4rem',
        h: '2.25rem'
      },
      bubble: {
        w: pxToRem(elements.bubble.offsetWidth + 4),
        h: pxToRem(elements.bubble.offsetHeight)
      },
      message: {
        w: pxToRem(elements.message.offsetWidth + 4),
        h: pxToRem(elements.message.offsetHeight)
      }
    }
  }

  var sendMessage = function(message, position) {
    var loadingDuration = (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + 500;
    var elements = createBubbleElements(message, position);
    messagesEl.appendChild(elements.bubble);
    messagesEl.appendChild(document.createElement('br'));
    var dimensions = getDimentions(elements);
    elements.bubble.style.width = '0rem';
    elements.bubble.style.height = dimensions.loading.h;
    elements.message.style.width = dimensions.message.w;
    elements.message.style.height = dimensions.message.h;
    elements.bubble.style.opacity = 1;
    var bubbleOffset = elements.bubble.offsetTop + elements.bubble.offsetHeight;
    if (bubbleOffset > messagesEl.offsetHeight) {
      var scrollMessages = anime({
        targets: messagesEl,
        scrollTop: bubbleOffset,
        duration: 750
      });
    }
    var bubbleSize = anime({
      targets: elements.bubble,
      width: ['0rem', dimensions.loading.w],
      marginTop: ['2.5rem', 0],
      marginLeft: ['-2.5rem', 0],
      duration: 800,
      easing: 'easeOutElastic'
    });
    var loadingLoop = anime({
      targets: elements.bubble,
      scale: [1.05, .95],
      duration: 1100,
      loop: true,
      direction: 'alternate',
      easing: 'easeInOutQuad'
    });
    var dotsStart = anime({
      targets: elements.loading,
      translateX: ['-2rem', '0rem'],
      scale: [.5, 1],
      duration: 400,
      delay: 25,
      easing: 'easeOutElastic',
    });
    var dotsPulse = anime({
      targets: elements.bubble.querySelectorAll('b'),
      scale: [1, 1.25],
      opacity: [.5, 1],
      duration: 300,
      loop: true,
      direction: 'alternate',
      delay: function(i) {return (i * 100) + 50}
    });
    setTimeout(function() {
      loadingLoop.pause();
      dotsPulse.restart({
        opacity: 0,
        scale: 0,
        loop: false,
        direction: 'forwards',
        update: function(a) {
          if (a.progress >= 65 && elements.bubble.classList.contains('is-loading')) {
            elements.bubble.classList.remove('is-loading');
            anime({
              targets: elements.message,
              opacity: [0, 1],
              duration: 300,
            });
          }
        }
      });
      bubbleSize.restart({
        scale: 1,
        width: [dimensions.loading.w, dimensions.bubble.w ],
        height: [dimensions.loading.h, dimensions.bubble.h ],
        marginTop: 0,
        marginLeft: 0,
        begin: function() {
          if (messageIndex < messages.length) elements.bubble.classList.remove('cornered');
        }
      })
    }, loadingDuration - 50);
  }

  var sendMessages = function() {
    var message = messages[messageIndex];
    if (!message) return;
    sendMessage(message);
    ++messageIndex;
    setTimeout(sendMessages, (message.replace(/<(?:.|\n)*?>/gm, '').length * typingSpeed) + anime.random(900, 1200));
  }

  sendMessages();

}
