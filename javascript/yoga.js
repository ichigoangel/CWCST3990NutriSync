    import YogaAI from './yogaai.js';

    document.addEventListener('DOMContentLoaded', async () => {
        const yogaAI = new YogaAI();
        window.yogaAI = yogaAI;

        const savedProfile = localStorage.getItem('yogaProfile');
        if (savedProfile) {
            yogaAI.userProfile = JSON.parse(savedProfile);
        }

        setupRecommendationButton(yogaAI);
        setupRoutineNavigation(yogaAI);
        setupPoseAnalysis(yogaAI);
        setupVoiceToggle(yogaAI);
        updateUI(yogaAI);
    });

    function setupRecommendationButton(yogaAI) {
        document.getElementById('recommendBtn').addEventListener('click', () => {
            const preferences = {
                fitnessLevel: document.getElementById('fitnessLevel').value,
                goals: Array.from(document.querySelectorAll('input[name="goals"]:checked')).map(el => el.value),
                duration: parseInt(document.getElementById('sessionDuration').value)
            };

            const routine = yogaAI.recommendRoutine({ preferences });
            displayRoutine(routine);
            localStorage.setItem('yogaProfile', JSON.stringify(yogaAI.userProfile));
        });
    }

    function setupRoutineNavigation(yogaAI) {
        document.getElementById('nextPose').addEventListener('click', () => {
            if (yogaAI.nextPose()) {
                displayCurrentPose(yogaAI);
            } else {
                document.getElementById('routineContainer').innerHTML = `
                    <div class="routine-complete">
                        <h3>Routine Complete!</h3>
                        <p>You burned approximately ${yogaAI.currentSession?.caloriesEstimate || 0} calories.</p>
                        <button class="btn btn-primary" id="newRoutine">Start New Routine</button>
                    </div>
                `;
                document.getElementById('newRoutine').addEventListener('click', () => {
                    document.getElementById('recommendationForm').style.display = 'block';
                    document.getElementById('routineContainer').innerHTML = '';
                });
            }
        });
    }

    async function setupPoseAnalysis(yogaAI) {
        const analyzeBtn = document.getElementById ('analyzePose');
        if (!analyzeBtn) return;

        analyzeBtn.addEventListener('click', async () => {
            const videoElement = document.getElementById('poseVideo');
            const currentPose = yogaAI.getCurrentPose();

            if (!currentPose) {
                alert('No active pose to analyze');
                return;
            }

            const result = await yogaAI.analyzePose(videoElement, currentPose.id);
            displayPoseFeedback(result);
        });
    }

    function setupVoiceToggle(yogaAI) {
        const voiceToggle = document.getElementById('voiceToggle');
        if (!voiceToggle) return;

        voiceToggle.addEventListener('change', (e) => {
            yogaAI.userProfile.preferences.voiceGuidance = e.target.checked;
            localStorage.setItem('yogaProfile', JSON.stringify(yogaAI.userProfile));
        });
    }

    function displayRoutine(routine) {
        const container = document.getElementById('routineContainer');
        container.innerHTML = `
            <div class="routine-header">
                <h3>Your Recommended Routine</h3>
                <p>${routine.poses.length} poses • ${Math.round(routine.duration / 60)} minutes</p>
            </div>
            <div id="poseDisplay"></div>
            <button class="btn btn-primary" id="nextPose">Start First Pose</button>
        `;

        document.getElementById('recommendationForm').style.display = 'none';
        displayCurrentPose(yogaAI);
    }

    function displayCurrentPose(yogaAI) {
        const pose = yogaAI.getCurrentPose();
        if (!pose) return;

        const poseDisplay = document.getElementById('poseDisplay');
        poseDisplay.innerHTML = `
            <div class="pose-card">
                <img src="${pose.image}" alt="${pose.name}" class="pose-image">
                <div class="pose-info">
                    <h4>${pose.name} (${pose.sanskrit})</h4>
                    <p>${pose.instructions}</p>
                    <p>Hold for ${pose.duration} seconds</p>
                    <p>Pose ${pose.progress.current} of ${pose.progress.total}</p>
                </div>
            </div>
            <div class="pose-actions">
                <button class="btn btn-secondary" id="analyzePose">Analyze My Pose</button>
                <div id="poseFeedback"></div>
            </div>
        `;

        if (yogaAI.userProfile.preferences.voiceGuidance) {
            const voice = yogaAI.getVoiceInstructions(pose);
            voice.speak();
        }
    }

    function displayPoseFeedback(feedback) {
        const feedbackDiv = document.getElementById('poseFeedback');
        if (!feedback.success) {
            feedbackDiv.innerHTML = `<div class="alert alert-danger">${feedback.message}</div>`;
            return;
        }

        feedbackDiv.innerHTML = `
            <div class="alert alert-success">
                <h5>Pose Accuracy: ${feedback.score * 100}%</h5>
                ${feedback.corrections.length ? `
                    <p><strong>Corrections:</strong></p>
                    <ul>${feedback.corrections.map(c => `<li>${c}</li>`).join('')}</ul>
                ` : '<p>Great form!</p>'}
                ${feedback.alignmentTips.length ? `
                    <p><strong>Tips:</strong></p>
                    <ul>${feedback.alignmentTips.map(t => `<li>${t}</li>`).join('')}</ul>
                ` : ''}
            </div>
        `;
    }

    function updateUI(yogaAI) {
        if (yogaAI.userProfile) {
            document.getElementById('fitnessLevel').value = yogaAI.userProfile.fitnessLevel;
            document.getElementById('sessionDuration').value = yogaAI.userProfile.preferences.duration;
            document.getElementById('voiceToggle').checked = yogaAI.userProfile.preferences.voiceGuidance;
        }
    }
    let timer; // Variable to hold the timer interval
    let time = 0; // Time in seconds
    let poseDuration = 60; // Default pose duration in seconds

    document.addEventListener('DOMContentLoaded', async () => {
        // Initialize YogaAI
        const yogaAI = new YogaAI();
        window.yogaAI = yogaAI;

        // Load user profile from localStorage
        const savedProfile = localStorage.getItem('yogaProfile');
        if (savedProfile) {
            yogaAI.userProfile = JSON.parse(savedProfile);
        }

        // Setup event listeners
        setupRecommendationButton(yogaAI);
        setupRoutineNavigation(yogaAI);
        setupPoseAnalysis(yogaAI);
        setupVoiceToggle(yogaAI);
        setupTimer(); // Initialize timer setup

        // Display initial content
        updateUI(yogaAI);
    });

    function setupTimer() {
        const startButton = document.getElementById('startTimer');
        const pauseButton = document.getElementById('pauseTimer');
        const resetButton = document.getElementById('resetTimer');
        const timerDisplay = document.getElementById('timer');
        const poseDurationInput = document.getElementById('poseDuration');
        const setDurationButton = document.getElementById('setDuration');

        // Start timer
        startButton.addEventListener('click', () => {
            clearInterval(timer); // Clear any existing timer
            timer = setInterval(() => {
                time++;
                updateTimerDisplay(timerDisplay);
            }, 1000); // Update every second
        });

        // Pause timer
        pauseButton.addEventListener('click', () => {
            clearInterval(timer);
        });

        // Reset timer
        resetButton.addEventListener('click', () => {
            clearInterval(timer);
            time = 0;
            updateTimerDisplay(timerDisplay);
        });

        // Set pose duration
        setDurationButton.addEventListener('click', () => {
            const duration = parseInt(poseDurationInput.value);
            if (duration > 0) {
                poseDuration = duration * 60; // Convert minutes to seconds
            }
        });
    }

    function updateTimerDisplay(timerDisplay) {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }

    // Other existing functions (setupRecommendationButton, setupRoutineNavigation, etc.) remain unchanged
    const routines = {
            stress: [
                { name: "Child's Pose (Balasana)", duration: 60 },
                { name: "Cat-Cow Stretch", duration: 120 },
                { name: "Standing Forward Bend", duration: 60 },
                { name: "Legs-Up-the-Wall Pose", duration: 300 },
                { name: "Corpse Pose", duration: 600 }
            ],
            energy: [
                { name: "Sun Salutations", duration: 300 },
                { name: "Warrior I", duration: 60 },
                { name: "Warrior II", duration: 60 },
                { name: "Tree Pose", duration: 120 },
                { name: "Bridge Pose", duration: 60 }
            ],
            sleep: [
                { name: "Seated Forward Bend", duration: 120 },
                { name: "Reclining Butterfly", duration: 180 },
                { name: "Supine Spinal Twist", duration: 120 },
                { name: "Legs-Up-the-Wall", duration: 300 },
                { name: "Corpse Pose", duration: 600 }
            ]
            // Add other routines here if needed
        };

        document.querySelectorAll('.start-routine').forEach(button => {
            button.addEventListener('click', () => {
                const routineType = button.dataset.routine;
                startRoutine(routineType);
            });
        });

        const timerDisplay = document.getElementById("timer-display");
        const currentPoseName = document.getElementById("current-pose-name");
        const timerContainer = document.getElementById("routine-timer");

        let currentPose = 0;
        let intervalId;

        function startRoutine(type) {
            const poses = routines[type];
            currentPose = 0;
            timerContainer.style.display = "block";
            nextPose(poses);
        }

        function nextPose(poses) {
            if (currentPose >= poses.length) {
                currentPoseName.textContent = "Routine Complete! 🧘‍♀️";
                timerDisplay.textContent = "";
                return;
            }

            const pose = poses[currentPose];
            currentPoseName.textContent = pose.name;
            startTimer(pose.duration, () => {
                currentPose++;
                nextPose(poses);
            });
        }

        function startTimer(duration, onComplete) {
            let time = duration;
            updateDisplay(time);

            clearInterval(intervalId);
            intervalId = setInterval(() => {
                time--;
                updateDisplay(time);
                if (time <= 0) {
                    clearInterval(intervalId);
                    onComplete();
                }
            }, 1000);
        }

        function updateDisplay(seconds) {
            const min = Math.floor(seconds / 60).toString().padStart(2, '0');
            const sec = (seconds % 60).toString().padStart(2, '0');
            timerDisplay.textContent = `${min}:${sec}`;
        }