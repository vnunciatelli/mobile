document.addEventListener("DOMContentLoaded", () => {
    // Captura os dados da bateria
    if (navigator.getBattery) {
        navigator.getBattery().then(battery => {
            atualizarBateria(battery);

            battery.addEventListener("levelchange", () => atualizarBateria(battery));
            battery.addEventListener("chargingchange", () => atualizarBateria(battery));
        });
    } else {
        document.getElementById("bateria").textContent = "Não suportado";
        document.getElementById("carregando").textContent = "-";
    }

    function atualizarBateria(battery) {
        document.getElementById("bateria").textContent = Math.round(battery.level * 100) + "%";
        document.getElementById("carregando").textContent = battery.charging ? "Sim" : "Não";
    }

    // Captura os dados do acelerômetro e giroscópio com permissão explícita
    document.getElementById("requestPermission").addEventListener("click", () => {
        if (typeof DeviceMotionEvent.requestPermission === "function") {
            DeviceMotionEvent.requestPermission().then(permissionState => {
                if (permissionState === "granted") {
                    ativarSensores();
                }
            }).catch(console.error);
        } else {
            ativarSensores();
        }
    });

    function ativarSensores() {
        window.addEventListener("devicemotion", event => {
            document.getElementById("accelX").textContent = event.accelerationIncludingGravity.x.toFixed(2);
            document.getElementById("accelY").textContent = event.accelerationIncludingGravity.y.toFixed(2);
            document.getElementById("accelZ").textContent = event.accelerationIncludingGravity.z.toFixed(2);
        });

        window.addEventListener("deviceorientation", event => {
            document.getElementById("gyroAlpha").textContent = event.alpha.toFixed(2);
            document.getElementById("gyroBeta").textContent = event.beta.toFixed(2);
            document.getElementById("gyroGamma").textContent = event.gamma.toFixed(2);
        });
    }

    // Captura a geolocalização
    if (navigator.geolocation) {
        navigator.geolocation.watchPosition(position => {
            document.getElementById("latitude").textContent = position.coords.latitude.toFixed(5);
            document.getElementById("longitude").textContent = position.coords.longitude.toFixed(5);
            document.getElementById("precisao").textContent = position.coords.accuracy.toFixed(2) + "m";
        }, error => {
            console.error("Erro ao obter localização:", error);
        }, { enableHighAccuracy: true, maximumAge: 10000 });
    } else {
        document.getElementById("latitude").textContent = "Não suportado";
        document.getElementById("longitude").textContent = "Não suportado";
        document.getElementById("precisao").textContent = "-";
    }
});