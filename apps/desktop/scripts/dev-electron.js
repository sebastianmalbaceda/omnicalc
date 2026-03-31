const { spawn, exec } = require('child_process');
const electron = require('electron');
const path = require('path');

let electronProcess;
let mobileProcess;

function startMobileDev() {
  return new Promise((resolve, reject) => {
    console.log('[Dev] Starting mobile Expo dev server...');

    mobileProcess = spawn('npx', ['expo', 'start', '--web'], {
      stdio: ['pipe', 'pipe', 'pipe', 'ipc'],
      shell: true,
      cwd: path.join(__dirname, '..', 'mobile'),
    });

    let output = '';

    mobileProcess.stdout.on('data', (data) => {
      const text = data.toString();
      output += text;
      process.stdout.write('[Mobile] ' + text);

      // Wait for the server to be ready
      if (text.includes('localhost:8081') || text.includes('Web Bundled')) {
        console.log('[Dev] Mobile dev server ready');
        setTimeout(resolve, 2000); // Give extra time for bundling
      }
    });

    mobileProcess.stderr.on('data', (data) => {
      process.stderr.write('[Mobile Error] ' + data.toString());
    });

    mobileProcess.on('close', (code) => {
      console.log(`[Dev] Mobile process exited with code ${code}`);
    });

    // Timeout after 30 seconds
    setTimeout(() => {
      if (mobileProcess && !mobileProcess.killed) {
        console.log('[Dev] Mobile server timeout, proceeding anyway');
        resolve();
      }
    }, 30000);
  });
}

function startElectron() {
  console.log('[Dev] Starting Electron...');

  electronProcess = spawn(electron, ['.'], {
    stdio: 'inherit',
    shell: true,
    env: {
      ...process.env,
      NODE_ENV: 'development',
    },
  });

  electronProcess.on('close', (code) => {
    console.log(`[Dev] Electron process exited with code ${code}`);
    if (mobileProcess) {
      console.log('[Dev] Stopping mobile server...');
      mobileProcess.kill();
    }
    process.exit(code);
  });
}

async function main() {
  try {
    await startMobileDev();
    startElectron();
  } catch (err) {
    console.error('[Dev] Error:', err);
    process.exit(1);
  }
}

main().catch(console.error);
