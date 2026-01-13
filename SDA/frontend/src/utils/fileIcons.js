// File icon utility for VS Code-like file icons
export const getFileIcon = (filename) => {
  if (!filename) return '📄';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const iconMap = {
    // Web files
    'html': '🌐',
    'htm': '🌐',
    'css': '🎨',
    'scss': '🎨',
    'sass': '🎨',
    'less': '🎨',
    
    // JavaScript
    'js': '📜',
    'jsx': '⚛️',
    'ts': '📘',
    'tsx': '⚛️',
    'mjs': '📜',
    'cjs': '📜',
    
    // JSON & Config
    'json': '📋',
    'jsonc': '📋',
    'xml': '📋',
    'yaml': '📋',
    'yml': '📋',
    'toml': '📋',
    
    // Package managers
    'package': '📦',
    'lock': '🔒',
    
    // React & Vue
    'vue': '💚',
    
    // Python
    'py': '🐍',
    'pyc': '🐍',
    'pyw': '🐍',
    'pyo': '🐍',
    'pyd': '🐍',
    
    // Java
    'java': '☕',
    'class': '☕',
    'jar': '☕',
    
    // C/C++
    'c': '🔵',
    'cpp': '🔵',
    'cc': '🔵',
    'cxx': '🔵',
    'h': '🔵',
    'hpp': '🔵',
    
    // C#
    'cs': '🔷',
    
    // PHP
    'php': '🐘',
    
    // Ruby
    'rb': '💎',
    
    // Go
    'go': '🐹',
    
    // Rust
    'rs': '🦀',
    
    // Swift
    'swift': '🦅',
    
    // Kotlin
    'kt': '🟣',
    'kts': '🟣',
    
    // Shell scripts
    'sh': '🐚',
    'bash': '🐚',
    'zsh': '🐚',
    'fish': '🐚',
    'bat': '🐚',
    'cmd': '🐚',
    'ps1': '🐚',
    
    // Markdown & Docs
    'md': '📝',
    'markdown': '📝',
    'txt': '📄',
    'doc': '📄',
    'docx': '📄',
    'pdf': '📕',
    
    // Images
    'png': '🖼️',
    'jpg': '🖼️',
    'jpeg': '🖼️',
    'gif': '🖼️',
    'svg': '🖼️',
    'ico': '🖼️',
    'webp': '🖼️',
    'bmp': '🖼️',
    
    // Videos
    'mp4': '🎬',
    'avi': '🎬',
    'mov': '🎬',
    'wmv': '🎬',
    'flv': '🎬',
    'webm': '🎬',
    
    // Audio
    'mp3': '🎵',
    'wav': '🎵',
    'ogg': '🎵',
    'flac': '🎵',
    
    // Archives
    'zip': '📦',
    'rar': '📦',
    'tar': '📦',
    'gz': '📦',
    '7z': '📦',
    
    // Database
    'sql': '🗄️',
    'db': '🗄️',
    'sqlite': '🗄️',
    
    // Git
    'gitignore': '🔧',
    'gitattributes': '🔧',
    
    // Environment
    'env': '🔐',
    'env.example': '🔐',
    'env.local': '🔐',
    
    // Docker
    'dockerfile': '🐳',
    
    // Other
    'log': '📊',
    'csv': '📊',
  };
  
  // Check for special filenames
  if (filename === 'package.json') return '📦';
  if (filename === 'package-lock.json') return '🔒';
  if (filename === 'tsconfig.json') return '📘';
  if (filename === 'webpack.config.js') return '📦';
  if (filename === 'vite.config.js') return '⚡';
  if (filename === 'tailwind.config.js') return '🎨';
  if (filename === 'postcss.config.js') return '🎨';
  if (filename === '.gitignore') return '🔧';
  if (filename === '.env') return '🔐';
  if (filename === 'Dockerfile') return '🐳';
  if (filename === 'README.md') return '📖';
  if (filename === 'LICENSE') return '📜';
  
  return iconMap[extension] || '📄';
};

export const getFileColor = (filename) => {
  if (!filename) return 'text-gray-400';
  
  const extension = filename.split('.').pop()?.toLowerCase();
  
  const colorMap = {
    'html': 'text-orange-500',
    'css': 'text-blue-500',
    'scss': 'text-pink-500',
    'js': 'text-yellow-500',
    'jsx': 'text-cyan-500',
    'ts': 'text-blue-600',
    'tsx': 'text-cyan-600',
    'json': 'text-yellow-600',
    'md': 'text-gray-400',
    'py': 'text-blue-400',
    'java': 'text-red-500',
    'php': 'text-purple-500',
    'rb': 'text-red-600',
    'go': 'text-cyan-400',
    'rs': 'text-orange-600',
    'vue': 'text-green-500',
    'svg': 'text-yellow-500',
    'png': 'text-purple-400',
    'jpg': 'text-purple-400',
    'jpeg': 'text-purple-400',
  };
  
  return colorMap[extension] || 'text-gray-400';
};
