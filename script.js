// Nach Klick auf den Button: Karte ausblenden, Torte anzeigen
document.addEventListener('DOMContentLoaded', function() {
    const card = document.getElementById('birthdayCard');
    const cakeSection = document.getElementById('cakeSection');
    const startButton = document.getElementById('startButton');
    if (card && cakeSection && startButton) {
        startButton.addEventListener('click', function() {
            card.style.display = 'none';
            cakeSection.style.display = 'block';
        });
    }
});
// Globale Variablen
let card = null;
let isCardOpened = false;
let micActive = false;
let audioContext = null;
let analyser = null;
let mediaStream = null;
let blownOutCandles = 0;
let totalCandles = 12;
let birthdayMusic = null;

// DOM Elements
let micButton = null;
let blowInstruction = null;
let successMessage = null;

// Initialisierung wenn die Seite geladen ist
document.addEventListener('DOMContentLoaded', function() {
    initializeElements();
    setupEventListeners();
    createBirthdayMusic();
});

function initializeElements() {
    card = document.getElementById('birthdayCard');
    micButton = document.getElementById('micButton');
    blowInstruction = document.getElementById('blowInstruction');
    successMessage = document.getElementById('successMessage');
    birthdayMusic = null;
    // Karte beim Laden geschlossen
    card.classList.remove('opened');
    isCardOpened = false;
}

function setupEventListeners() {
    // Karte aufklappen nur bei Klick auf die Vorderseite
    const cardFront = document.querySelector('.card-front');
    if (cardFront) {
        cardFront.addEventListener('click', function(e) {
            e.stopPropagation();
            openCard();
        });
    }
    
    // Mikrofon-Button
    micButton.addEventListener('click', toggleMicrophone);
    
    // Einzelne Kerzen anklicken (Backup-Methode)
    const candles = document.querySelectorAll('.candle');
    candles.forEach(candle => {
        candle.addEventListener('click', function(e) {
            e.stopPropagation();
            if (!this.classList.contains('blown-out')) {
                blowOutCandle(this);
            }
        });
    });
}

// Karte aufklappen
function openCard() {
    if (!isCardOpened) {
        card.classList.add('opened');
        isCardOpened = true;
        // Musik nach kurzer Verzögerung starten
        setTimeout(() => {
            playBirthdayMusic();
        }, 800);
        // Kerzen-Animation verzögert starten
        setTimeout(() => {
            animateCandles();
        }, 1200);
    }
}

// Kerzen-Animation beim Öffnen
function animateCandles() {
    const flames = document.querySelectorAll('.flame');
    flames.forEach((flame, index) => {
        setTimeout(() => {
            flame.style.animation = 'flicker 0.5s infinite alternate, fadeInUp 0.5s ease-out';
        }, index * 100);
    });
}

// Mikrofon ein-/ausschalten
async function toggleMicrophone() {
    if (!micActive) {
        try {
            await startMicrophone();
        } catch (error) {
            console.error('Mikrofon-Fehler:', error);
            alert('Mikrofon konnte nicht aktiviert werden. Bitte überprüfen Sie die Berechtigungen.');
        }
    } else {
        stopMicrophone();
    }
}

// Mikrofon starten
async function startMicrophone() {
    try {
        // MediaStream anfordern
        mediaStream = await navigator.mediaDevices.getUserMedia({ 
            audio: { 
                sampleRate: 44100,
                echoCancellation: true,
                noiseSuppression: true
            } 
        });
        
        // Web Audio API Setup
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        
        const source = audioContext.createMediaStreamSource(mediaStream);
        source.connect(analyser);
        
        analyser.fftSize = 256;
        
        micActive = true;
    micButton.textContent = 'Kalibrierung... gleich bereit!';
        micButton.classList.add('active');
        
        // Nach Kalibrierung Text ändern
        setTimeout(() => {
            if (micActive) {
                micButton.textContent = 'Mikrofon aktiv - Jetzt kräftig pusten! 🌬️';
            }
        }, 2000);
        
        // Kontinuierliche Audiodatenanalyse starten
        detectBlowing();
        
    } catch (error) {
        console.error('Mikrofon-Initialisierung fehlgeschlagen:', error);
        throw error;
    }
}

