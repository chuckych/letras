// Cargar contenido de body.html y agregarlo al body
fetch('/body.html')
    .then(response => {
        if (!response.ok) {
            throw new Error('No se pudo cargar body.html');
        }
        return response.text();
    })
    .then(data => {
        // Insertar el contenido al inicio del body
        document.body.insertAdjacentHTML('afterbegin', data);
        
        // Inicializar las estrellas después de insertar el contenido
        if (window.initializeStars) {
            window.initializeStars();
        }
        
        // Inicializar elementos después de cargarlos
        inicializarApp();
    })
    .catch(error => {
        console.error('Error cargando body.html:', error);
        // Continuar inicializando la aplicación aunque falle la carga
        inicializarApp();
    });

// Función para inicializar la aplicación después de cargar el HTML
function inicializarApp() {
    const generaLetra = document.getElementById('genera-letra-aleatoria');
    const inputLetra = document.getElementById('input-letra');
    const letrasResultado = document.getElementById('letras-resultado');
    const trash = document.getElementById('trash');
    const cambiarModo = document.getElementById('cambiar-modo');
    const titulo = document.getElementById('titulo');
    const arrLetras = [];
    let modoActual = 'letras'; // 'letras' o 'numeros'

    // Constantes para los keys del localStorage
    const LS_KEYS = {
        LETRAS: 'letras',
        NUMEROS: 'numeros',
        COUNT: 'count',
        GENERADAS: 'generados',
        RESTANTES: 'restantes',
        MODO: 'modo'
    };

    // Inicialización del localStorage
    function inicializarLocalStorage() {
        const letrasIniciales = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
        const numerosIniciales = Array.from({length: 100}, (_, i) => i + 1);
        
        localStorage.setItem(LS_KEYS.LETRAS, JSON.stringify(letrasIniciales));
        localStorage.setItem(LS_KEYS.NUMEROS, JSON.stringify(numerosIniciales));
        localStorage.setItem(LS_KEYS.MODO, modoActual);
        
        if (modoActual === 'letras') {
            localStorage.setItem(LS_KEYS.COUNT, letrasIniciales.length);
            localStorage.setItem(LS_KEYS.GENERADAS, JSON.stringify([]));
            localStorage.setItem(LS_KEYS.RESTANTES, JSON.stringify(letrasIniciales));
        } else {
            localStorage.setItem(LS_KEYS.COUNT, numerosIniciales.length);
            localStorage.setItem(LS_KEYS.GENERADAS, JSON.stringify([]));
            localStorage.setItem(LS_KEYS.RESTANTES, JSON.stringify(numerosIniciales));
        }
    }

    inicializarLocalStorage();

// Función para obtener datos del localStorage
    function getFromStorage(key) {
        return JSON.parse(localStorage.getItem(key) || '[]');
    }

    // Función para cambiar de modo
    function cambiarModoJuego() {
        if (modoActual === 'letras') {
            modoActual = 'numeros';
            titulo.textContent = '¡Genera Número!';
            cambiarModo.innerHTML = '<svg class="bi" width="1em" height="1em"><use href="#shuffle"></use></svg> Cambiar a Letras';
        } else {
            modoActual = 'letras';
            titulo.textContent = '¡Genera Letra!';
            cambiarModo.innerHTML = '<svg class="bi" width="1em" height="1em"><use href="#shuffle"></use></svg> Cambiar a Números';
        }
        
        localStorage.setItem(LS_KEYS.MODO, modoActual);
inicializarLocalStorage();
    
    // Cargar el modo guardado al iniciar
    const modoGuardado = localStorage.getItem(LS_KEYS.MODO);
    if (modoGuardado && modoGuardado !== modoActual) {
        modoActual = modoGuardado;
        if (modoActual === 'numeros') {
            titulo.textContent = '¡Genera Número!';
            cambiarModo.innerHTML = '<svg class="bi" width="1em" height="1em"><use href="#shuffle"></use></svg> Cambiar a Letras';
        }
    }
        resetearJuego();
    }

    // Event listener para cambiar modo
    if (cambiarModo) {
        cambiarModo.addEventListener('click', cambiarModoJuego);
    }

// Función para actualizar el display
    function actualizarDisplay(elemento, count) {
        arrLetras.push(elemento);
        
        // Actualizar localStorage
        localStorage.setItem(LS_KEYS.GENERADAS, JSON.stringify(arrLetras));
        
        // Obtener y mostrar elementos restantes
        const restantes = getFromStorage(LS_KEYS.RESTANTES);
        const restantesText = restantes.join(' ');
        const restantesHtml = `<span style="font-size: 1rem">${restantesText}</span>`;
        
        // Crear texto del contador
        const textCount = count >= 1 
            ? `<br><span style="font-size: 1.5rem">Restantes: ${count}</span>` 
            : '';
        
        // Actualizar DOM
        letrasResultado.innerHTML = arrLetras.join(' ') + textCount + '<br>' + restantesHtml;
        
        // Verificar si ya no hay elementos
        if (parseInt(count) === 0) {
            resetearJuego();
            const mensaje = modoActual === 'letras' ? 'letras' : 'números';
            letrasResultado.innerHTML += `<div class="mt-3">Ya no hay ${mensaje}<br>¡Vuelve a empezar!</div>`;
        }
    }

// Función para resetear el juego
    function resetearJuego() {
        if (modoActual === 'letras') {
            const letrasIniciales = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
            localStorage.setItem(LS_KEYS.LETRAS, JSON.stringify(letrasIniciales));
            localStorage.setItem(LS_KEYS.RESTANTES, JSON.stringify(letrasIniciales));
            localStorage.setItem(LS_KEYS.COUNT, letrasIniciales.length);
        } else {
            const numerosIniciales = Array.from({length: 100}, (_, i) => i + 1);
            localStorage.setItem(LS_KEYS.NUMEROS, JSON.stringify(numerosIniciales));
            localStorage.setItem(LS_KEYS.RESTANTES, JSON.stringify(numerosIniciales));
            localStorage.setItem(LS_KEYS.COUNT, numerosIniciales.length);
        }
        localStorage.setItem(LS_KEYS.GENERADAS, JSON.stringify([]));
    }

// Event listener para generar elemento
    if (generaLetra) {
        generaLetra.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Obtener datos del localStorage según el modo
            let elementosDisponibles;
            if (modoActual === 'letras') {
                const lsLetras = getFromStorage(LS_KEYS.LETRAS);
                const lsGenerados = getFromStorage(LS_KEYS.GENERADAS);
                elementosDisponibles = lsLetras.filter(letra => !lsGenerados.includes(letra));
            } else {
                const lsNumeros = getFromStorage(LS_KEYS.NUMEROS);
                const lsGenerados = getFromStorage(LS_KEYS.GENERADAS);
                elementosDisponibles = lsNumeros.filter(numero => !lsGenerados.includes(numero));
            }
            
            localStorage.setItem(LS_KEYS.RESTANTES, JSON.stringify(elementosDisponibles));
            
            const countElementos = elementosDisponibles.length - 1;
            localStorage.setItem(LS_KEYS.COUNT, countElementos);
            
            // Seleccionar elemento aleatorio
            const elementoAleatorio = elementosDisponibles[Math.floor(Math.random() * elementosDisponibles.length)];
            
            // Animación
            inputLetra.classList.add('animate__animated', 'animate__flip');
            generaLetra.disabled = true;
            inputLetra.value = '?';
            
            // Actualizar después de la animación
            setTimeout(() => {
                inputLetra.classList.remove('animate__animated', 'animate__flip');
                generaLetra.disabled = false;
                inputLetra.value = elementoAleatorio;
                
                // Actualizar la lista de elementos restantes
                const restantes = getFromStorage(LS_KEYS.RESTANTES);
                const index = restantes.indexOf(elementoAleatorio);
                if (index > -1) {
                    restantes.splice(index, 1);
                    localStorage.setItem(LS_KEYS.RESTANTES, JSON.stringify(restantes));
                }
                
                actualizarDisplay(elementoAleatorio, countElementos);
            }, 700);
        });
    }

// Event listener para limpiar juego
    if (trash) {
        trash.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Mostrar mensaje de nueva partida
            letrasResultado.innerHTML = '<span id="nueva-partida" class="animate__animated animate__fadeInDown">¡Nueva Partida!</span>';
            
            // Animación
            setTimeout(() => {
                let a = document.getElementById('nueva-partida');
                a.classList.remove('animate__animated', 'animate__fadeInDown');
                a.classList.add('animate__animated', 'animate__fadeOutDown');
                
                setTimeout(() => {
                    a.classList.remove('animate__animated', 'animate__fadeOutDown');
                    letrasResultado.innerHTML = '';
                }, 1000);
            }, 1500);
            
            // Resetear estado
            inputLetra.value = '?';
            resetearJuego();
            arrLetras.length = 0;
        });
    }
}