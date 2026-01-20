const COLORS = ["#fff2", "#fff4", "#fff7", "#fffc"];

// Función para generar las capas de estrellas
const generateSpaceLayer = (size, selector, totalStars, duration) => {
    const container = document.querySelector(selector);
    
    // Verificar que el contenedor existe antes de continuar
    if (!container) {
        console.warn(`Elemento ${selector} no encontrado`);
        return;
    }
    
    const layer = [];
    for (let i = 0; i < totalStars; i++) {
        const color = COLORS[~~(Math.random() * COLORS.length)];
        const x = Math.floor(Math.random() * 100);
        const y = Math.floor(Math.random() * 100);
        layer.push(`${x}vw ${y}vh 0 ${color}, ${x}vw ${y + 100}vh 0 ${color}`);
    }
    
    container.style.setProperty("--size", size);
    container.style.setProperty("--duration", duration);
    container.style.setProperty("--space-layer", layer.join(","));
}

// Función para inicializar las estrellas
const initializeStars = () => {
    // Intentamos generar las capas de estrellas
    generateSpaceLayer("2px", ".space-1", 250, "25s");
    generateSpaceLayer("3px", ".space-2", 100, "20s");
    generateSpaceLayer("6px", ".space-3", 25, "15s");
    
    // Configuración adicional para las animaciones de estrellas
    const spaces = document.querySelectorAll('.space');
    
    spaces.forEach((space, index) => {
        // Añadir variación en la duración de la animación para cada capa de estrellas
        const duration = 20 + (index * 5) + 's';
        space.style.setProperty('--duration', duration);
        
        // Generar posiciones aleatorias para las estrellas
        let spaceLayer = '';
        for (let i = 0; i < 15; i++) {
            const x = Math.floor(Math.random() * 100) + 'vw';
            const y = Math.floor(Math.random() * 100) + 'vh';
            spaceLayer += `${x} ${y} 0 #fff${i < 14 ? ',' : ''}`;
        }
        
        space.style.setProperty('--space-layer', spaceLayer);
    });
}

// Esperar a que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
    // Comprobar si los elementos ya existen
    const spaces = document.querySelectorAll('.space');
    if (spaces.length > 0) {
        // Si ya existen los elementos, inicializar directamente
        initializeStars();
    } else {
        // Si no existen, establecer un MutationObserver para detectar cuando se añadan
        const observer = new MutationObserver((mutations) => {
            if (document.querySelector('.space')) {
                observer.disconnect();
                initializeStars();
            }
        });
        
        observer.observe(document.body, { childList: true, subtree: true });
        
        // Establecer un tiempo límite de seguridad para inicializar incluso si no se detectan los elementos
        setTimeout(() => {
            if (!document.querySelector('.space')) {
                console.warn('No se detectaron elementos .space después de 2 segundos. Intentando inicializar...');
                initializeStars();
            }
        }, 2000);
    }
});

// Exportar la función de inicialización para poder llamarla desde otros scripts
window.initializeStars = initializeStars;