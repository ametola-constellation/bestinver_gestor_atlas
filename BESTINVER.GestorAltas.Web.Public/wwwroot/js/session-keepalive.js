// Sistema de Keep-Alive para mantener la sesión activa
var SessionKeepAlive = (function () {
    var intervalId = null;
    var isEnabled = false;
    var keepAliveInterval = 5 * 60 * 1000; // 5 minutos por defecto
    var lastActivityTime = Date.now();
    var inactivityThreshold = 3 * 60 * 1000; // 3 minutos de inactividad antes de parar keep-alive

    function updateLastActivity() {
        var now = Date.now();
        lastActivityTime = now;

        if (!isEnabled && shouldStart()) {
            start();
        }
    }

    function isUserActive() {
        var timeSinceLastActivity = Date.now() - lastActivityTime;
        return timeSinceLastActivity < inactivityThreshold;
    }

    function shouldStart() {
        return window.location.pathname.includes('/fisica') ||
            window.location.pathname.includes('/juridica') ||
            window.location.pathname.includes('/extranjero');
    }

    function keepSessionAlive() {
        if (!isUserActive()) {
            return;
        }

        $.ajax({
            url: sitePreffix + '/Register/KeepSessionAlive',
            type: 'POST',
            headers: {
                'RequestVerificationToken': $("input[name='__RequestVerificationToken']").val()
            },
            success: function (response) {
                if (!response || !response.success) {
                    console.warn('Session keep-alive failed:', response ? response.error : 'Unknown error');
                }
            },
            error: function (xhr, status, error) {
                console.warn('Session keep-alive request failed:', status, error);

                // Si es error de autenticación, parar el keep-alive
                if (xhr.status === 401 || xhr.status === 403) {
                    console.warn('Session possibly expired, stopping keep-alive');
                    stop();
                }
            }
        });
    }

    function start(interval) {
        if (!shouldStart()) {
            return;
        }

        if (interval) {
            keepAliveInterval = interval * 1000;
        }

        if (intervalId) {
            clearInterval(intervalId);
        }

        isEnabled = true;
        intervalId = setInterval(function () {
            if (isUserActive()) {
                keepSessionAlive();
            } else {
                stop();
            }
        }, keepAliveInterval);

        updateLastActivity();
    }

    function stop() {
        if (intervalId) {
            clearInterval(intervalId);
            intervalId = null;
        }
        isEnabled = false;
    }

    function setupActivityListeners() {
        // Eventos que indican actividad del usuario
        var events = [
            'mousedown', 'mousemove', 'mouseup', 'click', 'dblclick',
            'keydown', 'keyup', 'keypress',
            'scroll', 'wheel',
            'touchstart', 'touchmove', 'touchend',
            'focus', 'blur'
        ];

        // Throttle para evitar demasiadas llamadas a updateLastActivity
        var throttleTimeout = null;
        var throttleDelay = 1000; // 1 segundo

        function throttledUpdateActivity() {
            if (throttleTimeout) {
                return;
            }

            throttleTimeout = setTimeout(function () {
                updateLastActivity();
                throttleTimeout = null;
            }, throttleDelay);
        }

        events.forEach(function (event) {
            document.addEventListener(event, throttledUpdateActivity, true);
        });

        if (typeof Navigation !== 'undefined') {
            var originalNextStep = Navigation.NextStep;
            Navigation.NextStep = function () {
                updateLastActivity();
                return originalNextStep.apply(this, arguments);
            };
        }

        // Detectar cambios de visibilidad de la página
        document.addEventListener('visibilitychange', function () {
            if (!document.hidden) {
                updateLastActivity();
            }
        });
    }

    // API pública
    return {
        start: start,
        stop: stop,
        setInterval: function (seconds) {
            keepAliveInterval = seconds * 1000;
            if (isEnabled) {
                start(); // Reiniciar con nuevo intervalo
            }
        },
        setInactivityThreshold: function (seconds) {
            inactivityThreshold = seconds * 1000;
        },
        isEnabled: function () {
            return isEnabled;
        },
        isUserActive: isUserActive,
        getTimeSinceLastActivity: function () {
            return Math.round((Date.now() - lastActivityTime) / 1000);
        },
        setupActivityListeners: setupActivityListeners,
        forceKeepAlive: keepSessionAlive
    };
})();

// Inicialización automática
$(document).ready(function () {
    SessionKeepAlive.setupActivityListeners();

    // Iniciar keep-alive si estamos en proceso de alta
    if (window.location.pathname.includes('/fisica') ||
        window.location.pathname.includes('/juridica') ||
        window.location.pathname.includes('/extranjero')) {

        // Iniciar con intervalo de 4 minutos (menor que el timeout de sesión de 30 min)
        SessionKeepAlive.start(240);
    }
});

// Limpiar al salir de la página
window.addEventListener('beforeunload', function () {
    SessionKeepAlive.stop();
});