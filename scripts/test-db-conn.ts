import net from 'net';

const host = 'ep-misty-pond-ahm69ihi-pooler.c-3.us-east-1.aws.neon.tech';
const port = 5432;

console.log(`Connecting to ${host}:${port}...`);

const socket = new net.Socket();

socket.setTimeout(5000);

socket.connect(port, host, () => {
    console.log('✅ Connection successful!');
    socket.destroy();
});

socket.on('error', (err) => {
    console.error('❌ Connection failed:', err.message);
});

socket.on('timeout', () => {
    console.error('❌ Connection timed out');
    socket.destroy();
});