// Mikrofon stoppen
function stopMicrophone() {
    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
    }
    if (audioContext) {
        audioContext.close();
    }
    
    micActive = false;
    micButton.textContent = 'Mikrofon aktivieren';
    micButton.classList.remove('active');
}

// Pusten erkennen
function detectBlowing() {
    if (!micActive || !analyser) return;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);
    let lastBlowTime = 0;
    let baselineVolume = 0;
    let sampleCount = 0;
    let isCalibrating = true;
    let calibrationDone = false;

    // Kalibrierungszeit von 2 Sekunden
    function calibrate() {
        if (!micActive) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        baselineVolume = (baselineVolume * sampleCount + average) / (sampleCount + 1);
        sampleCount++;
        if (sampleCount < 60) {
            micButton.textContent = 'Kalibrierung...';
            requestAnimationFrame(calibrate);
        } else {
            isCalibrating = false;
            calibrationDone = true;
            micButton.textContent = 'Mikrofon aktiv - Jetzt kräftig pusten! 🌬️';
            analyze();
        }
    }

    function analyze() {
        if (!micActive || !calibrationDone) return;
        analyser.getByteFrequencyData(dataArray);
        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
            sum += dataArray[i];
        }
        const average = sum / bufferLength;
        const threshold = baselineVolume + 15;
        const lowFreqSum = dataArray.slice(0, 30).reduce((a, b) => a + b, 0);
        const midFreqSum = dataArray.slice(30, 80).reduce((a, b) => a + b, 0);
        const isBlowing = average > threshold && lowFreqSum > midFreqSum * 1.5 && average > 40 && average < 150;
        const currentTime = Date.now();
        if (isBlowing && (currentTime - lastBlowTime) > 800) {
            handleBlowing();
            lastBlowTime = currentTime;
        }
        requestAnimationFrame(analyze);
    }

    calibrate();
}

// Pusten verarbeiten
function handleBlowing() {
    const activeCandles = document.querySelectorAll('.candle:not(.blown-out)');
    
    if (activeCandles.length > 0) {
        // Nur 1-2 Kerzen pro Puster ausblasen
        const numToBlowOut = Math.min(2, Math.max(1, Math.floor(Math.random() * 2) + 1));
        
        for (let i = 0; i < numToBlowOut && activeCandles.length > i; i++) {
            const randomIndex = Math.floor(Math.random() * (activeCandles.length - i));
            const candleToBlowOut = activeCandles[randomIndex];
            
            setTimeout(() => {
                blowOutCandle(candleToBlowOut);
            }, i * 200); // Verzögerung zwischen mehreren Kerzen
        }
    }
}

// Einzelne Kerze ausblasen
function blowOutCandle(candle) {
    if (candle.classList.contains('blown-out')) return;
    
    candle.classList.add('blown-out');
    blownOutCandles++;
    
    // Flamme ausblenden
    const flame = candle.querySelector('.flame');
    if (flame) {
        flame.classList.add('extinguished');
    }
    
    // Prüfen ob alle Kerzen ausgeblasen sind
    if (blownOutCandles >= totalCandles) {
        setTimeout(() => {
            showSuccessMessage();
        }, 1000);
    }
}

// Erfolgsnachricht anzeigen
function showSuccessMessage() {
    blowInstruction.style.display = 'none';
    successMessage.style.display = 'block';
    // Mikrofon stoppen
    if (micActive) {
        stopMicrophone();
    }
    // Konfetti-Effekt
    startConfettiCanvas();
    // Geburtstags-Schriftzug anzeigen
    setTimeout(() => {
        const msg = document.getElementById('birthdayMessage');
        if (msg) msg.style.display = 'block';
        const photo = document.getElementById('birthdayPhoto');
        if (photo) photo.style.display = 'block';
        playBirthdayMusic();
    }, 1200);
}

