const modes = [
  {
    name: 'text',
    label: 'Plain text',
    mode: 'text'
  },
  {
    name: 'abap',
    label: 'ABAP',
    alias: [],
    mode: 'abap'
  },
  {
    name: 'abc',
    label: 'ABC',
    alias: [],
    mode: 'abc'
  },
  {
    name: 'actionscript',
    label: 'ActionScript',
    alias: ['as'],
    mode: 'actionscript'
  },
  {
    name: 'ada',
    label: 'Ada',
    alias: [],
    mode: 'ada'
  },
  {
    name: 'apache_conf',
    label: 'Apache config',
    alias: ['apache', 'conf'],
    mode: 'apache_conf'
  },
  {
    name: 'applescript',
    label: 'AppleScript',
    alias: ['scpt'],
    mode: 'applescript'
  },
  {
    name: 'asciidoc',
    label: 'AsciiDoc',
    alias: ['ascii', 'doc', 'txt'],
    mode: 'asciidoc'
  },
  {
    name: 'assembly_x86',
    label: 'Assembly x86',
    alias: ['assembly', 'x86', 'asm'],
    mode: 'assembly_x86'
  },
  {
    name: 'autohotkey',
    label: 'AutoHotkey',
    alias: ['ahk'],
    mode: 'autohotkey'
  },
  {
    name: 'batchfile',
    label: 'Batch file',
    alias: ['dos', 'windows', 'bat', 'cmd', 'btm'],
    mode: 'batchfile'
  },
  {
    name: 'c',
    label: 'C',
    alias: ['c', 'h', 'clang', 'clang'],
    mode: 'c_cpp'
  },
  {
    name: 'cirru',
    label: 'Cirru',
    alias: [],
    mode: 'cirru'
  },
  {
    name: 'clojure',
    label: 'Clojure',
    alias: ['clj', 'cljs', 'cljc', 'edn'],
    mode: 'clojure'
  },
  {
    name: 'cobol',
    label: 'COBOL',
    alias: ['cbl', 'cob', 'cpy'],
    mode: 'cobol'
  },
  {
    name: 'coffee',
    label: 'CoffeeScript',
    alias: ['coffee'],
    mode: 'coffee'
  },
  {
    name: 'coldfusion',
    label: 'ColdFusion',
    alias: ['cfm', 'cfc'],
    mode: 'coldfusion'
  },
  {
    name: 'cpp',
    label: 'C++',
    alias: ['cc', 'cpp', 'cxx', 'hh', 'c++', 'cplusplus'],
    mode: 'c_cpp'
  },
  {
    name: 'csharp',
    label: 'C#',
    alias: ['cs', 'c#'],
    mode: 'csharp'
  },
  {
    name: 'css',
    label: 'CSS',
    alias: ['cascade', 'stylesheet'],
    mode: 'css'
  },
  {
    name: 'curly',
    label: 'Curly',
    alias: [],
    mode: 'curly'
  },
  {
    name: 'd',
    label: 'D',
    alias: ['dlang'],
    mode: 'd'
  },
  {
    name: 'dockerfile',
    label: 'DockerFile',
    alias: ['docker'],
    mode: 'docker'
  },
  {
    name: 'dart',
    label: 'Dart',
    alias: [],
    mode: 'dart'
  },
  {
    name: 'diff',
    label: 'Diff',
    alias: [],
    mode: 'diff'
  },
  {
    name: 'django',
    label: 'Django',
    alias: [],
    mode: 'djt'
  },
  {
    name: 'dot',
    label: 'DOT',
    alias: ['gv'],
    mode: 'dot'
  },
  {
    name: 'eiffel',
    label: 'Eiffel',
    alias: [],
    mode: 'eiffel'
  },
  {
    name: 'ejs',
    label: 'EJS',
    alias: [],
    mode: 'ejs'
  },
  {
    name: 'elixir',
    label: 'Elixir',
    alias: ['ex', 'exs'],
    mode: 'elixir'
  },
  {
    name: 'elm',
    label: 'Elm',
    alias: [],
    mode: 'elm'
  },
  {
    name: 'erlang',
    label: 'Erlang',
    alias: ['erl', 'hrl'],
    mode: 'erlang'
  },
  {
    name: 'forth',
    label: 'Forth',
    alias: ['fs', 'fth'],
    mode: 'forth'
  },
  {
    name: 'freemaker',
    label: 'Freemaker',
    alias: ['ftl'],
    mode: 'ftl'
  },
  {
    name: 'gcode',
    label: 'G-code',
    alias: ['mpt', 'mpf', 'nc'],
    mode: 'gcode'
  },
  {
    name: 'gherkin',
    label: 'Gherkin',
    alias: ['cucumber'],
    mode: 'gherkin'
  },
  {
    name: 'gitignore',
    label: 'Gitignore',
    alias: ['git'],
    mode: 'gitignore'
  },
  {
    name: 'glsl',
    label: 'GLSL',
    alias: ['opengl', 'shading'],
    mode: 'glsl'
  },
  {
    name: 'golang',
    label: 'Go',
    alias: ['go'],
    mode: 'golang'
  },
  {
    name: 'groovy',
    label: 'Groovy',
    alias: [],
    mode: 'grooby'
  },
  {
    name: 'haml',
    label: 'Haml',
    alias: [],
    mode: 'haml'
  },
  {
    name: 'handlebars',
    label: 'Handlebars',
    alias: ['hbs'],
    mode: 'handlebars'
  },
  {
    name: 'haskell',
    label: 'Haskell',
    alias: ['hs', 'lhs'],
    mode: 'haskell'
  },
  {
    name: 'haxe',
    label: 'Haxe',
    alias: ['hx', 'hxml'],
    mode: 'haxe'
  },
  {
    name: 'html',
    label: 'HTML',
    alias: [],
    mode: 'html'
  },
  {
    name: 'html_ruby',
    label: 'HTML (Ruby)',
    alias: ['erb', 'rhtml'],
    mode: 'html_ruby'
  },
  {
    name: 'jsx',
    label: 'JSX',
    alias: ['es', 'babel', 'js', 'jsx', 'react'],
    mode: 'jsx'
  },
  {
    name: 'typescript',
    label: 'TypeScript',
    alias: ['ts'],
    mode: 'typescript'
  },
  {
    name: 'ini',
    label: 'INI file',
    alias: [],
    mode: 'ini'
  },
  {
    name: 'io',
    label: 'Io',
    alias: [],
    mode: 'io'
  },
  {
    name: 'jack',
    label: 'Jack',
    alias: [],
    mode: 'jack'
  },
  {
    name: 'jade',
    label: 'Jade',
    alias: [],
    mode: 'jade'
  },
  {
    name: 'java',
    label: 'Java',
    alias: [],
    mode: 'java'
  },
  {
    name: 'javascript',
    label: 'JavaScript',
    alias: ['js', 'jscript', 'babel', 'es'],
    mode: 'javascript'
  },
  {
    name: 'json',
    label: 'JSON',
    alias: [],
    mode: 'json'
  },
  {
    name: 'jsoniq',
    label: 'JSONiq',
    alias: ['query'],
    mode: 'jsoniq'
  },
  {
    name: 'jsp',
    label: 'JSP',
    alias: [],
    mode: 'jsp'
  },
  {
    name: 'julia',
    label: 'Julia',
    alias: [],
    mode: 'julia'
  },
  {
    name: 'latex',
    label: 'Latex',
    alias: ['tex'],
    mode: 'latex'
  },
  {
    name: 'lean',
    label: 'Lean',
    alias: [],
    mode: 'lean'
  },
  {
    name: 'less',
    label: 'Less',
    alias: [],
    mode: 'less'
  },
  {
    name: 'liquid',
    label: 'Liquid',
    alias: [],
    mode: 'liquid'
  },
  {
    name: 'lisp',
    label: 'Lisp',
    alias: ['lsp'],
    mode: 'lisp'
  },
  {
    name: 'livescript',
    label: 'LiveScript',
    alias: ['ls'],
    mode: 'livescript'
  },
  {
    name: 'logiql',
    label: 'LogiQL',
    alias: [],
    mode: 'logiql'
  },
  {
    name: 'lsl',
    label: 'LSL',
    alias: [],
    mode: 'lsl'
  },
  {
    name: 'lua',
    label: 'Lua',
    alias: [],
    mode: 'lua'
  },
  {
    name: 'luapage',
    label: 'Luapage',
    alias: [],
    mode: 'luapage'
  },
  {
    name: 'lucene',
    label: 'Lucene',
    alias: [],
    mode: 'lucene'
  },
  {
    name: 'makefile',
    label: 'Makefile',
    alias: [],
    mode: 'makefile'
  },
  {
    name: 'markdown',
    label: 'Markdown',
    alias: ['md'],
    mode: 'markdown'
  },
  {
    name: 'mask',
    label: 'Mask',
    alias: [],
    mode: 'mask'
  },
  {
    name: 'matlab',
    label: 'MATLAB',
    alias: [],
    mode: 'matlab'
  },
  {
    name: 'maze',
    label: 'Maze',
    alias: [],
    mode: 'maze'
  },
  {
    name: 'mel',
    label: 'MEL',
    alias: [],
    mode: 'mel'
  },
  {
    name: 'mipsassembler',
    label: 'MIPS assembly',
    alias: [],
    mode: 'mipsassembler'
  },
  {
    name: 'mushcode',
    label: 'MUSHCode',
    alias: [],
    mode: 'mushcode'
  },
  {
    name: 'mysql',
    label: 'MySQL',
    alias: [],
    mode: 'mysql'
  },
  {
    name: 'nix',
    label: 'Nix',
    alias: [],
    mode: 'nix'
  },
  {
    name: 'objectivec',
    label: 'Objective C',
    alias: ['objc'],
    mode: 'objectivec'
  },
  {
    name: 'ocaml',
    label: 'OCaml',
    alias: [],
    mode: 'ocaml'
  },
  {
    name: 'pascal',
    label: 'Pascal',
    alias: [],
    mode: 'pascal'
  },
  {
    name: 'perl',
    label: 'Perl',
    alias: [],
    mode: 'perl'
  },
  {
    name: 'pgsql',
    label: 'Postgres SQL',
    alias: ['postgres'],
    mode: 'pgsql'
  },
  {
    name: 'php',
    label: 'PHP',
    alias: [],
    mode: 'php'
  },
  {
    name: 'powershell',
    label: 'PowerShell',
    alias: ['ps1'],
    mode: 'powershell'
  },
  {
    name: 'praat',
    label: 'Praat',
    alias: [],
    mode: 'praat'
  },
  {
    name: 'prolog',
    label: 'Prolog',
    alias: ['pl', 'pro'],
    mode: 'prolog'
  },
  {
    name: 'properties',
    label: 'Properties',
    alias: [],
    mode: 'properties'
  },
  {
    name: 'protobuf',
    label: 'Protocol Buffers',
    alias: ['protocol', 'buffers'],
    mode: 'protobuf'
  },
  {
    name: 'python',
    label: 'Python',
    alias: ['py'],
    mode: 'python'
  },
  {
    name: 'r',
    label: 'R',
    alias: ['rlang'],
    mode: 'r'
  },
  {
    name: 'rdoc',
    label: 'RDoc',
    alias: [],
    mode: 'rdoc'
  },
  {
    name: 'ruby',
    label: 'Ruby',
    alias: ['rb'],
    mode: 'ruby'
  },
  {
    name: 'rust',
    label: 'Rust',
    alias: [],
    mode: 'rust'
  },
  {
    name: 'sass',
    label: 'Sass',
    alias: [],
    mode: 'sass'
  },
  {
    name: 'scad',
    label: 'SCAD',
    alias: [],
    mode: 'scad'
  },
  {
    name: 'scala',
    label: 'Scala',
    alias: [],
    mode: 'scala'
  },
  {
    name: 'scheme',
    label: 'Scheme',
    alias: ['scm', 'ss'],
    mode: 'scheme'
  },
  {
    name: 'scss',
    label: 'Scss',
    alias: [],
    mode: 'scss'
  },
  {
    name: 'sh',
    label: 'Shell',
    alias: ['shell'],
    mode: 'sh'
  },
  {
    name: 'sjs',
    label: 'StratifiedJS',
    alias: ['stratified'],
    mode: 'sjs'
  },
  {
    name: 'smarty',
    label: 'Smarty',
    alias: [],
    mode: 'smarty'
  },
  {
    name: 'snippets',
    label: 'Snippets',
    alias: [],
    mode: 'snippets'
  },
  {
    name: 'soy_template',
    label: 'Soy Template',
    alias: ['soy'],
    mode: 'soy_template'
  },
  {
    name: 'space',
    label: 'Space',
    alias: [],
    mode: 'space'
  },
  {
    name: 'sql',
    label: 'SQL',
    alias: [],
    mode: 'sql'
  },
  {
    name: 'sqlserver',
    label: 'SQL Server',
    alias: [],
    mode: 'sqlserver'
  },
  {
    name: 'stylus',
    label: 'Stylus',
    alias: [],
    mode: 'stylus'
  },
  {
    name: 'svg',
    label: 'SVG',
    alias: [],
    mode: 'svg'
  },
  {
    name: 'swift',
    label: 'Swift',
    alias: [],
    mode: 'swift'
  },
  {
    name: 'swig',
    label: 'SWIG',
    alias: [],
    mode: 'swig'
  },
  {
    name: 'tcl',
    label: 'Tcl',
    alias: [],
    mode: 'tcl'
  },
  {
    name: 'tex',
    label: 'TeX',
    alias: [],
    mode: 'tex'
  },
  {
    name: 'textile',
    label: 'Textile',
    alias: [],
    mode: 'textile'
  },
  {
    name: 'toml',
    label: 'TOML',
    alias: [],
    mode: 'toml'
  },
  {
    name: 'twig',
    label: 'Twig',
    alias: [],
    mode: 'twig'
  },
  {
    name: 'vala',
    label: 'Vala',
    alias: [],
    mode: 'vala'
  },
  {
    name: 'vbscript',
    label: 'VBScript',
    alias: ['vbs', 'vbe'],
    mode: 'vbscript'
  },
  {
    name: 'velocity',
    label: 'Velocity',
    alias: [],
    mode: 'velocity'
  },
  {
    name: 'verilog',
    label: 'Verilog',
    alias: [],
    mode: 'verilog'
  },
  {
    name: 'vhdl',
    label: 'VHDL',
    alias: [],
    mode: 'vhdl'
  },
  {
    name: 'xml',
    label: 'XML',
    alias: [],
    mode: 'xml'
  },
  {
    name: 'xquery',
    label: 'XQuery',
    alias: [],
    mode: 'xquery'
  },
  {
    name: 'yaml',
    label: 'YAML',
    alias: [],
    mode: 'yaml'
  }
]

export default modes
