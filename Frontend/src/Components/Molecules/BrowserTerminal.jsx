import React, { useEffect, useRef } from 'react';
import { Terminal } from '@xterm/xterm';
import { FitAddon } from '@xterm/addon-fit';
import '@xterm/xterm/css/xterm.css';
import {io} from 'socket.io-client';
import { useParams } from 'react-router-dom';


function BrowserTerminal() {
  const { projectId } = useParams();
  const terminalRef = useRef(null);
  const socket = useRef(null); 
  useEffect(() => {
    const terminal = new Terminal(
      {
        cursorBlink: true,
        fontFamily: 'monospace',
        fontSize: 14,
        convertEol: true,
        theme: {
          background: '#1e1e1e',
          foreground: '#dcdcdc',
          cursor: '#ffffff',
          selection: '#3a3d41',
        },
      }
    );
    const fitAddon = new FitAddon();
    terminal.loadAddon(fitAddon);
    terminal.open(terminalRef.current);
    fitAddon.fit();


    socket.current = io(`${import.meta.env.VITE_BACKEND_URL}/terminal`, {
      transports: ['websocket'],
      query: {
        projectId: projectId,
      },
    });


    socket.current.on('shell-output', (data) => {
      terminal.write(data);
    });

    terminal.onData((data) => {
      socket.current.emit('shell-input', data);
    });

    return () => {
      terminal.dispose();
      socket.current.disconnect();
    };
  }, []);

  return (
    <div ref={terminalRef} className="h-56"></div>
  );
}

export default BrowserTerminal;
