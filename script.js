document.addEventListener("DOMContentLoaded", async function () {
    const connectButton = document.getElementById("connect-wallet");
    const disconnectButton = document.getElementById("disconnect-wallet");
    const walletStatus = document.getElementById("wallet-status");
    const walletAddressDisplay = document.getElementById("wallet-address");
    const mascot = document.getElementById("mascot-animation");
    const backgroundVideo = document.getElementById("background-video");

    let connectBlip = new Audio("https://example.com/futuristic-blip.mp3");
    let disconnectSound = new Audio("https://example.com/sad-sound.mp3");

    function playSound(sound) {
        sound.currentTime = 0;
        sound.play();
    }

    async function checkStoredWallet() {
        let storedWallet = localStorage.getItem("walletAddress");
        if (storedWallet) {
            updateUI(storedWallet);
        }
    }

    connectButton.addEventListener("click", async function () {
        try {
            if (window.solana && window.solana.isPhantom) {
                playSound(connectBlip);
                walletStatus.innerHTML = "ThreadDrop Syncing...";
                mascot.classList.add("loading");

                setTimeout(async () => {
                    const response = await window.solana.connect();
                    const walletAddress = response.publicKey.toString();
                    localStorage.setItem("walletAddress", walletAddress);
                    updateUI(walletAddress);
                }, 1000);
            } else {
                walletStatus.innerHTML = "Phantom Wallet not detected. Please install it.";
            }
        } catch (error) {
            walletStatus.innerHTML = "Connection Failed";
        }
    });

    disconnectButton.addEventListener("click", function () {
        localStorage.removeItem("walletAddress");
        playSound(disconnectSound);
        resetUI();
    });

    function updateUI(walletAddress) {
        connectButton.style.display = "none";
        disconnectButton.style.display = "block";
        walletStatus.innerHTML = "✅ IN GOOD COMPANY";
        walletAddressDisplay.innerHTML = `Connected: ${walletAddress.slice(0, 6)}...${walletAddress.slice(-4)}`;
        mascot.classList.remove("loading");
        mascot.classList.add("success");
    }

    function resetUI() {
        connectButton.style.display = "block";
        disconnectButton.style.display = "none";
        walletStatus.innerHTML = "❌ LONELY";
        walletAddressDisplay.innerHTML = "";
        mascot.classList.remove("success");
    }

    checkStoredWallet();
});
