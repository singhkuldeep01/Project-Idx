export function getLanguage(extension) {
  switch (extension.toLowerCase()) {
    case 'js':
    case 'jsx':
      return 'javascript';
    case 'ts':
    case 'tsx':
      return 'typescript';
    case 'py':
      return 'python';
    case 'java':
      return 'java';
    case 'cpp':
      return 'cpp';
    case 'c':
      return 'c';
    case 'html':
      return 'html';
    case 'css':
      return 'css';
    case 'json':
      return 'json';
    case 'md':
      return 'markdown';
    case 'xml':
      return 'xml';
    case 'sh':
      return 'shell';
    case 'go':
      return 'go';
    case 'php':
      return 'php';
    case 'sql':
      return 'sql';
    case 'yaml':
    case 'yml':
      return 'yaml';
    case 'txt':
      return 'plaintext';
    default:
      return 'plaintext'; // fallback language
  }
}