// Konfetti-Effekt mit Canvas
function startConfettiCanvas() {
    const canvas = document.getElementById('confettiCanvas');
    if (!canvas) return;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f9ca24', '#ff9ff3'];
    const confettiPieces = [];
    for (let i = 0; i < 80; i++) {
        confettiPieces.push({
            x: Math.random() * canvas.width,
            y: Math.random() * -canvas.height,
            r: 6 + Math.random() * 8,
            color: colors[Math.floor(Math.random() * colors.length)],
            speed: 2 + Math.random() * 3,
            angle: Math.random() * 2 * Math.PI,
            rotation: Math.random() * 2 * Math.PI,
            rotSpeed: (Math.random() - 0.5) * 0.1
        });
    }
    let frame = 0;
    function drawConfetti() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        confettiPieces.forEach(p => {
            ctx.save();
            ctx.translate(p.x, p.y);
            ctx.rotate(p.rotation);
            ctx.fillStyle = p.color;
            ctx.fillRect(-p.r/2, -p.r/2, p.r, p.r);
            ctx.restore();
            p.y += p.speed;
            p.x += Math.sin(p.angle + frame/20) * 2;
            p.rotation += p.rotSpeed;
            if (p.y > canvas.height + 20) {
                p.y = Math.random() * -40;
                p.x = Math.random() * canvas.width;
            }
        });
        frame++;
        if (frame < 180) {
            requestAnimationFrame(drawConfetti);
        } else {
            canvas.style.display = 'none';
        }
    }
    canvas.style.display = 'block';
    drawConfetti();
}

// Geburtstags-Musik erstellen (Web Audio API)
function createBirthdayMusic() {
    // Falls kein Audio-Element vorhanden, erstelle Melodie mit Web Audio API
    if (!birthdayMusic || !birthdayMusic.src) {
        // Happy Birthday Melodie als Frequenzen (vereinfacht)
        window.playBirthdayMelody = function() {
            if (!audioContext) {
                audioContext = new (window.AudioContext || window.webkitAudioContext)();
            }
            
            const notes = [
                { freq: 261.63, duration: 0.5 }, // C
                { freq: 261.63, duration: 0.5 }, // C
                { freq: 293.66, duration: 1 },   // D
                { freq: 261.63, duration: 1 },   // C
                { freq: 349.23, duration: 1 },   // F
                { freq: 329.63, duration: 2 },   // E
                { freq: 261.63, duration: 0.5 }, // C
                { freq: 261.63, duration: 0.5 }, // C
                { freq: 293.66, duration: 1 },   // D
                { freq: 261.63, duration: 1 },   // C
                { freq: 392.00, duration: 1 },   // G
                { freq: 349.23, duration: 2 }    // F
            ];
            
            let currentTime = audioContext.currentTime;
            
            notes.forEach(note => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.frequency.setValueAtTime(note.freq, currentTime);
                oscillator.type = 'sine';
                
                gainNode.gain.setValueAtTime(0, currentTime);
                gainNode.gain.linearRampToValueAtTime(0.3, currentTime + 0.1);
                gainNode.gain.exponentialRampToValueAtTime(0.01, currentTime + note.duration);
                
                oscillator.start(currentTime);
                oscillator.stop(currentTime + note.duration);
                
                currentTime += note.duration * 0.8; // Leichte Überlappung
            });
        };
    }
}

// Musik abspielen
function playBirthdayMusic() {
    if (window.playBirthdayMelody) {
        window.playBirthdayMelody();
    }
}

// Responsive Touch-Events für mobile Geräte
if ('ontouchstart' in window) {
    document.addEventListener('touchstart', function() {
        // Touch-Unterstützung aktiviert
    });
}

// Service Worker für PWA-Funktionalität (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js')
            .then(function(registration) {
                console.log('ServiceWorker registriert');
            })
            .catch(function(error) {
                console.log('ServiceWorker Registrierung fehlgeschlagen');
            });
    });
}

// Error Handling für Web Audio API
window.addEventListener('error', function(event) {
    if (event.error && event.error.name === 'NotAllowedError') {
        console.log('Mikrofon-Berechtigung verweigert');
        alert('Bitte erlauben Sie den Zugriff auf das Mikrofon für die volle Erfahrung!');
    }
});

// Fallback für ältere Browser
if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
    console.warn('getUserMedia nicht unterstützt');
    // Zeige alternative Bedienungshinweise
    if (micButton) {
        micButton.textContent = 'Klicke auf die Kerzen!';
        micButton.disabled = true;
    }
}
