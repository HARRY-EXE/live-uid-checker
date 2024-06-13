async function checkUids() {
    var textarea = document.getElementById('uidInput');
    var liveTextarea = document.getElementById('liveUids');
    var deadTextarea = document.getElementById('deadUids');
    var liveCountDisplay = document.getElementById('liveCount');
    var deadCountDisplay = document.getElementById('deadCount');

    var uids = textarea.value.trim().split('\n').filter(function(line) {
        return line.trim() !== '' && !isNaN(line.trim().split('|')[0]);
    });

    liveTextarea.value = "";
    deadTextarea.value = "";
    var liveCount = 0;
    var dieCount = 0;

    for (var i = 0; i < uids.length; i++) {
        var uid = getUid(uids[i]);
        try {
            var url = 'https://graph.facebook.com/' + uid + '/picture?type=normal';
            var response = await fetch(url);

            if (!response.ok || !response.url.includes('100x100')) {
                throw new Error('UID is dead or could not be checked.');
            }

            liveTextarea.value += uids[i] + '\n';
            liveCount++;
            liveCountDisplay.textContent = liveCount; // Update live count immediately

        } catch (error) {
            console.error('Error checking UID:', error);
            deadTextarea.value += uids[i] + '\n'; // Assume dead on error
            dieCount++;
        }
    }

    deadCountDisplay.textContent = dieCount; // Update dead count at the end

    console.log('Live UIDs:', liveCount);
    console.log('Dead UIDs:', dieCount);
}

function getUid(uidString) {
    return uidString.trim().split('|')[0];
}

function copyToClipboard(elementId) {
    var textarea = document.getElementById(elementId);
    textarea.select();
    textarea.setSelectionRange(0, 99999); /* For mobile devices */

    document.execCommand('copy');
    alert('Copied to clipboard: ' + textarea.value);
}
