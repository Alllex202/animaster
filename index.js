addListeners();

function animaster() {
  /**
 * Блок плавно появляется из прозрачного.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
  function fadeIn(element, duration) {
    element.style.transitionDuration = `${duration}ms`;
    element.classList.remove('hide');
    element.classList.add('show');
  }

  /**
 * Блок плавно исчезает.
 * @param element — HTMLElement, который надо анимировать
 * @param duration — Продолжительность анимации в миллисекундах
 */
  function fadeOut(element, duration) {
    element.style.transitionDuration = `${duration}ms`;
    element.classList.remove('show');
    element.classList.add('hide');
  }

  /**
   * Функция, передвигающая элемент
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   * @param translation — объект с полями x и y, обозначающими смещение блока
   */
  function move(element, duration, translation) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(translation, null);
  }

  /**
   * Функция, увеличивающая/уменьшающая элемент
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   * @param ratio — во сколько раз увеличить/уменьшить. Чтобы уменьшить, нужно передать значение меньше 1
   */
  function scale(element, duration, ratio) {
    element.style.transitionDuration = `${duration}ms`;
    element.style.transform = getTransform(null, ratio);
  }

  /**
   * Блок должен одновременно сдвигаться на 100 пикселей вправо и на 20 вниз, а потом исчезать. Метод на вход должен принимать продолжительность анимации. При этом 2/5 времени блок двигается, 3/5 — исчезает.
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   */
  function moveAndHide(element, duration) {
    const [moveDuration, hideDuration] = [duration * 2 / 5, duration * 3 / 5];
    setTimeout(() => move(element, moveDuration, { x: 100, y: 20 }), 0);
    setTimeout(() => fadeOut(element, hideDuration), moveDuration);
  }

  /**
   * Блок должен появиться, подождать и исчезнуть. Каждый шаг анимации длится 1/3 от времени, переданного аргументом в функцию.
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   */
  function showAndHide(element, duration) {
    const stepDuration = duration / 3;
    setTimeout(() => fadeIn(element, stepDuration), 0);
    setTimeout(() => fadeOut(element, stepDuration), stepDuration * 2);
  }

  /**
   * Имитация сердцебиения. Сначала элемент должен увеличиться в 1,4 раза, потом обратно к 1. Каждый шаг анимации занимает 0,5 секунды. Анимация должна повторяться бесконечно.
   * @param element — HTMLElement, который надо анимировать
   * @param duration — Продолжительность анимации в миллисекундах
   */
  function heartBeating(element) {
    const duration = 500;

    function play() {
      heartBeatingtimer = setTimeout(() => scale(element, duration, 1.4), 0);
      heartBeatingtimer = setTimeout(() => scale(element, duration, 1), duration);
      heartBeatingtimer = setTimeout(() => play(), duration * 2);
    }

    function start() {
      if (element.classList.contains('animation')) {
        return;
      }
      heartBeatingtimer = null;
      element.classList.add('animation');
      play()
    }

    function stop() {
      if (!element.classList.contains('animation')) {
        return;
      }
      clearTimeout(heartBeatingtimer);
      element.classList.remove('animation');
    }
    return { start, stop }
  }

  function resetFadeIn(element) {
    element.style.transitionDuration = null;
  }

  function resetFadeOut(element) {
    element.style.transitionDuration = null;
  }

  function resetMoveAndScale(element) {
    element.style.transitionDuration = null;
    element.style.transform = null;
  }

  return {
    fadeIn, move, scale, fadeOut, moveAndHide, showAndHide,
    heartBeating, resetFadeIn, resetFadeOut, resetMoveAndScale,
  }
}

function addListeners() {
  document.getElementById('fadeInPlay')
    .addEventListener('click', function () {
      const block = document.getElementById('fadeInBlock');
      animaster().fadeIn(block, 5000);
    });

  document.getElementById('fadeOutPlay')
    .addEventListener('click', function () {
      const block = document.getElementById('fadeOutBlock');
      animaster().fadeOut(block, 5000);
    });

  document.getElementById('movePlay')
    .addEventListener('click', function () {
      const block = document.getElementById('moveBlock');
      animaster().move(block, 1000, { x: 100, y: 10 });
    });

  document.getElementById('scalePlay')
    .addEventListener('click', function () {
      const block = document.getElementById('scaleBlock');
      animaster().scale(block, 1000, 1.25);
    });

  document.getElementById('moveAndHidePlay')
    .addEventListener('click', function () {
      const block = document.getElementById('moveAndHideBlock');
      animaster().moveAndHide(block, 2000);
    });

  document.getElementById('showAndHidePlay')
    .addEventListener('click', function () {
      const block = document.getElementById('showAndHideBlock');
      animaster().showAndHide(block, 3000);
    });

  document.getElementById('heartBeatingPlay')
    .addEventListener('click', function () {
      const block = document.getElementById('heartBeatingBlock');
      animaster().heartBeating(block).start();
    });

  document.getElementById('heartBeatingStop')
    .addEventListener('click', function () {
      const block = document.getElementById('heartBeatingBlock');
      animaster().heartBeating(block).stop();
    });
    
  document.getElementById('moveAndHideReset')
    .addEventListener('click', function () {
      const block = document.getElementById('moveAndHideBlock');
      animaster().moveAndHide(block).stop();
    });
}

function getTransform(translation, ratio) {
  const result = [];
  if (translation) {
    result.push(`translate(${translation.x}px,${translation.y}px)`);
  }
  if (ratio) {
    result.push(`scale(${ratio})`);
  }
  return result.join(' ');
}
