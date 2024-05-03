const generaLetra = document.getElementById('genera-letra-aleatoria');
const inputLetra = document.getElementById('input-letra');
const letrasResultado = document.getElementById('letras-resultado');
const trash = document.getElementById('trash');
const arrLetras = [];
const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
localStorage.setItem('letras', JSON.stringify(letras.split('')));
localStorage.setItem('countLetras', 0);
localStorage.setItem('letrasGeneradas', JSON.stringify([]));
localStorage.setItem('letrasRestantes', JSON.stringify([]));
generaLetra.addEventListener('click', (e) => {

    e.preventDefault();
    const lsLetras = localStorage.getItem('letras') ? JSON.parse(localStorage.getItem('letras')) : [];
    const lsLetrasGeneradas = localStorage.getItem('letrasGeneradas') ? JSON.parse(localStorage.getItem('letrasGeneradas')) : [];

    for (let i = 0; i < lsLetrasGeneradas.length; i++) {
        const index = lsLetras.indexOf(lsLetrasGeneradas[i]);
        if (index > -1) {
            lsLetras.splice(index, 1);
        }
    }
    localStorage.setItem('letrasRestantes', JSON.stringify(lsLetras));
    localStorage.setItem('countLetras', lsLetras.length - 1)
    const countLetras = localStorage.getItem('countLetras');

    const letraAleatoria = lsLetras[Math.floor(Math.random() * lsLetras.length)];
    inputLetra.classList.add('animate__animated', 'animate__flip');
    generaLetra.disabled = true;
    inputLetra.value = '?';
    setTimeout(() => {
        inputLetra.classList.remove('animate__animated', 'animate__flip');
        generaLetra.disabled = false;
        inputLetra.value = letraAleatoria;
        arrLetras.push(letraAleatoria);

        // quitar letraAleatoria del array lsLetras
        const l = JSON.parse(localStorage.getItem('letrasRestantes'));
        const index = l.indexOf(letraAleatoria);
        if (index > -1) {
            l.splice(index, 1);
        }

        localStorage.setItem('letrasRestantes', JSON.stringify(l));
        let restantes = JSON.parse(localStorage.getItem('letrasRestantes'));
        // join restantes
        restantes = restantes.join(' ');
        let letrasRestantes = `<span style="font-size: 1rem">${(restantes)}</span>`;
        let textCount = countLetras >= 1 ? `<br><span style="font-size: 1.5rem">Restantes: ${countLetras}</span>` : '';
        letrasResultado.innerHTML = arrLetras.join(' ') + textCount + '<br>' + (letrasRestantes);
        localStorage.setItem('letrasGeneradas', JSON.stringify(arrLetras));
        if (parseInt(countLetras) === 0) {
            localStorage.setItem('letras', JSON.stringify(letras.split('')))
            localStorage.setItem('letrasGeneradas', JSON.stringify([]));
            localStorage.setItem('countLetras', 0)
            arrLetras.length = 0;
            letrasResultado.innerHTML += '<div class="mt-3">Ya no hay letras<br>¡Vuelve a empezar!</div>';
            return;
        }
    }, 700);

});
trash.addEventListener('click', (e) => {
    e.preventDefault();
    letrasResultado.innerHTML = '<span id="nueva-partida" class="animate__animated animate__fadeInDown">¡Nueva Partida!</span>';
    setTimeout(() => {
        let a = document.getElementById('nueva-partida');
        a.classList.remove('animate__animated', 'animate__fadeInDown');
        a.classList.add('animate__animated', 'animate__fadeOutDown');
        setTimeout(() => {
            a.classList.remove('animate__animated', 'animate__fadeOutDown');
            letrasResultado.innerHTML = '';
        }, 1000);
    }, 1500);
    inputLetra.value = '?';
    localStorage.setItem('letrasGeneradas', JSON.stringify([]));
    arrLetras.length = 0;
    localStorage.setItem('countLetras', 0)
});