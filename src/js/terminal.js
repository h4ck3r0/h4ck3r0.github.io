// This file implements the terminal functionality, allowing users to execute commands and view output within the application.

document.addEventListener('DOMContentLoaded', () => {
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');

    terminalInput.addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const command = terminalInput.value;
            executeCommand(command);
            terminalInput.value = '';
        }
    });

    function executeCommand(command) {
        // Simulate command execution
        const output = `Executed: ${command}`;
        const outputElement = document.createElement('div');
        outputElement.textContent = output;
        terminalOutput.appendChild(outputElement);
        terminalOutput.scrollTop = terminalOutput.scrollHeight; // Auto-scroll to the bottom
    }
});