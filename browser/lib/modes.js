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
    mode: 'abap',
    match: /\.abap$/i
  },
  {
    name: 'abc',
    label: 'ABC',
    alias: [],
    mode: 'abc',
    match: /\.abc$/i
  },
  {
    name: 'actionscript',
    label: 'ActionScript',
    alias: ['as'],
    mode: 'actionscript',
    match: /\.as$/i
  },
  {
    name: 'ada',
    label: 'Ada',
    alias: [],
    mode: 'ada',
    match: /\.ada$/i
  },
  {
    name: 'apache_conf',
    label: 'Apache config',
    alias: ['apache', 'conf'],
    mode: 'apache_conf',
    match: /\.conf$/i
  },
  {
    name: 'applescript',
    label: 'AppleScript',
    alias: ['scpt'],
    mode: 'applescript',
    match: /\.scpt$|\.scptd$|\.AppleScript$/i
  },
  {
    name: 'asciidoc',
    label: 'AsciiDoc',
    alias: ['ascii', 'doc', 'txt'],
    mode: 'asciidoc',
    match: /\.txt$/i
  },
  {
    name: 'assembly_x86',
    label: 'Assembly x86',
    alias: ['assembly', 'x86', 'asm'],
    mode: 'assembly_x86',
    match: /\.asm$/i
  },
  {
    name: 'autohotkey',
    label: 'AutoHotkey',
    alias: ['ahk'],
    mode: 'autohotkey',
    match: /\.ahk$/i
  },
  {
    name: 'batchfile',
    label: 'Batch file',
    alias: ['dos', 'windows', 'bat', 'cmd', 'btm'],
    mode: 'batchfile',
    match: /\.bat$|\.cmd$/i
  },
  {
    name: 'c',
    label: 'C',
    alias: ['c', 'h', 'clang', 'clang'],
    mode: 'c_cpp',
    match: /\.c$|\.h\+\+$/i
  },
  {
    name: 'cirru',
    label: 'Cirru',
    alias: [],
    mode: 'cirru',
    match: /\.cirru$/i
  },
  {
    name: 'clojure',
    label: 'Clojure',
    alias: ['clj', 'cljs', 'cljc', 'edn'],
    mode: 'clojure',
    match: /\.clj$|\.cljs$|\.cljc$|\.edn$/i
  },
  {
    name: 'cobol',
    label: 'COBOL',
    alias: ['cbl', 'cob', 'cpy'],
    mode: 'cobol',
    match: /\.cbl$|\.cob$\.cpy$/i
  },
  {
    name: 'coffee',
    label: 'CoffeeScript',
    alias: ['coffee'],
    mode: 'coffee',
    match: /\.coffee$|\.litcoffee$/i
  },
  {
    name: 'coldfusion',
    label: 'ColdFusion',
    alias: ['cfm', 'cfc'],
    mode: 'coldfusion',
    match: /\.cfm$|\.cfc$/i
  },
  {
    name: 'cpp',
    label: 'C++',
    alias: ['cc', 'cpp', 'cxx', 'hh', 'c++', 'cplusplus'],
    mode: 'c_cpp',
    match: /\.cc$|\.cpp$|\.cxx$|\.C$|\.c\+\+$|\.hh$|\.hpp$|\.hxx$|\.h\+\+$/i
  },
  {
    name: 'csharp',
    label: 'C#',
    alias: ['cs', 'c#'],
    mode: 'csharp',
    match: /\.cs$/i
  },
  {
    name: 'css',
    label: 'CSS',
    alias: ['cascade', 'stylesheet'],
    mode: 'css',
    match: /\.css$/i
  },
  {
    name: 'curly',
    label: 'Curly',
    alias: [],
    mode: 'curly',
    match: /\.curly$/i
  },
  {
    name: 'd',
    label: 'D',
    alias: ['dlang'],
    mode: 'd',
    match: /\.d$/i
  },
  {
    name: 'dockerfile',
    label: 'DockerFile',
    alias: ['docker'],
    mode: 'docker',
    match: /Dockerfile$/i
  },
  {
    name: 'dart',
    label: 'Dart',
    alias: [],
    mode: 'dart',
    match: /\.dart$/i
  },
  {
    name: 'diff',
    label: 'Diff',
    alias: [],
    mode: 'diff',
    match: /\.diff$|\.patch$/i
  },
  {
    name: 'django',
    label: 'Django',
    alias: [],
    mode: 'djt',
    match: /\.djt$/i
  },
  {
    name: 'dot',
    label: 'DOT',
    alias: ['gv'],
    mode: 'dot',
    match: /\.gv$|\.dot/i
  },
  {
    name: 'eiffel',
    label: 'Eiffel',
    alias: [],
    mode: 'eiffel',
    match: /\.e$/i
  },
  {
    name: 'ejs',
    label: 'EJS',
    alias: [],
    mode: 'ejs',
    match: /\.ejs$/i
  },
  {
    name: 'elixir',
    label: 'Elixir',
    alias: ['ex', 'exs'],
    mode: 'elixir',
    match: /\.ex$|\.exs$/i
  },
  {
    name: 'elm',
    label: 'Elm',
    alias: [],
    mode: 'elm',
    match: /\.elm$/i
  },
  {
    name: 'erlang',
    label: 'Erlang',
    alias: ['erl', 'hrl'],
    mode: 'erlang',
    match: /\.erl$|\.hrl$/i
  },
  {
    name: 'forth',
    label: 'Forth',
    alias: ['fs', 'fth'],
    mode: 'forth',
    match: /\.fs$|\.fth$/i
  },
  {
    name: 'freemaker',
    label: 'Freemaker',
    alias: ['ftl'],
    mode: 'ftl',
    match: /\.ftl$/i
  },
  {
    name: 'gcode',
    label: 'G-code',
    alias: ['mpt', 'mpf', 'nc'],
    mode: 'gcode',
    match: /\.mpt$|\.mpf$|\.nc$/i
  },
  {
    name: 'gherkin',
    label: 'Gherkin',
    alias: ['cucumber'],
    mode: 'gherkin',
    match: /\.feature$/i
  },
  {
    name: 'gitignore',
    label: 'Gitignore',
    alias: ['git'],
    mode: 'gitignore',
    match: /\.gitignore$/i
  },
  {
    name: 'glsl',
    label: 'GLSL',
    alias: ['opengl', 'shading'],
    mode: 'glsl',
    match: /\.vert$|\.frag/i
  },
  {
    name: 'golang',
    label: 'Go',
    alias: ['go'],
    mode: 'golang',
    match: /\.go$/i
  },
  {
    name: 'groovy',
    label: 'Groovy',
    alias: [],
    mode: 'grooby',
    match: /\.groovy$/i
  },
  {
    name: 'haml',
    label: 'Haml',
    alias: [],
    mode: 'haml',
    match: /\.haml$/i
  },
  {
    name: 'handlebars',
    label: 'Handlebars',
    alias: ['hbs'],
    mode: 'handlebars',
    match: /\.hbs$/i
  },
  {
    name: 'haskell',
    label: 'Haskell',
    alias: ['hs', 'lhs'],
    mode: 'haskell',
    match: /\.hs$|\.lhs$/i
  },
  {
    name: 'haxe',
    label: 'Haxe',
    alias: ['hx', 'hxml'],
    mode: 'haxe',
    match: /\.hx$|\.hxml$/i
  },
  {
    name: 'html',
    label: 'HTML',
    alias: [],
    mode: 'html',
    match: /\.html$/i
  },
  {
    name: 'html_ruby',
    label: 'HTML (Ruby)',
    alias: ['erb', 'rhtml'],
    mode: 'html_ruby',
    match: /\.erb$|\.rhtml$/i
  },
  {
    name: 'jsx',
    label: 'JSX',
    alias: ['es', 'babel', 'js', 'jsx', 'react'],
    mode: 'jsx',
    match: /\.jsx$/i
  },
  {
    name: 'typescript',
    label: 'TypeScript',
    alias: ['ts'],
    mode: 'typescript',
    match: /\.ts$/i
  },
  {
    name: 'ini',
    label: 'INI file',
    alias: [],
    mode: 'ini',
    match: /\.ini$/i
  },
  {
    name: 'io',
    label: 'Io',
    alias: [],
    mode: 'io',
    match: /\.io$/i
  },
  {
    name: 'jack',
    label: 'Jack',
    alias: [],
    mode: 'jack',
    match: /\.jack$/i
  },
  {
    name: 'pug',
    label: 'Pug(Jade)',
    alias: ['jade'],
    mode: 'jade',
    match: /\.jade$|\.pug$/i
  },
  {
    name: 'java',
    label: 'Java',
    alias: [],
    mode: 'java',
    match: /\.java$/i
  },
  {
    name: 'javascript',
    label: 'JavaScript',
    alias: ['js', 'jscript', 'babel', 'es'],
    mode: 'javascript',
    match: /\.js$/i
  },
  {
    name: 'json',
    label: 'JSON',
    alias: [],
    mode: 'json',
    match: /\.json$/i
  },
  {
    name: 'jsoniq',
    label: 'JSONiq',
    alias: ['query'],
    mode: 'jsoniq',
    match: /\.jq$|\.jqy$/i
  },
  {
    name: 'jsp',
    label: 'JSP',
    alias: [],
    mode: 'jsp',
    match: /\.jsp$/i
  },
  {
    name: 'julia',
    label: 'Julia',
    alias: [],
    mode: 'julia',
    match: /\.jl$/i
  },
  {
    name: 'latex',
    label: 'Latex',
    alias: ['tex'],
    mode: 'latex',
    match: /\.tex$/i
  },
  {
    name: 'lean',
    label: 'Lean',
    alias: [],
    mode: 'lean',
    match: /\.lean$/i
  },
  {
    name: 'less',
    label: 'Less',
    alias: [],
    mode: 'less',
    match: /\.less$/i
  },
  {
    name: 'liquid',
    label: 'Liquid',
    alias: [],
    mode: 'liquid',
    match: /\.liquid$/i
  },
  {
    name: 'lisp',
    label: 'Lisp',
    alias: ['lsp'],
    mode: 'lisp',
    match: /\.lisp$|\.lsp$|\.cl/i
  },
  {
    name: 'livescript',
    label: 'LiveScript',
    alias: ['ls'],
    mode: 'livescript',
    match: /\.ls$/i
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
    mode: 'lsl',
    match: /\.lsl$/i
  },
  {
    name: 'lua',
    label: 'Lua',
    alias: [],
    mode: 'lua',
    match: /\.lsl$/i
  },
  {
    name: 'luapage',
    label: 'Luapage',
    alias: [],
    mode: 'luapage',
    match: /\.lp$/i
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
    mode: 'makefile',
    match: /Makefile$/i
  },
  {
    name: 'markdown',
    label: 'Markdown',
    alias: ['md'],
    mode: 'markdown',
    match: /\.md$/i
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
    mode: 'matlab',
    match: /\.m$|\.mat$/i
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
    mode: 'mysql',
    match: /\.mysql$/i
  },
  {
    name: 'nix',
    label: 'Nix',
    alias: [],
    mode: 'nix',
    match: /\.nix$/i
  },
  {
    name: 'objectivec',
    label: 'Objective C',
    alias: ['objc'],
    mode: 'objectivec',
    match: /\.h$|\.m$|\.mm$/i
  },
  {
    name: 'ocaml',
    label: 'OCaml',
    alias: [],
    mode: 'ocaml',
    match: /\.ml$|\.mli$/i
  },
  {
    name: 'pascal',
    label: 'Pascal',
    alias: [],
    mode: 'pascal',
    match: /\.pp$|\.pas$|\.inc$/i
  },
  {
    name: 'perl',
    label: 'Perl',
    alias: [],
    mode: 'perl',
    match: /\.pl$|\.pm$|\.t$|\.pod$/i
  },
  {
    name: 'pgsql',
    label: 'Postgres SQL',
    alias: ['postgres'],
    mode: 'pgsql',
    match: /\.pgsql$/i
  },
  {
    name: 'php',
    label: 'PHP',
    alias: [],
    mode: 'php',
    match: /\.php$/i
  },
  {
    name: 'powershell',
    label: 'PowerShell',
    alias: ['ps1'],
    mode: 'powershell',
    match: /\.ps1$/i
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
    mode: 'prolog',
    match: /\.pl$/i
  },
  {
    name: 'properties',
    label: 'Properties',
    alias: [],
    mode: 'properties',
    match: /\.properties$/i
  },
  {
    name: 'protobuf',
    label: 'Protocol Buffers',
    alias: ['protocol', 'buffers'],
    mode: 'protobuf',
    match: /\.proto$/i
  },
  {
    name: 'python',
    label: 'Python',
    alias: ['py'],
    mode: 'python',
    match: /\.py$/i
  },
  {
    name: 'r',
    label: 'R',
    alias: ['rlang'],
    mode: 'r',
    match: /\.r$/i
  },
  {
    name: 'rdoc',
    label: 'RDoc',
    alias: [],
    mode: 'rdoc',
    match: /\.rdoc$/i
  },
  {
    name: 'ruby',
    label: 'Ruby',
    alias: ['rb'],
    mode: 'ruby',
    match: /\.rb$/i
  },
  {
    name: 'rust',
    label: 'Rust',
    alias: [],
    mode: 'rust',
    match: /\.rs$/i
  },
  {
    name: 'sass',
    label: 'Sass',
    alias: [],
    mode: 'sass',
    match: /\.sass$/i
  },
  {
    name: 'scad',
    label: 'SCAD',
    alias: [],
    mode: 'scad',
    match: /\.scad$/i
  },
  {
    name: 'scala',
    label: 'Scala',
    alias: [],
    mode: 'scala',
    match: /\.scala$|\.sc$/i
  },
  {
    name: 'scheme',
    label: 'Scheme',
    alias: ['scm', 'ss'],
    mode: 'scheme',
    match: /\.scm$|\.ss$/i
  },
  {
    name: 'scss',
    label: 'Scss',
    alias: [],
    mode: 'scss',
    match: /\.scss$/i
  },
  {
    name: 'sh',
    label: 'Shell',
    alias: ['shell'],
    mode: 'sh',
    match: /\.sh$/i
  },
  {
    name: 'sjs',
    label: 'StratifiedJS',
    alias: ['stratified'],
    mode: 'sjs',
    match: /\.sjs$/i
  },
  {
    name: 'smarty',
    label: 'Smarty',
    alias: [],
    mode: 'smarty',
    match: /\.smarty$/i
  },
  {
    name: 'snippets',
    label: 'Snippets',
    alias: [],
    mode: 'snippets',
    match: /snippets$/i
  },
  {
    name: 'soy_template',
    label: 'Soy Template',
    alias: ['soy'],
    mode: 'soy_template',
    match: /\.soy$/i
  },
  {
    name: 'space',
    label: 'Space',
    alias: [],
    mode: 'space',
    match: /\.space$/i
  },
  {
    name: 'sql',
    label: 'SQL',
    alias: [],
    mode: 'sql',
    match: /\.sql$/i
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
    mode: 'stylus',
    match: /\.styl$/i
  },
  {
    name: 'svg',
    label: 'SVG',
    alias: [],
    mode: 'svg',
    match: /\.svg$/i
  },
  {
    name: 'swift',
    label: 'Swift',
    alias: [],
    mode: 'swift',
    match: /\.swift$/i
  },
  {
    name: 'swig',
    label: 'SWIG',
    alias: [],
    mode: 'swig',
    match: /\.i$|\.swg$/i
  },
  {
    name: 'tcl',
    label: 'Tcl',
    alias: [],
    mode: 'tcl',
    match: /\.tcl$/i
  },
  {
    name: 'tex',
    label: 'TeX',
    alias: [],
    mode: 'tex',
    match: /\.tex$/i
  },
  {
    name: 'textile',
    label: 'Textile',
    alias: [],
    mode: 'textile',
    match: /\.textile$/i
  },
  {
    name: 'toml',
    label: 'TOML',
    alias: [],
    mode: 'toml',
    match: /\.toml$/i
  },
  {
    name: 'twig',
    label: 'Twig',
    alias: [],
    mode: 'twig',
    match: /\.twig$/i
  },
  {
    name: 'vala',
    label: 'Vala',
    alias: [],
    mode: 'vala',
    match: /\.vala$|\.vapi$/i
  },
  {
    name: 'vbscript',
    label: 'VBScript',
    alias: ['vbs', 'vbe'],
    mode: 'vbscript',
    match: /\.vbs$|\.vbe$/i
  },
  {
    name: 'velocity',
    label: 'Velocity',
    alias: [],
    mode: 'velocity',
    match: /\.vm$/i
  },
  {
    name: 'verilog',
    label: 'Verilog',
    alias: [],
    mode: 'verilog',
    match: /\.v$/i
  },
  {
    name: 'vhdl',
    label: 'VHDL',
    alias: [],
    mode: 'vhdl',
    match: /\.vhdl$/i
  },
  {
    name: 'xml',
    label: 'XML',
    alias: [],
    mode: 'xml',
    match: /\.xml$/i
  },
  {
    name: 'xquery',
    label: 'XQuery',
    alias: [],
    mode: 'xquery',
    match: /\.xq$|\.xqy$|\.xquery$/i
  },
  {
    name: 'yaml',
    label: 'YAML',
    alias: [],
    mode: 'yaml',
    match: /\.yaml$/i
  }
]

export default modes
